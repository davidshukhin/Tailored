import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { supabase } from "../../lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import ConditionSelectionForm from "../../components/ConditionSelectionForm";
import SizeSelectorDropdown from "../../components/SizeSelectorDropdown";
import CategorySelectorDropdown from "../../components/CategorySelectorDropdown";
import ColorSelectorDropdown from "../../components/ColorSelectorDropdown";
import { Svg, Path } from "react-native-svg";
import { icons } from "../../constants";

interface FormState {
  name: string;
  brand: string;
  description: string;
  color: string[];
  price: number;
  tags: string[];
  images: string[];
  size: string;
  condition: string;
}

const initialFormState: FormState = {
  name: "",
  brand: "",
  description: "",
  price: 0,
  tags: [],
  color: [],
  images: [],
  size: "",
  condition: "",
};

const Create = () => {
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [size, setSize] = useState<string>("");
  const [sizeSelection, setSizeSelection] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [inputValue, setInputValue] = useState("");
  const [tagsList, setTagsList] = useState<string[]>([]);
  const clothingColors = [
    "Black",
    "White",
    "Gray",
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Orange",
    "Purple",
    "Pink",
    "Brown",
    "Beige",
    "Navy",
    "Khaki",
    "Olive",
    "Teal",
    "Burgundy",
    "Maroon",
    "Charcoal",
    "Cream",
    "Tan",
    "Magenta",
    "Turquoise",
    "Lavender",
    "Peach",
    "Slate",
    "Silver",
    "Gold",
    "Bronze",
    "Copper",
  ];

  const resetPage = () => {
    setForm(initialFormState);
    setPrice("");
    setTagsList([]);
    setSizeSelection([]);
    setCategory("");
    setSize("");
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
      const { error } = await supabase
        .from("listings")
        .insert([
          {
            name: form.name,
            brand: form.brand,
            description: form.description,
            color: form.color,
            price: price,
            tags: tagsList,
            imageURLS: imageURLs,
            size: size,
            condition: form.condition,
            category: category,
          },
        ])
        .select();

      if (error) {
        console.error(error);
      } else {
        Alert.alert("Success", "Item listed successfully");

        resetPage();
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
    setForm({ ...form, condition: condition });
  };

  const handleCategorySelect = (gender, category, subcategory) => {
    setCategory(subcategory);
    setSize("");
    if (gender === "Menswear") {
      if (category === "Footwear") {
        setSizeSelection([
          "US 3",
          "US 3.5",
          "US 4",
          "US 4.5",
          "US 5",
          "US 5.5",
          "US 6",
          "US 6.5",
          "US 7",
          "US 7.5",
          "US 8",
          "US 8.5",
          "US 9",
          "US 9.5",
          "US 10",
          "US 10.5",
          "US 11",
          "US 11.5",
          "US 12",
          "US 12.5",
          "US 13",
          "US 13.5",
          "US 14",
          "US 14.5",
          "US 15",
          "US 15.5",
          "US 16",
        ]);
      } else if (category === "Bottoms") {
        setSizeSelection([
          "28",
          "30",
          "32",
          "34",
          "36",
          "38",
          "40",
          "42",
          "44",
          "46",
          "48",
          "XS",
          "S",
          "M",
          "L",
          "XL",
          "XXL",
        ]);
      } else {
        setSizeSelection(["XS", "S", "M", "L", "XL", "XXL", "OS"]);
      }
      //handle womens
    } else if(gender === "Womenswear") {
      if (category === "Footwear") {
        setSizeSelection([
          "US 3",
          "US 3.5",
          "US 4",
          "US 4.5",
          "US 5",
          "US 5.5",
          "US 6",
          "US 6.5",
          "US 7",
          "US 7.5",
          "US 8",
          "US 8.5",
          "US 9",
          "US 9.5",
          "US 10",
          "US 10.5",
          "US 11",
          "US 11.5",
          "US 12",
          "US 12.5",
          "US 13",
          "US 13.5",
          "US 14",
        ]);
      } else if (category === "Bottoms") {
        setSizeSelection([
          "0",
          "2",
          "4",
          "6",
          "8",
          "10",
          "12",
          "14",
          "16",
          "18",
          "20",
        ]);
      } else {
        setSizeSelection(["XS", "S", "M", "L", "XL", "XXL", "OS"]);
      }
    }
  };
  const handlePriceChange = (text: string) => {
    // Ensure up to 5 digits before the decimal and up to two decimal places are accepted
    if (/^\d{0,4}(\.\d{0,2})?$/.test(text)) {
      setPrice(text);
    }
  };

  const handleSizeSelect = (size) => {
    setSize(size);
    console.log(size);
  };

  const handleAddTag = () => {
    let trimmedValue = inputValue.trim();
    if (trimmedValue !== "") {
      if (trimmedValue.startsWith("#")) {
        trimmedValue = trimmedValue.substring(1); // Remove the first character '#'
      }
      if (tagsList.length < 4) {
        setTagsList((prevTags) => [...prevTags, trimmedValue]);
      } else {
        // Optionally handle when tag limit is reached
        console.log("Tag limit reached.");
      }
    }
    setInputValue("");
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
  };

  const handleBlur = () => {
    handleAddTag();
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTagsList((prevTags) =>
      prevTags.filter((_, index) => index !== indexToRemove)
    );
  };

  if (uploading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-mbold">Uploading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView className="px-4 my-6" showsVerticalScrollIndicator={false}>
        <View className="mt-7 space-y-2">
          <Text className="text-base text-black font-mbold">Upload images</Text>
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
                  <Text className="text-xl">+</Text>
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
          <View className="mt-2 bg-white">
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
        <View className="flex-row items-start justify-between mr-2">
          <CategorySelectorDropdown
            label={"Choose category"}
            onSubcategorySelect={handleCategorySelect}
          />
          <SizeSelectorDropdown
            onSizeSelect={handleSizeSelect}
            sizes={sizeSelection}
          />
        </View>
        <View className="mt-4 mb-4 bg-white ">
          <View className="flex-row mb-2 justify-between">
            <View>
              <Text className="text-base text-black font-mbold mb-2">
                Add tags (max 4){" "}
              </Text>
              <TextInput
                className="h-14 border-2 border-gray-300 p-4 rounded-xl w-60 "
                value={inputValue}
                onChangeText={handleInputChange}
                onBlur={handleBlur}
                placeholder="Add up to 4 tags"
              />
            </View>
            <TouchableOpacity
              className="justify-center mt-8 items-center right-16"
              onPress={handleAddTag}
            >
              <Image source={icons.plus} className="w-10 h-10" />
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap items-center mt-2">
            {tagsList.map((tag, index) => (
              <View
                key={index}
                className="bg-secondary rounded-3xl py-1 px-3 m-1"
              >
                <Text className="font-mbold text-primary">#{tag}</Text>
                <TouchableOpacity
                  className="absolute right-0 top-0"
                  onPress={() => handleRemoveTag(index)}
                >
                  <Svg
                    width="20px"
                    height="20px"
                    viewBox="0 0 1024 1024"
                    fill="#000000"
                  >
                    <Path
                      d="M512 897.6c-108 0-209.6-42.4-285.6-118.4-76-76-118.4-177.6-118.4-285.6 0-108 42.4-209.6 118.4-285.6 76-76 177.6-118.4 285.6-118.4 108 0 209.6 42.4 285.6 118.4 157.6 157.6 157.6 413.6 0 571.2-76 76-177.6 118.4-285.6 118.4z m0-760c-95.2 0-184.8 36.8-252 104-67.2 67.2-104 156.8-104 252s36.8 184.8 104 252c67.2 67.2 156.8 104 252 104 95.2 0 184.8-36.8 252-104 139.2-139.2 139.2-364.8 0-504-67.2-67.2-156.8-104-252-104z"
                      fill=""
                    />
                    <Path
                      d="M707.872 329.392L348.096 689.16l-31.68-31.68 359.776-359.768z"
                      fill=""
                    />
                    <Path d="M328 340.8l32-31.2 348 348-32 32z" fill="" />
                  </Svg>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
        <View className="flex-row items-start justify-between mb-2">
          <View className=" bg-white flex-1">
            <ColorSelectorDropdown
              onColorSelect={(e) => setForm({ ...form, color: e })}
              colors={clothingColors}
            />
          </View>
          <View className=" bg-white ml-4 flex-1 ">
            <Text className="text-base font-mbold mb-2 mt-4">
              Enter Item Price
            </Text>
            <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-gray-300 focus:border-black flex flex-row items-center">
              <Text className="mr-10 text-base font-mregular">$</Text>
              <TextInput
                className="font-mregular text-base flex-1"
                placeholder="00.00"
                keyboardType="numeric"
                onChangeText={handlePriceChange}
                value={price}
              />
            </View>
          </View>
        </View>
        <FormField
          title="Description"
          value={form.description}
          placeholder="Item description"
          handleChangeText={(e) => setForm({ ...form, description: e })}
          otherStyles={{ marginTop: 7 }}
        />
        <View className="mb-16">
        <CustomButton
          title="List item"
          handlePress={handleListItem}
          isLoading={uploading}
        />
        </ View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
