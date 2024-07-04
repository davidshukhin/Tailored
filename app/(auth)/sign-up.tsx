import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";

import { images } from "../../constants";


import FormField from "../../components/FormField";

import CustomButton from "../../components/CustomButton";
import { supabase } from "../../lib/supabase";

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }

    setIsSubmitting(true);

    try {
      let { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

     
      if (error){
        console.log(error)
         throw error;} // Add this to handle Supabase errors

      // Check if the sign-up was successful
      if (data.user) {
        Alert.alert("Success", "Account created successfully. Please check your email for verification.");
        router.replace("/profile-setup");
      } else {
        Alert.alert("Error", "Failed to create account. Please try again.");
      }


    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
            Sign up for Tailored
          </Text>


          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            secureTextEntry={true}
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7 "
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font=psemibold text-secondary"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
