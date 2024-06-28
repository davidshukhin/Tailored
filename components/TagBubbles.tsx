import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TagBubbles = ({ tags }) => {

  if (!tags || tags.length === 0) {
    return null; // Render nothing if tags are null or empty
  }
  return (
    <View className="flex-row flex-wrap items-center mt-2">
      {tags.map((tag, index) => (
        <View key={index} className="bg-secondary rounded-3xl py-1 px-2 mr-2">
          <Text className="font-mregular text-primary text-sm">#{tag}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
 
  tag: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    color: 'white',
    fontSize: 14,
  },
});

export default TagBubbles;
