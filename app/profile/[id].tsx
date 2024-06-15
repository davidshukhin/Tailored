import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import { View, Text, SafeAreaView, Image, TouchableOpacity, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FlashList } from "@shopify/flash-list";
import { supabase } from "../../lib/supabase"; // Adjust the import based on your structure
import PagerView from "react-native-pager-view";

interface UserData {
  id: string;
  username: string;
  followers: number;
  following: number;
  likes: number;
  bio: string;
  profile_picture: string;
  user_photos: string[];
}

const UserProfileScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const barPosition = useRef(new Animated.Value(0)).current;
  const [listings, setListings] = useState([] as any);
  const [likeIds, setLikeIds] = useState([] as any); // Add this line
  const [likes, setLikes] = useState([] as any);

  useEffect(() => {
    if (id) {
      fetchUserProfile(id as string);
    }
  }, [id]);

  const fetchUserProfile = async (userId: string) => {
    try {
      let { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", userId)
        .single();

      if (error) throw error;
      if (user) setUser(user);
    } catch (error) {
      console.log(error);
    }

    try {
      let { data: listings, error } = await supabase
        .from("listings")
        .select("*")

        // Filters
        .eq("sellername", userId);

      if (listings) {
        setListings(listings);
      }
    } catch (error) {
      console.log(error);
    }

    try {
      let { data: likeIds, error } = await supabase
      .from("likes")
      .select("item_id")
      .eq("username", userId)

      if(likeIds)
        setLikeIds(likeIds)

    } catch (error) {
      console.log(error)
    }

    try {
      let { data: likes, error } = await supabase
        .from("listings")
        .select("*")
        .contains("id", [likeIds, "contains"]);

      if (likes) {
        setLikes(likes);
      }
    } catch (error) {
      console.log(error);
    }

  };

  if (!user) return <Text>Loading...</Text>;

  const renderUserPhotoItem = ({ item }: { item: string }) => (
    <Image source={{ uri: item }} className="w-24 h-24 m-1" />
  );
  const renderListingItem = ({ item }: { item: string }) => (
    <Image source={{ uri: item }} className="w-24 h-24 m-1" />
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    Animated.spring(barPosition, {
      toValue: page,
      useNativeDriver: false,
    }).start();
  };
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="items-center flex-1 bg-primary">
        <TouchableOpacity onPress={router.back} className="mt-4 p-2">
          <Text className="text-white">Back</Text>
        </TouchableOpacity>

        <View className="h-36 w-36 mt-4 rounded-full overflow-hidden border-4 border-white p-0.5">
          <Image
            className="h-full w-full"
            source={{ uri: user.profile_picture }}
            resizeMode="cover"
          />
        </View>

        <TouchableOpacity className="shadow-md absolute mt-48 w-16  h-8 rounded-full justify-center items-center ">
          <LinearGradient
            colors={["#7B73D3", "#7B73D3"]}
            start={[0, 0]}
            end={[1, 0]}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 33.59,
              width: "100%", // Ensure the gradient covers the entire button width
              paddingHorizontal: 10,
            }}
          >
            <Text className="text-xs color-white">Follow</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text className="mt-8 text-white">Fashion Designer</Text>
        <Text className="text-base font-bold text-white">
          {user.username}
        </Text>
        <Text className="text-xs text-white">{user.bio}</Text>

        <View className="flex flex-row flex-grow mt-10 space-x-20">
          <TouchableOpacity className="flex flex-col items-center">
            <Text className="text-white">{user.following}</Text>
            <Text className="text-white">Following</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex flex-col items-center">
            <Text className="text-white">{user.followers}</Text>
            <Text className="text-white">Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-col items-center">
            <Text className="text-white">{user.likes}</Text>
            <Text className="text-white">Likes</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-1 bg-white h-96">
        <View className="flex flex-row justify-around items-center h-12 bg-white">
          <TouchableOpacity onPress={() => handlePageChange(0)}>
            <Text
              className={`text-lg text-primary ${
                currentPage === 0 ? "font-bold" : "font-normal"
              }`}
            >
              Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePageChange(1)}>
            <Text
              className={`text-lg text-primary ${
                currentPage === 1 ? "font-bold" : "font-normal"
              }`}
            >
              Selling
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePageChange(2)}>
            <Text
              className={`text-lg text-primary ${
                currentPage === 2 ? "font-bold" : "font-normal"
              }`}
            >
              Wishlist
            </Text>
          </TouchableOpacity>
          <Animated.View
            style={{
              height: 4,
              backgroundColor: "#7B73D3",
              width: "50%",
              position: "absolute",
              bottom: 0,
              left: 0,
              transform: [
                {
                  translateX: barPosition.interpolate({
                    inputRange: [0, 2],
                    outputRange: [0, 200], // Adjust this based on your screen width
                  }),
                },
              ],
            }}
          />
        
        </View>
      <PagerView
          style={{ flex: 1 }}
          initialPage={0}
          onPageSelected={(e) => handlePageChange(e.nativeEvent.position)}
        >
          <View key="1" className="flex-1">
            <FlashList
              data={user.user_photos.map((photo) => ({ uri: photo }))}
              renderItem={({ item }) => (
                <Image source={{ uri: item.uri }} className="w-24 h-24 m-1" />
              )}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3} // Adjust the number of columns to fit your design
              estimatedItemSize={100}
              className="w-full h-full"
            />
          </View>
          <View key="2" className="flex-1">
          <FlashList
              data={listings.flatMap((listing) => listing.imageURLS[0])}
              renderItem={renderListingItem}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3} // Adjust the number of columns to fit your design
              estimatedItemSize={100}
              className="w-full h-full"
            />
          </View>
          <View key="3" className="flex-1 ">
           <FlashList 
           data={likes.flatMap((like) => like.imageURLS[0])}
           renderItem={renderListingItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            estimatedItemSize={100}
            className="w-full h-full"
           />
          </View>
        </PagerView>
        </View>
    </SafeAreaView>
  );
};

export default UserProfileScreen;
