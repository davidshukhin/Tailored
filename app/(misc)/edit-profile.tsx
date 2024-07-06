import {
  View,
  Text,
  SafeAreaView,
  Button,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import CustomButton from "../../components/CustomButton";
import { Path, Svg } from "react-native-svg";
import { router } from "expo-router";

const EditProfile = () => {
  const [userData, setUserData] = useState({
    username: "",
    bio: "",
    profile_picture: "",
    email: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        if (data) {
          setUserData({
            username: data.username,
            bio: data.bio,
            profile_picture: data.profile_picture,
            email: data.email,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <SafeAreaView className="bg-white">
      <View>
        <TouchableOpacity
          onPress={() => router.push("/profile")}
          className="ml-4"
        >
          <Svg width="15" height="24" viewBox="0 0 15 24" fill="none">
            <Path
              d="M12.0692 3L3.23752 11.8317C3.10634 11.9629 3.10634 12.1756 3.23752 12.3067L12.0692 21.1385"
              stroke="black"
              stroke-width="5.37436"
              stroke-linecap="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>
      <View className="items-center m-4">
        <View className="h-24 w-24 mt-2 rounded-full overflow-hidden border-4 border-gray-200 p-0.5">
          <View className="h-full w-full rounded-full overflow-hidden">
            <Image className="h-full w-full " source={{}} resizeMode="cover" />
          </View>
        </View>

        <Button title="Edit profile image" />
      </View>

      <View className="m-4">
        <View className="flex-row">
          <Text>Username{"  "}</Text>

          <TextInput placeholder={userData.username} />
        </View>
        <View className="flex-row">
          <Text>Email{"  "}</Text>

          <TextInput placeholder={userData.email} />
        </View>
        <View className="flex-row">
          <Text>Bio{"  "}</Text>

          <TextInput placeholder={userData.bio} />
        </View>

        <CustomButton
          title="Update profile"
          handlePress={fetchProfile}
          containerStyles="mt-7"
          //isLoading={fetchProfile}
        />
      </View>
    </SafeAreaView>
  );
};

export default EditProfile;
