import {
  View,
  Button,
  Text,
  ScrollView,
  Touchable,
  TouchableOpacity,
  type ImageSourcePropType,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../database.types";
import { supabase } from "../../lib/supabase";
import { Image } from "expo-image";
import { router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { Swiper, type SwiperCardRefType } from "rn-swiper-list";

interface homePrompts {
  swipedRight: boolean;
}

const Home = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [currentIndex, setCurrentindex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const ref = useRef<SwiperCardRefType>(null); // Add a ref for Swiper

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
    setImageIndex(0);
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

  const nextImage = () => {
    setImageIndex(
      (prevIndex) => (prevIndex + 1) % listings[currentIndex].imageURLS.length
    );
  };

  const viewItem = () => {
    router.push(`/product/${listings[currentIndex].id}`);
  };

  const OverlayLabelRight = () => (
    <View className="absolute top-4 right-4 bg-green-500 p-2 rounded">
      <Text className="text-white text-lg">MY PRECIOUS</Text>
    </View>
  );
  
  const OverlayLabelLeft = () => (
    <View className="absolute top-4 left-4 bg-red-500 p-2 rounded">
      <Text className="text-white text-lg">NOPE</Text>
    </View>
  );
  
  const OverlayLabelTop = () => (
    <View className="absolute top-4 bg-blue-500 p-2 rounded">
      <Text className="text-white text-lg">SUPER LIKE</Text>
    </View>
  );

  const renderCard = (card) => (
    <View className="w-72 rounded-lg bg-white shadow-lg mb-4">
       
      {card.imageURLS[imageIndex] ? (
        <TouchableOpacity onPress={viewItem}>
        <Image
          source={{ uri: card.imageURLS[imageIndex] }}
          className="w-full h-48 rounded-t-lg"
          contentFit="contain"
        /></TouchableOpacity>
      ) : (
        <Text>No Image Available</Text>
      )}
      <View className="p-4">
        <Text className="text-xl font-bold mb-2">{card.name}</Text>
        <Text className="text-gray-600 mb-2">{card.description}</Text>
        <View className="flex-row justify-between items-center">
          <Text className="text-lg text-green-600">{card.size}</Text>
          <Text className="text-lg text-green-600">${card.price}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className="items-center justify-center flex-1 bg-primary">
      <Text className="text-2xl mt-16">TAILORED FEED</Text>
      <GestureHandlerRootView className="flex-1 bg-gray-100">
    <View className="flex-1 justify-center items-center">
      <Swiper
        ref={ref}
        cardStyle={{ backgroundColor: "white", shadowRadius: 10, borderRadius: 10}}
        
        data={listings}
        renderCard={renderCard}
        onSwipeRight={(cardIndex) => {
          //console.log('cardIndex', cardIndex);
          sendInput({ swipedRight: true });
          likeItem();
          nextListing();
        }}
        onSwipedAll={() => {
          console.log('onSwipedAll');
        }}
        onSwipeLeft={(cardIndex) => {
          //console.log('onSwipeLeft', cardIndex);
          sendInput({ swipedRight: false });
          nextListing();
        }}
        onSwipeTop={(cardIndex) => {
          //console.log('onSwipeTop', cardIndex);
          nextListing();
        }}
       OverlayLabelRight={OverlayLabelRight}
        OverlayLabelLeft={OverlayLabelLeft}
       OverlayLabelTop={OverlayLabelTop}
        onSwipeActive={() => {
          //console.log('onSwipeActive');
        }}
        onSwipeStart={() => {
          //console.log('onSwipeStart');
        }}
        onSwipeEnd={() => {
          //console.log('onSwipeEnd');
        }}
      />
    </View>

    {/* <View style={tw`flex-row justify-center mt-4`}>
      <ActionButton
        style={tw`bg-red-500 p-4 rounded-full`}
        onTap={() => {
          ref.current?.swipeLeft();
        }}
      >
        <AntDesign name="close" size={32} color="white" />
      </ActionButton>
      <ActionButton
        style={tw`bg-blue-500 p-4 rounded-full mx-2`}
        onTap={() => {
          ref.current?.swipeBack();
        }}
      >
        <AntDesign name="reload1" size={24} color="white" />
      </ActionButton>
      <ActionButton
        style={tw`bg-yellow-500 p-4 rounded-full`}
        onTap={() => {
          ref.current?.swipeTop();
        }}
      >
        <AntDesign name="arrowup" size={32} color="white" />
      </ActionButton>
      <ActionButton
        style={tw`bg-green-500 p-4 rounded-full`}
        onTap={() => {
          ref.current?.swipeRight();
        }}
      >
        <AntDesign name="heart" size={32} color="white" />
      </ActionButton> 
    </View> */}
  </GestureHandlerRootView>
      {/* <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {listings.length > 0 && currentIndex > -1 ? (
          <TouchableOpacity onPress={viewItem}>
            <View
              className="w-72 rounded-lg bg-white shadow-lg mb-4"
              key={currentIndex}
            >
              {listings[currentIndex]?.imageURLS?.[imageIndex] ? (
                <Image
                  source={{ uri: listings[currentIndex].imageURLS[imageIndex] }}
                  className="w-full h-48 rounded-t-lg"
                  contentFit="contain"
                />
              ) : (
                <Text>No Image Available</Text>
              )}
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
          </TouchableOpacity>
        ) : (
          <Text>Loading...</Text>
        )}
      </ScrollView> */}
      {listings.length > 1 && (
        <View className="flex-row mt-4 mb-32">
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
          <Button title="NextImage" onPress={nextImage} />
        </View>
      )}
    </View>
  );
};

export default Home;
