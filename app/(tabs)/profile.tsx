import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "../../components/CustomButton";
import PagerView from "react-native-pager-view";
import { supabase } from "../../lib/supabase";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { FlashList, MasonryFlashList } from "@shopify/flash-list";
import Svg, { Path } from "react-native-svg";
import { router } from "expo-router";
import { icons } from "../../constants";

const Profile = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const barPosition = useRef(new Animated.Value(0)).current;
  const [userData, setUserData] = useState({
    username: "",
    followers: 0,
    following: 0,
    likes: 0,
    bio: "",
    profile_picture: "",
    user_photos: [],
  });
  const [listings, setListings] = useState([] as any);
  const pagerViewRef = useRef<PagerView>(null);

  const [user, setUser] = useState<string>("");
  const scrollY = useRef(new Animated.Value(0)).current;
  const screenHeight = Dimensions.get("window").height;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [screenHeight * 0.3, 0],
    extrapolate: "clamp",
  });

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setUser(user.id);
      getUserData(user.id);
    }
  };

  const getUserData = async (user_id: string) => {
    try {
      let { data: users, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user_id)
        .single();

      if (error) {
        throw error;
      }
      if (users) {
        setUserData({
          username: users.username,
          followers: users.followers,
          following: users.following,
          likes: users.likes,
          bio: users.bio,
          profile_picture: users.profile_picture,
          user_photos: users.user_photos,
        });
        console.log(users.user_photos[0]);
      }
    } catch (error) {
      console.log(error);
    }

    try {
      let { data: listings, error } = await supabase
        .from("listings")
        .select("*")

        // Filters
        .eq("user_id", user_id);

      if (listings) {
        setListings(listings);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    Animated.spring(barPosition, {
      toValue: page,
      useNativeDriver: false,
    }).start();
  };

  const renderItem = ({ item }) => (
    <Image source={{ uri: item }} className="w-24 h-24 m-1" />
  );

  const renderListingItem = ({ item }: { item }) => (
    <TouchableOpacity onPress={() => router.replace(`/product/${item.id}`)}>
      <Image source={{ uri: item.imageURLS[0] }} className="w-24 h-24 m-1" />
    </TouchableOpacity>
  );

  const doNothing = () => {};

  const handleSettings = () => {
    router.replace("/settings");
  };

  const handleEdit = () => {
    router.replace("/edit-profile");
  };

  const handleShare = () => {
    router.replace("/cart");
  };

  const goToPage = (page) => {
    pagerViewRef.current?.setPage(page);
    handlePageChange(page);
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-row bg-primary">
        <TouchableOpacity onPress={handleSettings} className="ml-8">
          <Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17.6026 1.27835C16.27 -0.426118 13.73 -0.426118 12.3974 1.27835L10.8023 3.31838C10.1707 4.12626 9.21268 4.59678 8.19955 4.59674L5.6412 4.59663C3.50366 4.59655 1.92002 6.62186 2.39575 8.74721L2.96514 11.291C3.19062 12.2983 2.95401 13.3556 2.3223 14.1634L0.727116 16.2033C-0.605681 17.9077 -0.0404841 20.4332 1.88541 21.379L4.19044 22.511C5.10326 22.9593 5.76622 23.8071 5.99162 24.8145L6.56081 27.3583C7.03637 29.4837 9.32481 30.6077 11.2506 29.6617L13.5556 28.5296C14.4683 28.0812 15.5317 28.0812 16.4444 28.5296L18.7494 29.6617C20.6752 30.6077 22.9636 29.4837 23.4392 27.3583L24.0084 24.8145C24.2338 23.8071 24.8967 22.9593 25.8096 22.511L28.1146 21.379C30.0405 20.4332 30.6057 17.9077 29.2729 16.2033L27.6777 14.1634C27.046 13.3556 26.8094 12.2983 27.0349 11.291L27.6043 8.74721C28.08 6.62186 26.4963 4.59655 24.3588 4.59663L21.8005 4.59674C20.7873 4.59678 19.8293 4.12626 19.1977 3.31838L17.6026 1.27835ZM15 19.6775C17.2061 19.6775 18.9946 17.8535 18.9946 15.6035C18.9946 13.3535 17.2061 11.5295 15 11.5295C12.7939 11.5295 11.0054 13.3535 11.0054 15.6035C11.0054 17.8535 12.7939 19.6775 15 19.6775Z"
              fill="#F7F5FA"
            />
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} className="ml-auto mr-8">
          <Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <Path
              d="M23.2325 5.00005H19.375C19.0435 5.00005 18.7255 4.86836 18.4911 4.63394C18.2567 4.39952 18.125 4.08157 18.125 3.75005C18.125 3.41853 18.2567 3.10059 18.4911 2.86617C18.7255 2.63175 19.0435 2.50005 19.375 2.50005H26.125L26.1887 2.5013C26.3634 2.49193 26.5381 2.51943 26.7014 2.58201C26.8648 2.64459 27.0131 2.74085 27.1368 2.86453C27.2605 2.98821 27.3567 3.13654 27.4193 3.29988C27.4819 3.46321 27.5094 3.63789 27.5 3.81255V3.87505V11.25C27.5 11.5816 27.3683 11.8995 27.1339 12.1339C26.8995 12.3684 26.5815 12.5 26.25 12.5C25.9185 12.5 25.6005 12.3684 25.3661 12.1339C25.1317 11.8995 25 11.5816 25 11.25V6.76755L15.8837 15.8838C15.7684 16.0032 15.6305 16.0984 15.478 16.1639C15.3255 16.2294 15.1615 16.2639 14.9955 16.2654C14.8295 16.2668 14.6649 16.2352 14.5113 16.1723C14.3577 16.1095 14.2181 16.0167 14.1008 15.8993C13.9834 15.7819 13.8906 15.6424 13.8277 15.4887C13.7649 15.3351 13.7332 15.1705 13.7347 15.0045C13.7361 14.8386 13.7706 14.6745 13.8361 14.522C13.9016 14.3695 13.9969 14.2316 14.1162 14.1163L23.2325 5.00005ZM11.25 2.50005C11.5815 2.50005 11.8995 2.63175 12.1339 2.86617C12.3683 3.10059 12.5 3.41853 12.5 3.75005C12.5 4.08157 12.3683 4.39952 12.1339 4.63394C11.8995 4.86836 11.5815 5.00005 11.25 5.00005H7.5C6.83696 5.00005 6.20107 5.26344 5.73223 5.73228C5.26339 6.20112 5 6.83701 5 7.50005V22.5C5 23.1631 5.26339 23.799 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.799 25 23.1631 25 22.5V18.75C25 18.4185 25.1317 18.1006 25.3661 17.8662C25.6005 17.6317 25.9185 17.5 26.25 17.5C26.5815 17.5 26.8995 17.6317 27.1339 17.8662C27.3683 18.1006 27.5 18.4185 27.5 18.75V22.5C27.5 23.8261 26.9732 25.0979 26.0355 26.0356C25.0979 26.9733 23.8261 27.5 22.5 27.5H7.5C6.17392 27.5 4.90215 26.9733 3.96447 26.0356C3.02678 25.0979 2.5 23.8261 2.5 22.5V7.50005C2.5 6.17397 3.02678 4.9022 3.96447 3.96452C4.90215 3.02684 6.17392 2.50005 7.5 2.50005H11.25Z"
              fill="white"
            />
          </Svg>
        </TouchableOpacity>
      </View>
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        className="flex-1"
      >
      
      <View className=" items-center flex-1  bg-primary">
        <View className="h-44 w-44 mt-2 rounded-full overflow-hidden border-4 border-gray-200 p-0.5">
          <View className="h-full w-full rounded-full overflow-hidden">
            <Image
              className="h-full w-full "
              source={{
                uri: userData.profile_picture,
              }}
              resizeMode="cover"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleEdit}
          className="absolute shadow-md justify-center items-center mt-2"
        >
          <View className="h-8 w-8 bg-white rounded-full ml-28">
            <Image source={icons.pencil} className="ml-2 mt-2" />
          </View>
        </TouchableOpacity>

        <Text className="text-base font-mbold text-white mt-4">
          {userData.username}
        </Text>
        <Text className="text-xs text-white font-mbold">{userData.bio}</Text>

        <View className="flex flex-row flex-grow mt-6 space-x-20">
          <TouchableOpacity className="flex flex-col items-center">
            <Text className="text-white font-mbold">{userData.following}</Text>
            <Text className="text-white font-mbold">Following</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex flex-col items-center">
            <Text className="text-white font-mbold">{userData.followers}</Text>
            <Text className="text-white font-mbold">Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-col items-center">
            <Text className="text-white font-mbold">{userData.likes}</Text>
            <Text className="text-white font-mbold">Likes</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View className="flex-1 bg-white h-96">
        <View className="flex flex-row justify-around items-center h-12 bg-white">
          <TouchableOpacity  onPress={() => goToPage(0)}>
            <Text
              className={`text-lg text-primary ${
                currentPage === 0 ? "font-bold" : "font-normal"
              }`}
            >
              Posts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity  onPress={() => goToPage(1)}>
            <Text
              className={`text-lg text-primary ${
                currentPage === 1 ? "font-bold" : "font-normal"
              }`}
            >
              Selling
            </Text>
          </TouchableOpacity>
          <TouchableOpacity  onPress={() => goToPage(2)}>
            <Text
              className={`text-lg text-primary ${
                currentPage === 2 ? "font-bold" : "font-normal"
              }`}
            >
              Closet
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
         ref={pagerViewRef}
          style={{ flex: 1 }}
          initialPage={0}
          onPageSelected={(e) => handlePageChange(e.nativeEvent.position)}
        >
          <View key="1" className="flex-1">
            <MasonryFlashList
              data={userData.user_photos.map((photo) => ({ uri: photo }))}
              renderItem={({ item }) => (
                <Image source={{ uri: item.uri }} className="w-24 h-24 m-1" />
              )}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3} // Adjust the number of columns to fit your design
              estimatedItemSize={200}
              //className="w-full h-full"
            />

            <TouchableOpacity
              onPress={doNothing}
              className="absolute bottom-20 right-10"
            >
              <Image source={icons.plus} className="w-16 h-16" />
            </TouchableOpacity>
          </View>
          <View key="2" className="flex-1">
            <FlashList
              data={listings}
              renderItem={renderListingItem}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3} // Adjust the number of columns to fit your design
              estimatedItemSize={100}
              className="w-full h-full"
            />
          </View>
          <View key="3" className="flex-1 items-center justify-center">
            <Text className="text-black">My Closet</Text>
          </View> 
        </PagerView>
      </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
