import React from 'react';
import { Image, ScrollView, View, Text } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';


export default function App() {
  return (
    <SafeAreaView className="bg-black flex-1 ">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
      <View className="flex-1 items-center justify-center bg-black">
          <Image
            source={images.logotailored}
            className="w-[260px] h-[168px]"
            resizeMode="contain"
          />
          <Link href="/sign-in" className="text-primary text-3xl">
            Sign in
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}