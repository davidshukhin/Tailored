import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";

interface UserData {
  user_id: string;
  username: string;
  profile_picture: string;
}

const Search = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Fetch initial data
   // fetchProfiles();
  }, []);

  const fetchProfiles = async (query: string) => {
    try {
      let { data: profiles, error } = await supabase
        .from("users")
        .select("*")
        .ilike("username", `%${query}%`);

      if (error) {
        throw error;
      }
      if (profiles) {
        setUserData(profiles);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchProfiles(query);
  };

  const navigateToChat = (recipientId: string, recipientName: string) => {
    router.push(`/chat/${recipientId}?name=${recipientName}`);
  };


  const renderItem = ({ item }: { item: UserData }) => (
    <View className="flex flex-row items-center justify-between p-2">
      <TouchableOpacity onPress={() => router.push(`/profile/${item.username}`)}>
        <View className="flex flex-row items-center">
          <Image
            source={{ uri: item.profile_picture }}
            className="w-16 h-16 rounded-full"
          />
          <Text className="ml-4 text-lg">{item.username}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
      onPress={() => navigateToChat(item.user_id, item.username)}
        // onPress={() => router.push({
        //   pathname: "/chat",
        //   params: { recipientId: item.user_id, recipientName: item.username }
        // })}
        className="bg-blue-500 px-4 py-2 rounded-lg"
      >
        <Text className="text-white">Message</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-1 bg-primary">
        <TextInput
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Search profiles..."
          className="w-11/12 p-2 bg-white rounded-lg mt-4 ml-4"
        />
        <FlashList
          data={userData}
          renderItem={renderItem}
          keyExtractor={(item) => item.user_id}
          estimatedItemSize={100}
          className="w-full mt-4"
        />
      </View>
    </SafeAreaView>
  );
};

export default Search;
