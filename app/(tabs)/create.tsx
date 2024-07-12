import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
  Button,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { supabase } from "../../lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import ConditionSelectionForm from "../../components/ConditionSelectionForm";
import SizeSelectorDropdown from "../../components/SizeSelectorDropdown";
import SizeDropdown from "../../components/SizeDropdown";

interface FormState {
  name: string;
  brand: string;
  description: string;
  color: string;
  price: number;
  tags: string;
  images: string[];
}

const initialFormState: FormState = {
  name: "",
  brand: "",
  description: "",
  price: 0,
  tags: "",
  color: "",
  images: [],
};

const Create = () => {
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<FormState>(initialFormState);

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

  const listItem = async (imageURLs: string[]) => {
    if (
      !form.name ||
      !form.description ||
      !form.brand ||
      !form.color ||
      !form.tags ||
      imageURLs.length === 0
    ) {
      return Alert.alert(
        "Error",
        "Please fill all fields and upload at least one image"
      );
    }

    setUploading(true);
    try {
      const { data, error } = await supabase
        .from("listings")
        .insert([
          {
            name: form.name,
            brand: form.brand,
            description: form.description,
            //color: form.color,
            //price: form.price,
            //tags: form.tags,
            imageURLS: imageURLs,
          },
        ])
        .select();

      if (error) {
        console.error(error);
        // Alert.alert("Error", error.message);
      } else {
        Alert.alert("Success", "Item listed successfully");
        setForm(initialFormState);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while listing the item");
    } finally {
      setUploading(false);
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadedImageURLs: string[] = [];
    const uploadPromises = form.images.map(async (img) => {
      const base64 = await FileSystem.readAsStringAsync(img, {
        encoding: "base64",
      });

      const filePath = `${new Date().getTime()}.${
        img === "image" ? "png" : "jpeg"
      }`;
      const contentType = img === "image" ? "image/png" : "image/jpeg";
      const { data, error } = await supabase.storage
        .from("images")
        .upload(filePath, decode(base64), { contentType });

      if (data) {
        const { data } = supabase.storage.from("images").getPublicUrl(filePath);
        const publicUrl = data.publicUrl;
        if (!error && publicUrl) {
          uploadedImageURLs.push(publicUrl);
          console.log("Image URL:", publicUrl);
        }
      }
    });
    return Promise.all(uploadPromises).then(() => uploadedImageURLs);
  };

  const handleListItem = async () => {
    setUploading(true);
    uploadImages()
      .then((uploadedImageURLs) => {
        if (uploadedImageURLs.length > 0) {
          return listItem(uploadedImageURLs);
        } else {
          Alert.alert("Error", "Image upload failed");
        }
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const handleConditionSelect = (condition) => {
    console.log("Selected condition:", condition);
    // Here you can update your state or make an API call with the selected condition
  };
  const handleSizeSelect = (size) => {
    //setSelectedSize(size);
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView className="px-4 my-6" showsVerticalScrollIndicator={false}>
        <View className="mt-7 space-y-2">
          <Text className="text-base text-black font-mregular">
            Upload images
          </Text>
          <TouchableOpacity onPress={selectMultipleImages}>
            {form.images.length > 0 ? (
              <ScrollView horizontal>
                {form.images.map((image, index) => (
                  <Image
                    key={index}
                    source={{ uri: image }}
                    className="w-32 h-32 mr-2 rounded-2xl"
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                  <Text>UPLOAD</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <FormField
          title="Name"
          value={form.name}
          placeholder="Item Name"
          handleChangeText={(e) => setForm({ ...form, name: e })}
          otherStyles={{ marginTop: 10 }}
        />
        <View className="flex-row items-start justify-between">
          <View className="m-2 bg-white">
            <ConditionSelectionForm onConditionSelect={handleConditionSelect} />
          </View>
          <View className="m-2 bg-white flex-1">
            <FormField
              title="Brand"
              value={form.brand}
              placeholder="Brand Name"
              handleChangeText={(e) => setForm({ ...form, brand: e })}
              otherStyles={{ marginTop: 10 }}
            />
          </View>
        </View>
        <View className="flex-row items-start justify-between">
        <SizeSelectorDropdown onSizeSelect={handleSizeSelect} />
        
          </View>
          <View className="mt-4 mb-4 bg-white flex-1">
          <FormField
          title="Tags"
          value={form.tags}
          placeholder="Tags"
          handleChangeText={(e) => setForm({ ...form, tags: e })}
          otherStyles={{ height: "1rem" }}
        />
            </View>
        <FormField
          title="Description"
          value={form.description}
          placeholder="Item description"
          handleChangeText={(e) => setForm({ ...form, description: e })}
          otherStyles={{ marginTop: 7 }}
        />
        <FormField
          title="Color"
          value={form.color}
          placeholder="Color"
          handleChangeText={(e) => setForm({ ...form, color: e })}
          otherStyles={{ marginTop: 7 }}
        />
       

        <CustomButton
          title="List item"
          handlePress={handleListItem}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
