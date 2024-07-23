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
import e from "cors";

interface FormState {
  images: string[];
  username: string;
  bio: string;
  profile_picture: string;
  name: string;
}

const initialFormState: FormState = {
  images: Array(6).fill(""),
  username: "",
  bio: "",
  profile_picture: "",
  name: "",

};

const genderOptions = [
  "Womenswear",
  "Menswear",
  "No preference"
];


const interests = [
  "Vintage",
  "Retro",
  "Boho",
  "Grunge",
  "Streetwear",
  "Minimalist",
  "Punk",
  "Hipster",
  "Preppy",
  "Athleisure",
  "Gothic",
  "Casual",
  "Formal",
  "Eco-friendly",
  "Designer",
  "Y2K Revival",
  "Cottagecore",
  "E-girl/E-boy",
  "Dark Academia",
  "Light Academia",
  "Grunge Revival",
  "Normcore",
  "Indie Sleaze",
  "Clean Girl Aesthetic",
  "Coastal Grandmother",
  "Barbiecore",
  "Gorpcore",
  "Balletcore",
  "Soft Girl",
  "Alt",
  "Coconut Girl",
  "Fairycore",
  "Cyber Y2K",
  "Goblincore",
  "Punk Revival",
  "Mermaidcore",
  "Twee Revival",
  "Dreamcore",
  "Avant Apocalypse",
  "Old Money Aesthetic",
  "Regencycore",
  "Eclectic Grandpa",
  "Coquette",
];

const Onboarding = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const barPosition = useRef(new Animated.Value(0)).current;
  const [form, setForm] = useState<FormState>(initialFormState);
  const [profilePicture, setProfilePicture] = useState<string >("");
  const [uploading, setUploading] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [gender, setGender] = useState<string>("");

  const pagerRef = useRef<PagerView>(null);



  const toggleInterest = (interest) => {
    setSelectedInterests((prevInterests) =>
      prevInterests.includes(interest)
        ? prevInterests.filter((i) => i !== interest)
        : [...prevInterests, interest]
    );
  };

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
      if (currentPage < 3) {
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
        return { title: "Continue", handlePress: handleNext };
      case 3:
        return { title: "Submit", handlePress: handleSubmit };
      default:
        return { title: "Next", handlePress: handleNext };
    }
  };

  const uploadImages = async (): Promise<{ successful: string[]; failed: string[] }> => {
    const successful: string[] = [];
    const failed: string[] = [];
  
    console.log("Starting upload process with images:", form.images);
  
    for (const img of form.images) {
      if (img) {
        try {
          console.log("Uploading image:", img);
          const base64 = await FileSystem.readAsStringAsync(img, {
            encoding: FileSystem.EncodingType.Base64,
          });
  
          const fileExtension = img.split(".").pop() || 'jpg'; // Fallback to 'jpg' if no extension
          const filePath = `${new Date().getTime()}.${fileExtension}`;
          const contentType = `image/${fileExtension}`;
  
          const { data, error } = await supabase.storage
            .from("images")
            .upload(filePath, decode(base64), { contentType });
  
          if (error) {
            console.error("Supabase upload error:", error);
            failed.push(img);
          } else if (data) {
            const { data: publicUrlData } = supabase.storage
              .from("images")
              .getPublicUrl(filePath);
            const publicUrl = publicUrlData.publicUrl;
            if (publicUrl) {
              successful.push(publicUrl);
              console.log("Image successfully uploaded. URL:", publicUrl);
            } else {
              console.error("Failed to get public URL for uploaded image");
              failed.push(img);
            }
          }
        } catch (err) {
          console.error("File upload error:", err);
          failed.push(img);
        }
      }
    }
  
    console.log(`Upload process completed. Successful: ${successful.length}, Failed: ${failed.length}`);
    return { successful, failed };
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
      return "";
    }
    return null;
  };

  const submit = async (imageURLs: string[], profilePictureURL: string) => {


    const { data, error } = await supabase.from("users").upsert([
      {
        username: form.username,
        bio: form.bio,
        profile_picture: profilePictureURL,
        user_photos: imageURLs,
        interests: selectedInterests,
        gender: gender,
        completed_onboarding: true,
        name: form.name,

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
      const profilePictureURL = await uploadProfilePicture().catch((error) => {
        console.error("Profile picture upload failed:", error);
        return null;
      });
      const { successful, failed } = await uploadImages();
      if (successful.length > 0) {
        await submit(successful, profilePictureURL || "");
        if (failed.length > 0) {
          console.warn(`${failed.length} images failed to upload`);
          // Optionally, you could show a warning to the user here
        }
      } else {
        Alert.alert("Error", `All image uploads failed. ${failed.length} images could not be uploaded.`);
      }
    } catch (error) {
      console.error("Submission error:", error);
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
                inputRange: [0, 3],
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
        <View key="1" className="flex-1 items-center mt-16 ml-8 mr-8">
          <Text className="text-black text-2xl font-mbold mb-8">
            What are you looking for?
          </Text>
          {genderOptions.map((genderOptions) => (
                <TouchableOpacity
                  key={genderOptions}
                  onPress={() => { setGender(genderOptions); handleNext() }}
                  className={`m-2 px-4 py-1 rounded-full ${
                  gender === genderOptions
                      ? "bg-white border-primary border-2 "
                      : "bg-white border-2 border-gray-400"
                  }`}
                >
                  <Text
                    className={`text-center ${
                     gender === genderOptions
                        ? "text-primary"
                        : "text-gray-400"
                    }`}
                  >
                    {genderOptions}
                  </Text>
                </TouchableOpacity>
              ))}
        </View>
        <View key="2" className="flex-1 items-center mt-16 ml-8 mr-8">
          <Text className="text-black text-2xl font-mbold">Interests</Text>
          <Text className="text-black text-center text-xs mt-8">
            Let everyone know your style by adding your niches and interests to
            your profile!
          </Text>
          <ScrollView>
            <View className="flex flex-row flex-wrap justify-center">
              {interests.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  onPress={() => toggleInterest(interest)}
                  className={`m-2 px-4 py-1 rounded-full ${
                    selectedInterests.includes(interest)
                      ? "bg-white border-primary border-2 "
                      : "bg-white border-2 border-gray-400"
                  }`}
                >
                  <Text
                    className={`text-center ${
                      selectedInterests.includes(interest)
                        ? "text-primary"
                        : "text-gray-400"
                    }`}
                  >
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        <View key="3" className="flex-1 items-center ">
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
                  <Text className="text-primary">+</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View key="4" className="flex-1 items-center m-4">
          <Text className="text-black text-2xl font-mbold mt-12">
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
            placeholder="Enter your username!"
          />
           <FormField
            title="Name"
            value={form.name}
            handleChangeText={(e) => setForm({ ...form, name: e })}
            keyboardType="email-address"
            placeholder="Enter your name!"
          />
          <FormField
            title="Bio"
            value={form.bio}
            handleChangeText={(e) => setForm({ ...form, bio: e })}
            keyboardType="email-address"
            placeholder="Tell us about yourself!"
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
