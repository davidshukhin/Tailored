import { View, Text, Image, SafeAreaView } from "react-native";


import React from "react";
import { Stack } from "expo-router";

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Buying from "./buying";
import Selling from "./selling";
import Search from "./search";

const MessagingLayout = () => {

    const Tab = createMaterialTopTabNavigator();


  return (
    <SafeAreaView className="flex-1 bg-white">
      <Text className="text-3xl ml-4 font-mbold">Messages</Text>
    <Tab.Navigator>
    <Tab.Screen name="Buying" component={Buying} />
    <Tab.Screen name="Selling" component={Selling} />
    <Tab.Screen name="Search" component={Search} />
  </Tab.Navigator>
  </SafeAreaView>
  )
}

export default MessagingLayout