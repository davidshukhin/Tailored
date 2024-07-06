import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Svg, Path } from "react-native-svg";
import { supabase } from "../../lib/supabase";
import CustomButton from "../../components/CustomButton";
import { useCart } from "../../providers/CartProvider";
import TagBubbles from "../../components/TagBubbles";
import { icons } from "../../constants";

const Product = () => {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { addItem } = useCart();
  const [seller, setSeller] = useState<any>();

  useEffect(() => {
    if (id) {
      fetchProduct(id as string);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    setLoading(true);
    try {
      let { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("item_id", productId)
        .single();

      console.log(data);
      if (error) throw error;
      setProduct(data);
      getSellerData(data.user_id);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const getSellerData = async (user_id) => {
    try {
      let { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user_id)
        .single();

      console.log(userData);
      if (userData) {
        console.log("Seller Data", userData);
        setSeller(userData);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = async () => {
    if (!product) return;
    addItem(product.item_id);
    console.log("Added to cart: " + product.item_id);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#FFA001" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {product ? (
        <>
          <ScrollView className="ml-5 mr-5">
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
                      resizeMode="cover"
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="font-mbold text-lg ">{seller?.username}</Text>
                {/* <Text className="font-mregular">Likes: {likes}</Text> */}
              </View>
              <TouchableOpacity onPress={() => router.push("/cart")}>
                <Image source={icons.cart} className="w-8 h-8" />
              </TouchableOpacity>
            </View>

            <View>
              <FlatList
                data={product.imageURLS}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item }}
                    className="w-80 h-80 rounded-lg"
                  />
                )}
                horizontal
                showsHorizontalScrollIndicator={true}
              />
              <TouchableOpacity
                onPress={() => router.back()}
                className="ml-4 absolute top-4"
              >
                <Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <Path
                    d="M26.25 13.75H8.01748L14.6337 7.13371L12.8662 5.36621L3.23248 15L12.8662 24.6337L14.6337 22.8662L8.01748 16.25H26.25V13.75Z"
                    fill="white"
                  />
                </Svg>
              </TouchableOpacity>
            </View>
            <View className="mt-4">
              <View className="flex-row items-center justify-between">
                <Text className="font-mbold text-2xl">{product.name}</Text>
                <Text className="text-xl">{product.likes}</Text>
              </View>
              <Text className="font-mregular text-lg">{product.brand}</Text>
              <Text className="font-mregular text-md"> ${product.price}</Text>
              <Text className="font-mregular text-lg mt-2">
                {" "}
                {product.description}
              </Text>
              <TagBubbles size={16} tags={product.tags} />

              <View className="mt-4 flex-row justify-between ml-2 mr-8">
                <View>
                  <View className="flex-row items-center">
                    <Image
                      source={icons.ruler_black}
                      className="w-4 h-4 mr-2"
                    />
                    <Text className="text-md text-black font-mregular">
                      M 34 x 32
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Image
                      source={icons.ruler_black}
                      className="w-4 h-4 mr-2"
                    />
                    <Text className="text-md text-black font-mregular">
                      Good
                    </Text>
                  </View>
                </View>
                <View>
                  <View className="flex-row items-center">
                    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <Path
                        d="M3.33341 13.3332C3.33361 13.188 3.34336 13.0429 3.36258 12.899C2.33508 12.3215 1.66675 11.2207 1.66675 9.99984C1.66675 8.779 2.33508 7.67817 3.36258 7.10067C3.34341 6.95567 3.33341 6.81067 3.33341 6.6665C3.33341 4.68484 5.11508 3.09317 7.10091 3.36317C7.67841 2.33484 8.77841 1.6665 10.0001 1.6665C11.2217 1.6665 12.3217 2.33484 12.8992 3.36317C14.8809 3.09317 16.6667 4.68484 16.6667 6.6665C16.6667 6.81067 16.6567 6.95567 16.6376 7.10067C17.6651 7.67817 18.3334 8.779 18.3334 9.99984C18.3334 11.2207 17.6651 12.3215 16.6376 12.899C16.6567 13.044 16.6667 13.189 16.6667 13.3332C16.6667 15.3148 14.8809 16.9032 12.8992 16.6365C12.3217 17.6648 11.2217 18.3332 10.0001 18.3332C8.77841 18.3332 7.67841 17.6648 7.10091 16.6365C5.11508 16.9032 3.33341 15.3148 3.33341 13.3332Z"
                        fill="black"
                      />
                      <Path
                        d="M14.0039 8.53485L12.4958 7.01392L8.92803 10.5474L7.5399 9.1593L6.02539 10.6738L8.9216 13.57L14.0039 8.53485Z"
                        fill="white"
                      />
                    </Svg>
                    <Text className="text-md text-black font-mregular ml-2">
                      Verified Seller
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M10 4C10 7.31371 7.31371 10 4 10C7.31371 10 10 12.6863 10 16C10 12.6863 12.6863 10 16 10C12.6863 10 10 7.31371 10 4Z"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <Path
                        d="M17.5 15C17.5 16.3807 16.3807 17.5 15 17.5C16.3807 17.5 17.5 18.6193 17.5 20C17.5 18.6193 18.6193 17.5 20 17.5C18.6193 17.5 17.5 16.3807 17.5 15Z"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </Svg>
                    <Text className="text-md text-black font-mregular ml-2">
                      Good Condition
                    </Text>
                  </View>
                </View>
              </View>

              <CustomButton
                title="Add to cart"
                handlePress={addToCart}
                containerStyles="mt-7"
              />
            </View>
          </ScrollView>
        </>
      ) : (
        <View className="flex-1 items-center ">
          <TouchableOpacity
            onPress={() => router.push("/cart")}
            className="ml-4 "
          >
            {/* <Svg width="15" height="24" viewBox="0 0 15 24" fill="none">
          <Path
            d="M12.0692 3L3.23752 11.8317C3.10634 11.9629 3.10634 12.1756 3.23752 12.3067L12.0692 21.1385"
            stroke="black"
            stroke-width="5.37436"
            stroke-linecap="round"
          />
        </Svg> */}
            <Text className="text-3xl text-blue-600">Back</Text>
          </TouchableOpacity>

          <Text>Product not found.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Product;
