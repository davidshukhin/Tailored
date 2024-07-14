import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';

interface ColorSelectorDropdownProps {
  onColorSelect: (colors: string[]) => void;
  colors: string[];
}

const ColorSelectorDropdown: React.FC<ColorSelectorDropdownProps> = ({ onColorSelect, colors }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const handleSelect = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else if (selectedColors.length < 2) {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleConfirm = () => {
    setModalVisible(false);
    onColorSelect(selectedColors);
  };

  return (
    <View className="mt-4">
      <Text className="text-base font-mbold mb-2">Color</Text>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-gray-300 focus:border-black flex flex-row items-center"
      >
        <Text className="text-base font-mregular text-gray-500">
          {selectedColors.length > 0 ? selectedColors.join(', ') : 'Choose up to 2'}
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
              data={colors}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  className={`py-3 border-b border-gray-200 ${selectedColors.includes(item) ? 'bg-gray-300' : ''}`}
                >
                  <Text className="text-base">{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={handleConfirm}
              className="mt-4 bg-gray-200 p-3 rounded-md"
            >
              <Text className="text-center text-base font-semibold">Confirm</Text>
            </TouchableOpacity>
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

export default ColorSelectorDropdown;
