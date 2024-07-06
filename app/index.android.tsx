import React from "react";
import {
  Image,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Link, router, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images, icons } from "../constants";
import { useAuth } from "../providers/AuthProvider";

export default function App() {
  const { session, loading } = useAuth();
  if (loading) {
    return <ActivityIndicator size="large" color="#FFA001" />;
  }
  if (session) {
    router.push("/home");
  }

  return (
    <SafeAreaView className="bg-primary flex-1 ">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <View className="flex-1 items-center mt-16  bg-primary">
          <Image
            source={icons.logo}
            className="w-[80%] h-[20%]"
            resizeMode="contain"
          />
          <Text className="text-center p-2 mt-16 text-white text-xs">
            {" "}
            By tapping Create Account or Sign In, you agree to our Terms. Learn
            how we process your data in our Privacy Policy and Cookies Policy.
          </Text>
          <TouchableOpacity className="bg-primary w-3/4 h-12 rounded-3xl mt-4 items-center justify-center border-white border-2">
            <Text className="text-white">Sign in with Google</Text>
          </TouchableOpacity>
          <Link href="/sign-in" asChild>
            <TouchableOpacity className="bg-primary w-3/4 h-12 rounded-3xl mt-4 items-center justify-center border-white border-2">
              <Text className="text-white text-lg">Sign in with Email</Text>
            </TouchableOpacity>
          </Link>
          <Text className="text-white text-5xl mt-16 font-ps"> Tailored</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
