import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native'
import React from 'react'
import { useCart } from '../../providers/CartProvider'
import { router } from 'expo-router'
import { Svg, Path } from "react-native-svg";
import { supabase } from '../../lib/supabase';
import { useState, useEffect } from 'react'
import { FlashList } from '@shopify/flash-list';

type Product = {
    id: string;
    name: string;
    price: number;
    description: string;
    imageURLS: string;
    brand: string;
}
const Cart = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const { items } = useCart(); 

    useEffect(() => {
        fetchProducts();
    }, [items]);

    const fetchProducts = async () => { 
        if (items.length > 0) { 
            try { 
                let { data, error } = await supabase
                .from("listings")
                .select("*")
                .in("id", items)
                if (error) throw error;
                if(data)
                    setProducts(data);
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        }
    }

    const renderItem = ({ item }: { item: Product }) => (
        <View className='flex-row p-4 bg-white m-2 rounded-lg shadow-md'>
            <TouchableOpacity onPress={() => router.push(`/product/${item.id}`)}>
      <Image source={{ uri: item.imageURLS[0] }} className='w-20 h-20 rounded-md'/>
      </TouchableOpacity>
      <View className='ml-4 justify-center'>
        <Text className='text-lg font-bold'>{item.name}</Text>
        <Text className='text-sm text-gray-600 mt-1'>${item.price.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className='bg-primary'>
    <View>
         
        <TouchableOpacity onPress={() => router.push('/home')} className="ml-4">
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
    <ScrollView className='h-full'>
        {products.length > 0 ? (
         
            <FlashList 
            data={products}
            renderItem={renderItem}
            estimatedItemSize={100}
            />
            
            
         
        ) : (
          <Text>No products in the cart.</Text>
        )}
    </ScrollView>
    </SafeAreaView>
  )
}

export default Cart;