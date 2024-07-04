import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TagBubbles = ({ tags, size }) => {

  if (!tags || tags.length === 0) {
    return null; // Render nothing if tags are null or empty
  }
  return (
    <View className="flex-row flex-wrap items-center mt-2">
      {tags.map((tag, index) => (
        <View key={index} className="bg-secondary rounded-3xl py-1 px-3 m-1">
          <Text className="font-mbold text-primary" style={{ fontSize: size }}>#{tag}</Text>
        </View>
      ))}
    </View>
  );
};


export default TagBubbles;
