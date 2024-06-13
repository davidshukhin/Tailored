import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "../../components/CustomButton";
import PagerView from "react-native-pager-view";
import { supabase } from "../../lib/supabase";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

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

  const [user, setUser] = useState<string>("");

  useEffect(() => {
    getUser();
  });

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
        .select(
          "*"
        )
        .eq("id", user_id)
        .single();

      if (error) {
        throw error;
      }
      if(users){
        //setUserData(users);
       setUserData({
         username: users.username,
         followers: users.followers,
         following: users.following,
         likes: users.likes,
         bio: users.bio,
         profile_picture: users.profile_picture,
         user_photos: users.user_photos,
      
       });
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

  const doNothing = () => {};
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className=" items-center flex-1  bg-primary">
        <View className="h-36 w-36 mt-4 rounded-full overflow-hidden border-4 border-white p-0.5">
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

        <TouchableOpacity className="shadow-md absolute mt-36 w-16  h-8 rounded-full justify-center items-center">
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
        <Text className="text-base font-bold text-white">{userData.username}</Text>

        <View className="flex flex-row flex-grow mt-10 space-x-20">
          <TouchableOpacity className="flex flex-col items-center">
            <Text className="text-white">{userData.following}</Text>
            <Text className="text-white">Following</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex flex-col items-center">
            <Text className="text-white">{userData.followers}</Text>
            <Text className="text-white">Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-col items-center">
            <Text className="text-white">{userData.likes}</Text>
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
                    inputRange: [0, 1],
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
          <View key="1" className="flex-1 items-center justify-center">
            <Text className="text-black">Profile Content</Text>
          </View>
          <View key="2" className="flex-1 items-center justify-center">
            <Text className="text-black">Wishlist Content</Text>
          </View>
        </PagerView>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
