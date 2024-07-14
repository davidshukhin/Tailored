import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, SafeAreaView } from 'react-native';

const CategorySelectorDropdown = ({ onSubcategorySelect, label }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const categories = {
   "Menswear": {
      "Outerwear": ["Jackets", "Coats", "Blazers"],
      "Tops": ["Shirts", "T-Shirts", "Polos", "Sweaters"],
      "Bottoms": ["Jeans", "Trousers", "Shorts"],
      "Footwear": ["Sneakers", "Boots", "Dress Shoes", "Sandals"],
      "Tailoring": ["Suits", "Blazers", "Dress Pants"],
      "Accessories": ["Hats", "Scarves", "Gloves", "Belts"],
   },
 
    "Womenswear": {
      "Outerwear": ["Jackets", "Coats", "Blazers"],
      "Tops": ["Blouses", "T-Shirts", "Crop Tops", "Sweaters"],
      "Bottoms": ["Jeans", "Trousers", "Shorts", "Skirts"],
      "Footwear": ["Sneakers", "Boots", "Heels", "Sandals"],
      "Accessories": ["Hats", "Scarves", "Gloves", "Belts"],
      "Bags": ["Handbags", "Backpacks", "Tote Bags"],
      "Jewelry": ["Earrings", "Bracelets", "Necklaces"],
      "Dresses": ["Casual Dresses", "Formal Dresses", "Party Dresses"]
    }
  };


  const handleSelectGender = (gender) => {
    setSelectedGender(gender);
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  const handleSelectSubCategory = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setModalVisible(false);
    onSubcategorySelect(selectedGender, selectedCategory, subcategory);
    setSelectedGender(null);
    setSelectedCategory(null);
  };

  return (
    <View className="mt-4 mr-12 flex-1">
      <Text className="text-base font-mbold mb-2">Category</Text>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="w-full h-14 px-4 bg-black-100 rounded-2xl border-2 border-gray-300 focus:border-black flex flex-row items-center justify-between"
      >
        <Text className="text-base font-mregular text-gray-400">
          {selectedSubcategory ? selectedSubcategory : 'Choose a category'}
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
          <View className="bg-white rounded-t-lg p-4">
          {!selectedGender ? (
              <FlatList
                data={Object.keys(categories)}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelectGender(item)}
                    style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'lightgray' }}
                  >
                    <Text style={{ fontSize: 16 }}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : !selectedCategory ? (
              <FlatList
                data={Object.keys(categories[selectedGender])}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelectCategory(item)}
                    style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'lightgray' }}
                  >
                    <Text style={{ fontSize: 16 }}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <FlatList
                data={categories[selectedGender][selectedCategory]}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelectSubCategory(item)}
                    style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'lightgray' }}
                  >
                    <Text style={{ fontSize: 16 }}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
            <TouchableOpacity
              onPress={() => {
                if (selectedCategory) {
                  setSelectedCategory(null);
                } else if (selectedGender) {
                  setSelectedGender(null);
                } else {
                  setModalVisible(false);
                }
              }}
              style={{ marginTop: 10, backgroundColor: '#f0f0f0', padding: 15, borderRadius: 5 }}
            >
              <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
                {selectedCategory ? 'Back' : selectedGender ? 'Back' : 'Cancel'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CategorySelectorDropdown;
