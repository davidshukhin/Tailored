import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import PagerView from "react-native-pager-view";
import * as ImagePicker from "expo-image-picker";
import { FullWindowOverlay } from "react-native-screens";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { decode } from "base64-arraybuffer";
import { supabase } from "../../lib/supabase";
import * as FileSystem from "expo-file-system";
import { router } from "expo-router";

interface FormState {
  images: string[];
  username: string;
  bio: string;
  profile_picture: string;
}

const initialFormState: FormState = {
  images: Array(6).fill(""),
  username: "",
  bio: "",
  profile_picture: "",
};

const Onboarding = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const barPosition = useRef(new Animated.Value(0)).current;
  const [form, setForm] = useState<FormState>(initialFormState);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pagerRef = useRef<PagerView>(null);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    Animated.spring(barPosition, {
      toValue: page,
      useNativeDriver: false,
    }).start();
  };

  const handlePageScroll = (event) => {
    const { position, offset } = event.nativeEvent;
    Animated.spring(barPosition, {
      toValue: position + offset,
      useNativeDriver: false,
    }).start();
  };

  const selectMultipleImages = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled) {
      const imageUris = result.assets.map((image) => image.uri);
      console.log(imageUris);
      setForm((prevForm) => ({ ...prevForm, images: imageUris }));
    }
  };

  const selectImage = async (index: number) => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const updatedImages = [...form.images];
      updatedImages[index] = imageUri;
      setForm((prevForm) => ({ ...prevForm, images: updatedImages }));
    } else {
      Alert.alert("Error", "Image selection was canceled");
    }
  };

  const selectProfilePicture = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;

      setProfilePicture(imageUri);
    } else {
      Alert.alert("Error", "Image selection was canceled");
    }
  };

  const handleNext = () => {
    if (pagerRef.current) {
      if (currentPage < 2) {
        pagerRef.current.setPage(currentPage + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const getButtonProps = () => {
    switch (currentPage) {
      case 0:
        return { title: "Continue", handlePress: handleNext };
      case 1:
        return { title: "Continue", handlePress: handleNext };
      case 2:
        return { title: "Submit", handlePress: handleSubmit };
      default:
        return { title: "Next", handlePress: handleNext };
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadedImageURLs: string[] = [];
    const uploadPromises = form.images.map(async (img) => {
      if (img) {
        try {
          console.log("Uploading image: ", img);
          const base64 = await FileSystem.readAsStringAsync(img, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const fileExtension = img.split(".").pop();
          const filePath = `${new Date().getTime()}.${fileExtension}`;
          const contentType = `image/${fileExtension}`;

          const { data, error } = await supabase.storage
            .from("images")
            .upload(filePath, decode(base64), { contentType });

          if (error) {
            console.error("Supabase upload error:", error);
          } else if (data) {
            const { data: publicUrlData } = supabase.storage
              .from("images")
              .getPublicUrl(filePath);
            const publicUrl = publicUrlData.publicUrl;
            if (publicUrl) {
              uploadedImageURLs.push(publicUrl);
              console.log("Image URL: ", publicUrl);
            }
          }
        } catch (err) {
          console.error("File upload error:", err);
        }
      }
    });
    return Promise.all(uploadPromises).then(() => uploadedImageURLs);
  };

  const uploadProfilePicture = async (): Promise<string | null> => {
    const img = profilePicture;
    if (img) {
      try {
        console.log("Uploading image: ", img);
        const base64 = await FileSystem.readAsStringAsync(img, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const fileExtension = img.split(".").pop();
        const filePath = `${new Date().getTime()}.${fileExtension}`;
        const contentType = `image/${fileExtension}`;

        const { data, error } = await supabase.storage
          .from("images")
          .upload(filePath, decode(base64), { contentType });

        if (error) {
          console.error("Supabase upload error:", error);
          return null;
        } else if (data) {
          const { data: publicUrlData } = supabase.storage
            .from("images")
            .getPublicUrl(filePath);
          const publicUrl = publicUrlData.publicUrl;
          if (publicUrl) {
            console.log("Image URL: ", publicUrl);
            return publicUrl;
          }
        }
      } catch (err) {
        console.error("File upload error:", err);
        return null;
      }
    } else {
      console.error("No image to upload");
      return null;
    }
    return null;
  };

  const submit = async (imageURLs: string[], profilePictureURL: string) => {
    const { data, error } = await supabase.from("users").insert([
      {
        username: form.username,
        bio: form.bio,
        profile_picture: profilePictureURL,
        user_photos: imageURLs,
      },
    ]);

    if (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Profile created successfully");
      router.replace("/home");
    }
  };

  const handleSubmit = async () => {
    setUploading(true);
    try {
      const profilePictureURL = await uploadProfilePicture();
      const uploadedImageURLs = await uploadImages();
      if (uploadedImageURLs.length > 0 && profilePictureURL) {
        await submit(uploadedImageURLs, profilePictureURL);
       
      } else {
        Alert.alert("Error", "Image upload failed");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred during submission");
    } finally {
      setUploading(false);

    }
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <Animated.View
        style={{
          height: 8,
          backgroundColor: "#7B73D3",
          width: "50%",
          bottom: 0,
          left: 0,
          transform: [
            {
              translateX: barPosition.interpolate({
                inputRange: [0, 2],
                outputRange: [0, 200], // Adjust this based on your screen width
              }),
            },
          ],
        }}
      />
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => handlePageChange(e.nativeEvent.position)}
        onPageScroll={handlePageScroll}
      >
        <View key="1" className="flex-1 items-center mt-16 ">
          <Text className="text-black text-2xl font-mbold">Interests</Text>
          <Text className="text-black text-center text-xs mt-8">
            Let everyone know your style by adding your niches and interests to
            your profile!
          </Text>
        </View>
        <View key="2" className="flex-1 items-center ">
          <Text className="text-black font-mbold text-2xl mt-16">
            Add photos
          </Text>
          <Text className="text-xs m-6">
            Add at least 2 photos of you and your style to continue as a buyer!
          </Text>
          <View className="flex-row flex-wrap justify-center">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <TouchableOpacity
                key={index}
                onPress={() => selectImage(index)}
                style={{
                  width: 100,
                  height: 140,
                  margin: 10,
                  borderWidth: 1,
                  borderColor: "gray",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 10,
                }}
              >
                {form.images[index] ? (
                  <Image
                    source={{ uri: form.images[index] }}
                    style={{ width: "100%", height: "100%", borderRadius: 10 }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text className="text-black">+</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View key="3" className="flex-1 items-center mt-16 ">
          <Text className="text-black text-2xl font-mbold">
            Finish building your profile
          </Text>
          <Text className="text-black text-center text-xs mt-8">
            Add a profile picture and a bio to complete your profile!
          </Text>

          <View>
            <TouchableOpacity
              onPress={() => selectProfilePicture()}
              style={{
                width: 140,
                height: 140,
                margin: 10,

                borderWidth: 1,
                borderColor: "gray",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 70,
              }}
            >
              {profilePicture ? (
                <Image
                  source={{ uri: profilePicture }}
                  style={{ width: 140, height: 140, borderRadius: 70 }}
                  resizeMode="cover"
                />
              ) : (
                <Text className="text-black text-center">
                  Upload a profile photo!
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            keyboardType="email-address"
          />
          <FormField
            title="Bio"
            value={form.bio}
            handleChangeText={(e) => setForm({ ...form, bio: e })}
            keyboardType="email-address"
          />
        </View>
      </PagerView>
      <View className="p-10 justify-center ">
        <CustomButton
          title={getButtonProps().title}
          handlePress={getButtonProps().handlePress}
          containerStyles="mt-7"
          // isLoading={isSubmitting}
        />
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;
