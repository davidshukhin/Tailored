import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

const Profile = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <LinearGradient colors={["#7B73D3", "#DED9FB"]}
      start={[0, 0]}
      end={[1, 0]}
      style={{
        borderRadius: 0,
        shadowColor: "rgba(0, 0, 0, 0.15)",
        shadowOffset: { width: 0, height: 500 },
        shadowOpacity: 1,
        shadowRadius: 5.038,
        marginTop: 20,
        marginBottom: 20,
      }}> 
        
          <Text>Profile</Text>
       
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
