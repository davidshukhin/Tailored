import { View, Text, Image, SafeAreaView } from 'react-native'
import React from 'react'

interface ItemDisplayProps {
id: number;
item: string;
}
const ItemDisplay: React.FC<ItemDisplayProps> = ({ id }) => {
  return (
   <SafeAreaView>
    <View>
        <Image 
        source={id}
        className="w-[260px] h-[168px]"
        resizeMode="contain"
        />
    </View>

   </SafeAreaView>
  )
}

export default ItemDisplay