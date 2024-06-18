import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  Button,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";

const Likes = () => {
  const [likedItemIds, setLikedItemIds] = useState<string[]>([]);
  const [likedItems, setLikedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemToRemove, setItemToRemove] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

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
        setLikedItems(likedItems.filter(item => item.item_id !== listingId));
        setLikedItemIds(likedItemIds.filter(item_id => item_id !== listingId));
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
  return (
    <SafeAreaView className="flex-1 items-center bg-primary">
      <Text className="text-2xl mt-16">LIKES</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={likedItems}
          keyExtractor={(item) => item.item_id}
          renderItem={({ item }) => (
            <View className="flex-2 m-2 p-4 bg-white rounded shadow">
              <Image
                source={{ uri: item.imageURLS[0] }}
                className="w-full h-48 rounded-t-lg"
              />
              <Text className="text-xl font-bold">{item.name}</Text>
              <Text className="text-gray-600">{item.description}</Text>
              <Text className="text-lg text-green-600">${item.price}</Text>
              <Text className="text-lg">{item.size}</Text>
              <Button
                title="remove"
                onPress={() => {
                  
                  removeLikedItem(item.item_id);
                }}
              />
            </View>
          )}
          ListEmptyComponent={<Text>No liked items found</Text>}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Likes;
