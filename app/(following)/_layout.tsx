import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, router, useGlobalSearchParams, useRouter } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Followers from "./followers/[id]";
import Following from "./following/[id]";
import { Path, Svg } from "react-native-svg";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../providers/AuthProvider";

const FollowingLayout = () => {
  const Tab = createMaterialTopTabNavigator();
  const user = useGlobalSearchParams().id;
  const [userName, setUserName] = useState("");
  const {session} = useAuth();

  useEffect(() => {
    getUserData(user);
  }, [user]);

  const getUserData = async (id) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", id)
        .single();

      if (data) setUserName(data.username);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleRouter = () => {
    if(user === session?.user.id){
      router.push("/profile");
    } else {
      router.push(`/profile/${userName}`);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center relative">
        <TouchableOpacity
          onPress={() => handleRouter()}
          style={{ position: "absolute", left: 0, padding: 10, zIndex: 1 }}
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
        <Text className="flex-1 text-lg font-mregular text-center ">
          {userName}
        </Text>
      </View>
      <Tab.Navigator>
        <Tab.Screen
          name="Followers"
          component={Followers}
          options={{
            tabBarLabel: ({ color, focused }) => (
              <Text
                style={{
                  color,
                }}
              >
                <Text style={{ textTransform: "capitalize" }}> Followers</Text>
              </Text>
            ),
            // You can add other options here, like icons
          }}
        />
        <Tab.Screen
          name="Following"
          component={Following}
          options={{
            tabBarLabel: ({ color, focused }) => (
              <Text
                style={{
                  color,
                }}
              >
                <Text style={{ textTransform: "capitalize" }}> Following</Text>
              </Text>
            ),
            // You can add other options here, like icons
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default FollowingLayout;
