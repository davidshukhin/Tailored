import React, { useEffect, useState } from "react";
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
import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      checkOnboardingStatus();
    }
  }, [session, loading]);

  const checkOnboardingStatus = async () => {
    try {
      if (session?.user.id) {
        const { data, error } = await supabase
          .from('users')
          .select('completed_onboarding')
          .eq('user_id', session.user.id);

        if (error) throw error;
        setHasCompletedOnboarding(data[0]?.completed_onboarding);
      } else {
        // Fall back to local storage if not authenticated
        const value = await AsyncStorage.getItem('hasCompletedOnboarding');
        setHasCompletedOnboarding(value === 'true');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !loading) {
      if (!session?.user.id) {
        //router.replace('/sign-in');
      } else if (hasCompletedOnboarding) {
        router.replace('/home');
      } else {
        router.replace('/profile-setup');
      }
    }
  }, [isLoading, loading, session?.user, hasCompletedOnboarding]);



  if (isLoading || loading) {
    return <ActivityIndicator size="large" color="#FFA001" />;
  }
 
  

  return (
    <SafeAreaView className="bg-primary flex-1 ">
   
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
          <TouchableOpacity onPress={()=>router.push('/home')} className="bg-primary w-3/4 h-12 rounded-3xl mt-4 items-center justify-center border-white border-2">
            <Text className="text-white">Sign in with Google</Text>
          </TouchableOpacity>
          <Link href="/sign-in" asChild>
            <TouchableOpacity className="bg-primary w-3/4 h-12 rounded-3xl mt-4 items-center justify-center border-white border-2">
              <Text className="text-white text-lg">Sign in with Email</Text>
            </TouchableOpacity>
          </Link>
          <Text className="text-white text-5xl mt-16 font-ps"> Tailored</Text>
        </View>
      
    </SafeAreaView>
  );
}
