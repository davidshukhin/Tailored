import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import React from 'react'
import { useCart } from '../../providers/CartProvider'
import { router } from 'expo-router'
import { Svg, Path } from "react-native-svg";


const Cart = () => {
    const { items } = useCart(); 

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

      <Text>Cart: {items[0].name} </Text>
    </View>
    </SafeAreaView>
  )
}

export default Cart;