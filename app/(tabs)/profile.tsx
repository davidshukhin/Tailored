import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "../../components/CustomButton";

const Profile = () => {
  const doNothing = () => {};
  return (
    <SafeAreaView className="flex-1 h-full bg-primary">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className=" h-1/2 items-center flex-1  bg-primary">
          <View className="h-36 w-36 rounded-full overflow-hidden border-2 border-gray-300 p-0.5">
            <View className="h-full w-full rounded-full overflow-hidden">
              <Image
                className="h-full w-full "
                source={{
                  uri: "https://lgqwtpmygjpbbdieaqof.supabase.co/storage/v1/object/sign/images/arcteryx.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvYXJjdGVyeXgud2VicCIsImlhdCI6MTcxNjc1MDUyNywiZXhwIjoxNzQ4Mjg2NTI3fQ.dN383XU75cBx7owxdyliQxJd9sAcslpGVNFnGBTnf0A&t=2024-05-26T19%3A08%3A47.962Z",
                }}
                resizeMode="cover"
              />
            </View>
          </View>

          <TouchableOpacity className="shadow-md absolute mt-32 w-16  h-8 rounded-full justify-center items-center">
            <LinearGradient
              colors={["#7B73D3", "#7B73D3"]}
              start={[0, 0]}
              end={[1, 0]}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 33.59,
                width: '100%', // Ensure the gradient covers the entire button width
                paddingHorizontal: 10
              }}
            >
              <Text className="text-xs color-white">Follow</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text className="mt-8 text-white">Fashion Designer</Text>
          <Text className="text-base font-bold text-white">Jane Doe</Text>

          <View className="flex flex-row flex-grow mt-10 space-x-20">
              <TouchableOpacity className="flex flex-col items-center">
                
              <Text className="text-white">100k</Text>
              <Text className="text-white">Following</Text>
                </TouchableOpacity>


           
            <TouchableOpacity className="flex flex-col items-center">
              <Text className="text-white">69</Text>
              <Text className="text-white">Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-col items-center">
              <Text className="text-white">420</Text>
              <Text className="text-white">Likes</Text>
            </TouchableOpacity>
            </View>
        </View>
        <View className="h-1/2 items-center justify-center bg-white">
          <Text className="text-black">Other content goes here</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
