import {
  View,
  Text,
  ActivityIndicator,
  Button,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { MasonryFlashList } from "@shopify/flash-list";
import MasonryList from "@react-native-seoul/masonry-list";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Svg, G, Path } from "react-native-svg";

const Likes = () => {
  const [likedItemIds, setLikedItemIds] = useState<string[]>([]);
  const [likedItems, setLikedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemToRemove, setItemToRemove] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      await getLikedItemIds();
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchLikedItems = async () => {
      if (likedItemIds.length > 0) {
        await getLikedItems();
      }
      setLoading(false);
    };

    fetchLikedItems();
  }, [likedItemIds]);

  const getLikedItemIds = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (user) {
        const userId = user.id;
        let { data: liked_items, error: likedItemsError } = await supabase
          .from("liked_items")
          .select("item_id")
          .eq("user_id", userId);

        if (likedItemsError) throw likedItemsError;

        if (liked_items) {
          const itemIds = liked_items.map((item) => item.item_id);
          setLikedItemIds(itemIds);
        }
      } else {
        console.log("No user found");
      }
    } catch (error) {
      console.log("Error fetching liked item IDs:");
    }
  };

  const getLikedItems = async () => {
    try {
      let { data: listings, error: listingsError } = await supabase
        .from("listings")
        .select("*")
        .in("item_id", likedItemIds);

      if (listingsError) throw listingsError;

      if (listings) setLikedItems(listings);
    } catch (error) {
      console.log("Error fetching liked items:");
    }
  };

  const removeLikedItem = async (listingId: string) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (user) {
        const userId = user.id;
        console.log("Fetching liked item to delete");
        const { data: likedItem, error } = await supabase
          .from("liked_items")
          .select("id")
          .eq("user_id", userId)
          .eq("item_id", listingId)
          .single();

        if (error) throw error;

        console.log("Deleting liked item:", likedItem);
        const { error: deleteError } = await supabase
          .from("liked_items")
          .delete()
          .eq("id", likedItem.id);

        if (deleteError) throw deleteError;

        console.log("Item deleted from database");

        // Refresh the list
        setLikedItems(likedItems.filter((item) => item.item_id !== listingId));
        setLikedItemIds(
          likedItemIds.filter((item_id) => item_id !== listingId)
        );
      } else {
        console.log("No user found");
      }
    } catch (error) {
      console.log("Error removing liked item:");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getLikedItemIds();
    setRefreshing(false);
  };

  const overrideItemLayout = (layout, item) => {
    // Calculate height based on the image dimensions
    const imageWidth = layout.width / 2; // Adjust for numColumns=2
    const imageHeight = item.imageHeight || 200; // Default height if not defined
    layout.height = (imageHeight * imageWidth) / item.imageWidth;
    layout.width = layout.width; // Width is managed by the numColumns property
  };

  const renderItem = ({ item }) => {
    console.log("Rendering item:", item); // Debug log to check item data
    return (
      <TouchableOpacity onPress={() => router.push(`/product/${item.item_id}`)}>
        <View className="m-2  bg-white rounded-3xl shadow ">
          <Image
            source={{ uri: item.imageURLS[0] }}
            className="w-full rounded-3xl"
            contentFit="cover"
            style={{ height: 200 }} // Default height if item.height is not defined
            onError={(error) => console.log("Error loading image:", error)}
          />
          {/* <View className="flex-col w-full mt-2">
          <Text className="text-xl font-bold">{item.name}</Text>
          <Text className="text-lg text-green-600">${item.price}</Text>
        </View> */}

          <TouchableOpacity
            className="absolute rounded-full shadow top-3 left-32"
            onPress={() => {
              removeLikedItem(item.item_id);
            }}
          >
            <Svg
              width="50px"
              height="50px"
              viewBox="0 0 24.00 24.00"
              fill="none"
            >
              <G id="SVGRepo_bgCarrier" stroke-width="64"></G>
              <G
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></G>
              <G id="SVGRepo_iconCarrier">
                <Path
                  d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17"
                  stroke="#ffffff"
                  stroke-width="2.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></Path>
              </G>
            </Svg>
            
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 items-center bg-white">
      <Text className="text-2xl font-mbold text-black mt-4">Likes</Text>
      <View className="h-full w-full m-2">
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <MasonryFlashList
            data={likedItems}
            keyExtractor={(item) => item.item_id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={<Text className="flex-1 text-center text-xl text-white font-mbold">No liked items found</Text>}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            numColumns={2}
            estimatedItemSize={400}
            optimizeItemArrangement={true}
            overrideItemLayout={overrideItemLayout}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Likes;
