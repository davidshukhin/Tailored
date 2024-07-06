import { View, Text, SafeAreaView, Button, TouchableOpacity } from "react-native";
import React from "react";
import { supabase } from "../../lib/supabase";
import { router } from "expo-router";
import { useAuth } from "../../providers/AuthProvider";
import { Path, Svg } from "react-native-svg";


const Settings = () => {
    const { session, loading } = useAuth();

    if(!session){
        router.push("/sign-in");
    } 


  return (
    <SafeAreaView className="bg-primary h-full">
       <View>
        <TouchableOpacity onPress={() => router.push("/profile")} className="ml-4">
          <Svg width="15" height="24" viewBox="0 0 15 24" fill="none">
            <Path
              d="M12.0692 3L3.23752 11.8317C3.10634 11.9629 3.10634 12.1756 3.23752 12.3067L12.0692 21.1385"
              stroke="white"
              stroke-width="5.37436"
              stroke-linecap="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>
      <Text>Settings</Text>
      <Button onPress={() => supabase.auth.signOut()} title="Sign Out" />
    </SafeAreaView>
  );
};

export default Settings;
