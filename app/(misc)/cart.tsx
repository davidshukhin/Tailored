import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React from "react";
import { useCart } from "../../providers/CartProvider";
import { router } from "expo-router";
import { Svg, Path } from "react-native-svg";
import { supabase } from "../../lib/supabase";
import { useState, useEffect } from "react";
import { FlashList } from "@shopify/flash-list";
import { useAuth } from "../../providers/AuthProvider";


type Product = {
  item_id: string;
  name: string;
  price: number;
  description: string;
  imageURLS: string[];
  brand: string | null;
  size: string;
};
const Cart = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { items, removeItem } = useCart();
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    
    fetchProducts();

  }, []);

  useEffect(() => {
    console.log(products);
  }, [products]);

  const fetchProducts = async () => {
    try {
      let {data, error} = await supabase.from('cart').select(`
        
        listings(
        item_id,
        name,
        price,
        description,
        size,
        brand,
        imageURLS)

        `
      ).eq('user_id', session?.user.id);

      if (data) {
        const mappedData = data.map((item: any) => ({
          item_id: item.listings.item_id,
          name: item.listings.name,
          price: item.listings.price,
          description: item.listings.description,
          imageURLS: item.listings.imageURLS,
          brand: item.listings.brand,
          size: item.listings.size,
        }));

        setProducts(mappedData);
        }
      
    } catch (error) {
      
    } finally{
      setLoading(false);
    }
  }

  const renderItem = ({ item }) => (
    <View className="flex-row p-4 bg-white m-2 rounded-lg shadow-md">
    
      <TouchableOpacity onPress={() => router.push(`/product/${item.item_id}`)}>
        <Image
         source={{ uri: item.imageURLS[0] }}
          className="w-20 h-20 rounded-md"
        />
      </TouchableOpacity>
      <View className="ml-4 justify-center">
        <Text className="text-lg font-bold">{item.name}</Text>
        <Text className="text-sm text-gray-600 mt-1">
          ${item.price.toFixed(2)}
        </Text>
      </View>
    </View>
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary">
      <View>
        <TouchableOpacity onPress={() => router.push("/likes")} className="ml-4">
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
      <ScrollView className="h-full">
      {loading ? (
          <ActivityIndicator size="large" className="items-center align-center justify-center"/>
      ) : (
          <FlashList
          key={products.length}
            data={products}
            renderItem={renderItem}
            estimatedItemSize={200}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={<Text>No items in cart</Text>}
          />
        ) }
      </ScrollView>
    </SafeAreaView>
  );
};

export default Cart;
