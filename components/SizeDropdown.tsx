import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';

const SizeDropdown = ({ sizes, onSelect }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (size) => {
    setSelectedSize(size);
    setModalVisible(false);
    onSelect(size);
  };

  return (
    <View>
      <TouchableOpacity
        className="p-3 border border-gray-300 rounded-md"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-base">
          {selectedSize || 'Select Size'}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-5 rounded-lg w-4/5 max-h-4/5">
            <FlatList
              data={sizes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="py-4 border-b border-gray-200"
                  onPress={() => handleSelect(item)}
                >
                  <Text className="text-base">{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              className="mt-5 p-3 bg-gray-200 rounded-md items-center"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-base font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SizeDropdown;