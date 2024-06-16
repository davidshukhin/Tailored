import { View, Text, SafeAreaView, Button } from "react-native";
import React from "react";
import { supabase } from "../../lib/supabase";
import { router } from "expo-router";
import { useAuth } from "../../providers/AuthProvider";


const Settings = () => {
    const { session, loading } = useAuth();

    if(!session){
        router.push("/sign-in");
    } 


  return (
    <SafeAreaView className="bg-primary h-full">
      <Text>Settings</Text>
      <Button onPress={() => supabase.auth.signOut()} title="Sign Out" />
    </SafeAreaView>
  );
};

export default Settings;
