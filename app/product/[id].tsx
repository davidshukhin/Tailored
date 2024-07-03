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

const Product = () => {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { addItem } = useCart();
  
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
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!product) return;
    addItem(product.item_id);
    console.log("Added to cart: " + product.item_id);
  }

  if (loading) {
    return <ActivityIndicator size="large" color="#FFA001" />;
  }

  

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row">
        <TouchableOpacity onPress={() => router.back()} className="ml-4">
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
      {product ? (
        <>
          <ScrollView>
            <View>
              <FlatList
                data={product.imageURLS}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} className="w-80 h-80 m-4" />
                )}
                horizontal
                showsHorizontalScrollIndicator={true}
              />
            </View>
            <View className="ml-4 mr-4">
              <View className="flex-row items-center justify-between">
              <Text className="font-mbold text-xl">{product.name}</Text>
              <Text className="text-xl">{product.likes}</Text>
              </View>
              <Text className="font-mregular text-lg">{product.brand}</Text>
              <Text className="font-mregular"> ${product.price}</Text>
              <Text className="font-mregular mt-2"> {product.description}</Text>
              <TagBubbles size={20} tags={product.tags} />

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
        <TouchableOpacity onPress={() => router.push('/cart')} className="ml-4 ">
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
      
        <Text>Product not found.</Text></View>
      )}
    </SafeAreaView>
  );
};

export default Product;
