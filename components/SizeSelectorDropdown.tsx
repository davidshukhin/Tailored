import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';

const SizeSelectorDropdown = ({ onSizeSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const handleSelect = (size) => {
    setSelectedSize(size);
    setModalVisible(false);
    onSizeSelect(size);
  };

  return (
    <View className="mt-4">
      <Text className="text-lg font-mbold mb-2">Select Size</Text>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="bg-white border border-gray-300 rounded-md p-3 flex-row justify-between items-center"
      >
        <Text className="text-base">
          {selectedSize ? selectedSize : 'Choose a size'}
        </Text>
        <Text className="text-gray-500">▼</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-opacity-50">
          <View className="bg-white rounded-t-lg p-4">
            <Text className="text-lg font-mbold mb-2">Select a Size</Text>
            <FlatList
              data={sizes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  className="py-3 border-b border-gray-200"
                >
                  <Text className="text-base">{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-4 bg-gray-200 p-3 rounded-md"
            >
              <Text className="text-center text-base font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SizeSelectorDropdown;