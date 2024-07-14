import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, SafeAreaView } from 'react-native';

const SizeSelectorDropdown = ({ onSizeSelect, sizes}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  //const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const handleSelect = (size) => {
    setSelectedSize(size);
    setModalVisible(false);
    onSizeSelect(size);
  };

  return (
    <View className="mt-4">
      <Text className="text-base font-mbold mb-2">Size    </Text>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="w-full h-14 px-4 bg-black-100 rounded-2xl border-2 border-gray-300 focus:border-black flex flex-row items-center"
      >
        <Text className="text-base font-mregular text-gray-500">
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
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View className="bg-white rounded-t-lg p-4 h-1/2">
            <FlatList
              data={sizes}
              keyExtractor={(item) => item}
              ListEmptyComponent={<Text className="text-center text-base">Select category first</Text>}
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