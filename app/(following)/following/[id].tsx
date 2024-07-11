import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { supabase } from "../../../lib/supabase";
import {
  router,
  useLocalSearchParams,
  useGlobalSearchParams,
} from "expo-router";

interface UserData {
  user_id: string;
  username: string;
  profile_picture: string;
}

const Following = () => {
  const globalParams =useGlobalSearchParams();
  const id = globalParams.id;
  const [usersData, setUsersData] = useState<UserData[]>([]);

  useEffect(() => {
    console.log("Followers component mounted");
    console.log("user_id from params:", id);
    if (id) {
      fetchFollowers(id as string);
    } else {
      console.error("No user ID provided in params");
    }
  }, [id]);

  const fetchFollowers = async (id: string) => {
    try {
    
      const { data, error } = await supabase
        .from("followers")
        .select(
          `
          follower_id,
          users!followers_follower_id_fkey (
          user_id,
          username,
          profile_picture
        )
        `
        )
        .eq("follower_id", id);

      if (error) {
        throw error;
      }

      if (data) {
        
        const mappedData = data.map((item: any) => ({
          profile_picture: item.users.profile_picture,
          user_id: item.users.user_id,
          username: item.users.username,
        }));
       
        setUsersData(mappedData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <View className="flex flex-row items-center justify-between p-2 bg-white">
      <TouchableOpacity
        onPress={() => router.push(`/profile/${item.username}`)}
      >
        <View className="flex flex-row items-center">
          <Image
            source={{ uri: item.profile_picture }}
            className="w-16 h-16 rounded-full"
          />
          <Text className="ml-4 text-lg">{item.username}</Text>
        </View>
      </TouchableOpacity>
      
    </View>
  );

  return (
    <View className="flex-1">
      <FlashList
        renderItem={renderItem}
        data={usersData}
        keyExtractor={(item) => item.user_id}
        estimatedItemSize={100}
      />
    </View>
  );
};

export default Following;
