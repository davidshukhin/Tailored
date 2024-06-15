import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Svg, Path } from "react-native-svg";
import { supabase } from "../../lib/supabase";
import CustomButton from "../../components/CustomButton";
import { useCart } from "../../providers/CartProvider";

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
        .eq("id", productId)
        .single();

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
    addItem(product.id);
    console.log("Added to cart");
  }

  if (loading) {
    return <ActivityIndicator size="large" color="#FFA001" />;
  }

  

  return (
    <SafeAreaView className="flex-1 bg-primary">
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
            <View className="m-8">
              <Text className="font-mbold text-2xl">{product.name}</Text>
              <Text className="font-mregular text-lg">{product.brand}</Text>
              <Text className="font-mregular"> ${product.price}</Text>
              <Text className="font-mregular"> {product.description}</Text>

              <CustomButton
                title="Add to cart"
                handlePress={addToCart}
                containerStyles="mt-7"
              />
            </View>
          </ScrollView>
        </>
      ) : (
        <Text>Product not found.</Text>
      )}
    </SafeAreaView>
  );
};

export default Product;
