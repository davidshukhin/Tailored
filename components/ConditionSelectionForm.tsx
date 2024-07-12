import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const ConditionSelectionForm = ({ onConditionSelect }) => {
  const [selectedCondition, setSelectedCondition] = useState(null);

  const conditions = [
    { label: 'New', value: 'new' },
    { label: 'Used', value: 'used' },
  ];

  const handleSelect = (value) => {
    setSelectedCondition(value);
    onConditionSelect(value);
  };

  return (
    <View className=" bg-white rounded-lg ">
      <Text className="text-base font-mregular mb-4">Item Condition</Text>
      <View className="flex-row justify-between">
      {conditions.map((condition) => (
        <TouchableOpacity
          key={condition.value}
          onPress={() => handleSelect(condition.value)}
          className={`flex-row items-center p-2 mb-2 rounded-md  ${
            selectedCondition === condition.value ? 'bg-blue-100' : 'bg-gray-100'
          }flex-1 mr-2 last:mr-0`}
        >
          <View
            className={`w-6 h-6 rounded-full border-2 ${
              selectedCondition === condition.value
                ? 'border-gray-300 '
                : 'border-black-400'
            } mr-2 items-center justify-center`}
          >
            {selectedCondition === condition.value && (
              <View className="w-3 h-3 rounded-full bg-gray-300" />
            )}
          </View>
          <Text
            className={`text-base ${
              selectedCondition === condition.value ? 'text-gray-400 font-mbold' : 'text-gray-700 font-mregular'
            }`}
          >
            {condition.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View></View>
  );
};

export default ConditionSelectionForm;