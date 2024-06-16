import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";

interface UserData {
  id: string;
  username: string;
  profile_picture: string;
}

const Search = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Fetch initial data
    fetchProfiles("");
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

  const renderItem = ({ item }: { item: UserData }) => (
    <TouchableOpacity onPress={() => router.push(`/profile/${item.username}`)}>
      <View className="flex flex-row items-center p-2">
        <Image
          source={{ uri: item.profile_picture }}
          className="w-16 h-16 rounded-full"
        />
        <Text className="ml-4 text-lg">{item.username}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-1 bg-primary">
        <TextInput
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Search profiles..."
          className="w-11/12 p-2 bg-white rounded-lg mt-4"
        />
        <FlashList
          data={userData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          estimatedItemSize={100}
          className="w-full mt-4"
        />
      </View>
    </SafeAreaView>
  );
};

export default Search;