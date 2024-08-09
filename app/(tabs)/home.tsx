import {
  View,
  Button, 
  Text,
  ScrollView,
  Touchable,
  TouchableOpacity,
  type ImageSourcePropType,
  ImageBackground,
  Dimensions,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../database.types";
import { supabase } from "../../lib/supabase";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { Swiper, type SwiperCardRefType } from "rn-swiper-list";
import { Defs, G, Path, Svg } from "react-native-svg";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { icons } from "../../constants";
import TagBubbles from "../../components/TagBubbles";
import { useCart } from "../../providers/CartProvider";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useAuth } from "../../providers/AuthProvider";

interface homePrompts {
  swipedRight: boolean;
}

const Home = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [currentIndex, setCurrentindex] = useState(0);
  //const [imageIndex, setImageIndex] = useState(0);
  const ref = useRef<SwiperCardRefType>(null); // Add a ref for Swiper
  const [likes, setLikes] = useState(0);
  const { width } = Dimensions.get("window"); // Get the screen width
  const cardWidth = width * 0.95;
  const cardHeight = cardWidth * 1.5;
  const [seller, setSeller] = useState<any>();
  const { addItem } = useCart();
  

  useEffect(() => {
    const fetchData = async () => {
      await fetchListings();
      if (listings.length > 0) {
        await fetchLikes();
      }
    };
    fetchData();
  }, []);

  const fetchListings = async () => {
    try {
      let { data: listings, error } = await supabase
        .from("listings")
        .select("*");

      if (listings) {
        setListings(listings);
        getSellerData({ user_id: listings[currentIndex].user_id });
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const nextListing = () => {
    setCurrentindex((prevIndex) => (prevIndex + 1) % listings.length);
    //setImageIndex(0);
    fetchLikes();
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
          item_id: listings[currentIndex].item_id,
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
          item_id: listings[currentIndex].item_id,
        },
      ]);
    } catch (error) {
      console.error("Error liking item", error);
    }
  };

  const fetchLikes = async () => {
    try {
      let { data, error, count } = await supabase
        .from("liked_items")
        .select("*", { count: "exact" })
        .eq("item_id", listings[currentIndex].item_id);
      if (count) {
        setLikes(count);
        console.log("Likes", count);
      } else {
        setLikes(0);
      }
    } catch (error) {
      console.error("Error fetching likes", error);
    }
  };

  // const nextImage = () => {
  //   setImageIndex(
  //     (prevIndex) => (prevIndex + 1) % listings[currentIndex].imageURLS.length
  //   );
  // };

  const getSellerData = async ({ user_id }) => {
    try {
      let { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user_id)
        .single();

      if (userData) {
        console.log("Seller Data", userData);
        setSeller(userData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const viewItem = () => {
    router.push(`/product/${listings[currentIndex].item_id}`);
  };

  const OverlayLabelRight = () => (
    <View className="absolute bg-green-500 rounded-3xl w-full h-full flex justify-center items-center">
    <Text className="text-white text-3xl font-mbold">🎉 Liked! 🎉</Text>
  </View>
  );

  const OverlayLabelLeft = () => (
    <View className="absolute bg-red-500 rounded-3xl w-full h-full flex justify-center items-center">
    <Text className="text-white text-3xl font-mbold">🗑️ Nope! 🗑️</Text>
    </View>
  );

  const OverlayLabelTop = () => (
    <View className="absolute bg-blue-500 rounded-3xl w-full h-full flex justify-center items-center">
      <Text className="text-white text-3xl font-mbold">🛒 Cart 🛒</Text>
    </View>
  );

  const handleTap = (event: any) => {
    const xCoordinate = event.nativeEvent.locationX;
    const cardWidth = Dimensions.get("window").width * 0.9;

    if (xCoordinate > cardWidth / 2) {
      // Tapped on the right half, go to next image
      nextListing();
    } else {
      // Tapped on the left half, go to previous image
      prevListing();
    }
  };

  const addToCart = async () => {
    if (!listings[currentIndex]) return;
    let { data } = await supabase
    .from("cart")
    .insert([
      {
        item_id: listings[currentIndex].item_id
      },
    ]);
   
  };

  const renderCard = (card) => {
    return (
      <View className="w-full h-full bg-primary shadow-lg rounded-3xl">
        {card.imageURLS[0] ? (
          <TouchableOpacity onPress={viewItem} className="flex-1">
            <ImageBackground
              source={{ uri: card.imageURLS[0] }}
              className="w-full h-full "
              imageStyle={{ borderRadius: 24 }}
            >
              <View className="flex-1 justify-end p-4">
                <Text className="text-3xl text-white font-mbold mb-2 shadow-2xl">
                  {card.name}
                </Text>
                <View className="flex-row items-center">
                  <Image source={icons.ruler} className="w-6 h-6 mr-2" />
                  <Text className="text-xl text-white font-mregular">
                    Size {card.size}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <TagBubbles size={12} tags={card.tags} />
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ) : (
          <Text>No Image Available</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row justify-start p-4 items-center">
        <TouchableOpacity
          onPress={() => router.push(`/profile/${seller?.username}`)}
        >
          <View className="h-16 w-16 mt-2 mr-2 rounded-full overflow-hidden border-2 border-gray-200 p-0.5 ">
            <View className="h-full w-full rounded-full overflow-hidden">
              <Image
                className="h-full w-full"
                source={{
                  uri: seller?.profile_picture,
                }}
                contentFit="cover"
              />
            </View>
          </View>
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="font-mbold text-lg ">{seller?.username}</Text>
          <Text className="font-mregular">Likes: {likes}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/cart")}>
          <Image source={icons.cart} className="w-8 h-8" />
        </TouchableOpacity>
      </View>
      <GestureHandlerRootView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center">
          <Swiper
            ref={ref}
            cardStyle={{
              backgroundColor: "black",
              shadowRadius: 10,
              borderRadius: 24,
              height: "100%",
              width: width * 0.95,
            }}
            data={listings}
            renderCard={renderCard}
            onSwipeRight={(cardIndex) => {
              //console.log('cardIndex', cardIndex);
              sendInput({ swipedRight: true });
              likeItem();
              nextListing();
              getSellerData({ user_id: listings[currentIndex + 1].user_id });
            }}
            onSwipedAll={() => {
              console.log("onSwipedAll");
            }}
            onSwipeLeft={(cardIndex) => {
              sendInput({ swipedRight: false });
              nextListing();
              getSellerData({ user_id: listings[currentIndex + 1].user_id });
            }}
            onSwipeTop={(cardIndex) => {
              nextListing();
              addToCart();
            }}
            OverlayLabelRight={OverlayLabelRight}
            OverlayLabelLeft={OverlayLabelLeft}
            OverlayLabelTop={OverlayLabelTop}
            onSwipeActive={() => {
            }}
            onSwipeStart={() => {
            }}
            onSwipeEnd={() => {
            }}
          />
        </View>

        {/* <View className="flex-row justify-center items-center mb-14">
          <TouchableOpacity
            className="shadow-sm"
            onPress={() => {
              ref.current?.swipeLeft();
            }}
          >
            <Image source={icons.dislike_button} className="w-24 h-24" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              ref.current?.swipeRight();
            }}
          >
            <Image source={icons.like_button} className="w-28 h-28" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push(`/chat/${seller.user_id}?name=${seller.username}`);
            }}
          >
            <Image source={icons.message_button} className="w-24 h-24" />
          </TouchableOpacity>
        </View> */}
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Home;