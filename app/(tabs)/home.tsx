import { View, Button, Text, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../database.types";
import { supabase } from "../../lib/supabase";
import { Image } from "expo-image";

interface homePrompts {
  swipedRight: boolean;
}

const Home = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [currentIndex, setCurrentindex] = useState(0);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      let { data: listings, error } = await supabase
        .from("listings")
        .select("*");

      if (listings) {
        setListings(listings);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const nextListing = () => {
    setCurrentindex((prevIndex) => (prevIndex + 1) % listings.length);
  };

  const prevListing = () => {
    setCurrentindex((prevIndex) => (prevIndex - 1) % listings.length);
  };

  const sendInput = async ({ swipedRight }) => {
    const isSwipedRight = !!swipedRight;

    try {
      const { data, error } = await supabase.from("user_actions").insert([
        {
          action_type: isSwipedRight,
          item_id: listings[currentIndex].id,
        },
      ]);
    } catch (error) {
      console.error("Error in sendInput function:", error);
    }
  };

  const likeItem = async () => {
    try {
      const { data, error } = await supabase.from("liked_items").insert([
        {
          item_id: listings[currentIndex].id,
        },
      ]);
    } catch (error) {
      console.error("Error liking item", error);
    }
  };

  return (
    <View className="items-center justify-center flex-1 bg-primary">
      <Text className="text-2xl mt-16">TAILORED FEED</Text>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {listings.length > 0 && currentIndex > -1 ? (
          <View
            className="w-72 rounded-lg bg-white shadow-lg mb-4"
            key={currentIndex}
          >
            <Image
              source={{ uri: listings[currentIndex].imageURL }}
              className="w-full h-48 rounded-t-lg"
              contentFit="contain"
            />
            <View className="p-4">
              <Text className="text-xl font-bold mb-2">
                {listings[currentIndex].name}
              </Text>
              <Text className="text-gray-600 mb-2">
                {listings[currentIndex].description}
              </Text>
              <View className="flex-row justify-between items-center">
                <Text className="text-lg text-green-600">
                  {listings[currentIndex].size}
                </Text>
                <Text className="text-lg text-green-600">
                  ${listings[currentIndex].price}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </ScrollView>
      {listings.length > 1 && (
        <View className="flex-row mt-4">
          <Button
            title="Left"
            onPress={() => {
              sendInput({ swipedRight: false });
              nextListing();
              
            }}
          />
          <Button
            title="Right"
            onPress={() => {
              sendInput({ swipedRight: true });
              likeItem();
              nextListing();
              
            }}
          />
        </View>
      )}
    </View>
  );
};

export default Home;
