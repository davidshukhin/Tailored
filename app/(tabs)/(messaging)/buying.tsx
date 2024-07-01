import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlashList } from '@shopify/flash-list'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { router } from 'expo-router'
import { supabase } from '../../../lib/supabase'


const Buying = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [user, setUser] = useState<string>("");

  useEffect(() => {
    getUser();
    getUserData(user);
    fetchChats();
  }, []);

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setUser(user.id);
    }
  };

  const getUserData = async (user_id: string) => {
    try {
      let { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user_id)
        .single();

        if(user){
          setUser(user.user_id)
          console.log(user.user_id)
        }
    } catch (error) {
    }

  };

  const fetchChats = async () => {


        
  try {
    let { data: chats, error } = await supabase.from('messages').select(`
      recipient_id,
      users (
        user_id
      )
    `).eq('sender_id', user);

    if(chats){
      setChats(chats)
      console.log(chats)
    }
  } catch (error) {
    
  }
  
  }
  const renderItem = ({ item }) => {
    <View className="flex-row justify-start p-4 items-center">
    <TouchableOpacity onPress={() => router.push(`/profile/${seller?.username}`)}>
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
    <Text className="font-mregular text-black">Likes: {user}</Text>
    </View>
    <TouchableOpacity onPress={() => router.push("/cart")}>
    <Image source={icons.cart} className="w-8 h-8" />
    </TouchableOpacity>
    </View>
  
  }
  return (
    <FlashList data={chats} renderItem={({ item }) => <Text>{item.title}</Text>}
    estimatedItemSize={200}/>
  )
}

export default Buying