import {
  View,
  Text,
  SafeAreaView,
  Button,
  Image,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import CustomButton from "../../components/CustomButton";


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
      <View className="items-center mt-8">
        <View className="h-24 w-24 mt-2 rounded-full overflow-hidden border-4 border-gray-200 p-0.5">
          <View className="h-full w-full rounded-full overflow-hidden">
            <Image className="h-full w-full " source={{}} resizeMode="cover" />
          </View>
        </View>

        <Button title="Edit profile image" />
      </View>

      <View>
        <View className="flex-row">
          <Text>Username</Text>

          <TextInput  placeholder={userData.username} />
        </View>
        <View className="flex-row">
          <Text>Email</Text>

          <TextInput placeholder={userData.email} />
        </View>
        <View className="flex-row">
          <Text>Bio</Text>

          <TextInput placeholder={userData.bio} />
        </View>
      </View>
      <CustomButton
          title="Update profile"
          handlePress={fetchProfile}
          containerStyles="mt-7"
          //isLoading={fetchProfile}
        />

    </SafeAreaView>
  );
};

export default EditProfile;
