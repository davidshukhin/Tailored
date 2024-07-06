import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { supabase } from "../../../lib/supabase";
import { router, useLocalSearchParams } from "expo-router";

interface UserData {
  user_id: string;
  username: string;
  profile_picture: string;
}

const Followers = () => {
  const { id } = useLocalSearchParams();
  const [usersData, setUsersData] = useState<UserData[]>([]);

  useEffect(() => {
    console.log("user_id:", id as string); // Debugging log
    fetchFollowers(id as string);
  }, [id]);

  const fetchFollowers = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("followers")
        .select(`
          follower_id,
          users (
           user_id
           
          ) 
        `)
        .eq("following_id", id);

      if (error) {
        throw error;
      }

      if (data) {
        console.log(data);
        const mappedData = data.map((item) => ({
          user_id: item.users.user_id,
          username: item.users.username,
          profile_picture: item.users.profile_picture,
        }));
        setUsersData(mappedData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({ item }: { item: UserData }) => (
    <View className="flex flex-row items-center justify-between p-2 bg-white shadow-md">
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
      <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-lg">
        <Text className="text-white">Message</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <Text>Followers</Text>
      <FlashList
        renderItem={renderItem}
        data={usersData}
        keyExtractor={(item) => item.user_id}
        estimatedItemSize={300}
      />
    </View>
  );
};

export default Followers;
