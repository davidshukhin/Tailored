import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { GestureHandlerRootView, TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import { supabase } from "../../../lib/supabase";


// Define a type for the chat item
type ChatItem = {
  id: number;
  buyer_id: string;
  seller_id: string;
  item_id: string;
  created_at: string;
  updated_at: string;
  listings: {
    item_id: string;
    name: string;
    price: number;
    imageURLS: string[];
  };
  users: {
    user_id: string;
    username: string;
    profile_picture: string;
  };
};


const Buying = () => {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [user, setUser] = useState<string>("");

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setUser(user.id);
      console.log(user.id);
    }
  };

  const fetchChats = async () => {
    try {
      let { data: chats, error } = await supabase
        .from("chats")
        .select(
          `
          *,
          listings (
            item_id,
            name,
            price,
        imageURLS
          ) ,
        users:users!seller_id (
          user_id,
          username,
          profile_picture
        )
        `
        )
        .eq("buyer_id", user);

      if (chats) {
        setChats(chats);
        console.log(chats);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({ item }: { item: ChatItem }) => (
    <View className="flex-row justify-start p-4 items-center">
      <TouchableOpacity
        onPress={() => router.push(`/product/${item.listings.item_id}`)}
      >
        <View className="h-16 w-16 mt-2 mr-2 rounded-full overflow-hidden border-2 border-gray-200 p-0.5 ">
          <View className="h-full w-full rounded-full overflow-hidden">
            <Image
              className="h-full w-full"
              source={{
                uri: item.listings.imageURLS[0],
              }}
              resizeMode="cover"
            />
          </View>
        </View>
      </TouchableOpacity>
      <View className="flex-1">
        <Text className="font-mbold text-lg ">{item.listings.name}</Text>
        <TouchableOpacity onPress={() => router.push(`/profile/${item.users.username}`)}>
        <Text className="font-mregular text-black">Seller: {item.users.username}</Text>
        </TouchableOpacity>
        <Text className="font-mregular text-black">Price: ${item.listings.price}</Text>
      </View>
      <TouchableOpacity onPress={() => router.push("/cart")}>
        <Image source={require('../../../assets/icons/cart.png')} className="w-8 h-8" />
      </TouchableOpacity>
    </View>
  );


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <FlashList
      data={chats}
      renderItem={renderItem}
      estimatedItemSize={200}
      keyExtractor={(item) => item.id.toString()}
    /></GestureHandlerRootView>
  );
};

export default Buying;
