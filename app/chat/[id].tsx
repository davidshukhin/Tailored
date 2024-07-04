import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, FlatList, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';
import io from 'socket.io-client';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
}

const SOCKET_URL = 'http://localhost:3000';

const ChatScreen: React.FC = () => {
  const { id: recipientId, name: recipientName } = useLocalSearchParams<{ id: string, name: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList<Message>>(null);
  const socketRef = useRef<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    getCurrentUser();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchMessages();
      setupSocket();
    }
  }, [currentUserId]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
    }
  };

  const setupSocket = () => {
    socketRef.current = io(SOCKET_URL);
    socketRef.current.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });
    socketRef.current.on('newMessage', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${currentUserId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${currentUserId})`)
      .order('created_at', { ascending: true });

    if (data) {
      setMessages(data);
    } else if (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '' || !currentUserId) return;

    const message: Message = {
      id: Math.random().toString(36).substring(7), // Temporary ID generation
      sender_id: currentUserId,
      recipient_id: recipientId,
      content: newMessage,
      created_at: new Date().toISOString(),
    };

    // Insert the message into Supabase
    const { data, error } = await supabase
      .from('messages')
      .insert([message]);

    if (error) {
      console.error('Error inserting message:', error);
    } else {
      socketRef.current?.emit('sendMessage', message);
      setNewMessage('');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View className={`p-2 my-1 max-w-[80%] rounded-lg ${item.sender_id === currentUserId ? 'bg-blue-500 self-end' : 'bg-gray-300 self-start'}`}>
      <Text className={item.sender_id === currentUserId ? 'text-white' : 'text-black'}>
        {item.content}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      
      <View className="flex-1 bg-white p-4 mt-8 mb-24">
        <Button onPress={() => router.back()} title="Back" /> 
        <Text className="text-xl font-bold mb-4">Chat with {recipientName}</Text>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          className="flex-1"
          inverted
        />
        <View className="flex-row mt-4">
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 mr-2"
          />
          <TouchableOpacity onPress={sendMessage} className="bg-blue-500 rounded-lg px-4 py-2 justify-center">
            <Text className="text-white font-bold">Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;