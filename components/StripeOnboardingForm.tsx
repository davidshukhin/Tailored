import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';

const StripeOnboardingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    business_profile: {
      mcc: '',
      url: '',
    },
    settings: {
      payments: {
        statement_descriptor: '',
      },
    },
    tos_acceptance: {
      ip: '',
      date: '',
    },
    external_account: '',
    individual: {
      first_name: '',
      last_name: '',
      dob: {
        day: '',
        month: '',
        year: '',
      },
      address: {
        line1: '',
        postal_code: '',
        city: '',
        state: '',
      },
      email: '',
      phone: '',
      ssn_last_4: '',
    },
  });

  const handleChange = (field, value) => {
    setFormData(prevData => {
      const newData = { ...prevData };
      const fields = field.split('.');
      let current = newData;
      for (let i = 0; i < fields.length - 1; i++) {
        if (!current[fields[i]]) {
          current[fields[i]] = {};
        }
        current = current[fields[i]];
      }
      current[fields[fields.length - 1]] = value;
      return newData;
    });
  };

  const handleSubmit = () => {
    // Validate form data here
    onSubmit(formData);
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-6 text-gray-800">Stripe Onboarding Form</Text>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2 text-gray-700">Business Information</Text>
          <TextInput
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            placeholder="Merchant Category Code"
            value={formData.business_profile.mcc}
            onChangeText={(value) => handleChange('business_profile.mcc', value)}
          />
          <TextInput
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            placeholder="Business URL"
            value={formData.business_profile.url}
            onChangeText={(value) => handleChange('business_profile.url', value)}
          />
          <TextInput
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            placeholder="Statement Descriptor"
            value={formData.settings.payments.statement_descriptor}
            onChangeText={(value) => handleChange('settings.payments.statement_descriptor', value)}
          />
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2 text-gray-700">Terms of Service</Text>
          <TextInput
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            placeholder="IP Address"
            value={formData.tos_acceptance.ip}
            onChangeText={(value) => handleChange('tos_acceptance.ip', value)}
          />
          <TextInput
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            placeholder="Acceptance Date (YYYY-MM-DD)"
            value={formData.tos_acceptance.date}
            onChangeText={(value) => handleChange('tos_acceptance.date', value)}
          />
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2 text-gray-700">External Account</Text>
          <TextInput
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            placeholder="External Account Token"
            value={formData.external_account}
            onChangeText={(value) => handleChange('external_account', value)}
          />
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2 text-gray-700">Personal Information</Text>
          <TextInput
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            placeholder="First Name"
            value={formData.individual.first_name}
            onChangeText={(value) => handleChange('individual.first_name', value)}
          />
          <TextInput
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            placeholder="Last Name"
            value={formData.individual.last_name}
            onChangeText={(value) => handleChange('individual.last_name', value)}
          />

          <Text className="font-semibold mb-1 text-gray-700">Date of Birth</Text>
          <View className="flex-row justify-between mb-2">
            <TextInput
              className="w-[30%] p-2 border border-gray-300 rounded"
              placeholder="Day"
              value={formData.individual.dob.day}
              onChangeText={(value) => handleChange('individual.dob.day', value)}
            />
            <TextInput
              className="w-[30%] p-2 border border-gray-300 rounded"
              placeholder="Month"
              value={formData.individual.dob.month}
              onChangeText={(value) => handleChange('individual.dob.month', value)}
            />
            <TextInput
              className="w-[30%] p-2 border border-gray-300 rounded"
              placeholder="Year"
              value={formData.individual.dob.year}
              onChangeText={(value) => handleChange('individual.dob.year', value)}
            />
          </View>

          <Text className="font-semibold mb-1 text-gray-700">Address</Text>
          <TextInput
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            placeholder="Street Address"
            value={formData.individual.address.line1}
            onChangeText={(value) => handleChange('individual.address.line1', value)}
          />
          <TextInput
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            placeholder="Postal Code"
            value={formData.individual.address.postal_code}
            onChangeText={(value) => handleChange('individual.address.postal_code', value)}
          />
          <TextInput
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            placeholder="City"
            value={formData.individual.address.city}
            onChangeText={(value) => handleChange('individual.address.city', value)}
          />
          <TextInput
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            placeholder="State"
            value={formData.individual.address.state}
            onChangeText={(value) => handleChange('individual.address.state', value)}
          />

          <TextInput
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            placeholder="Email"
            value={formData.individual.email}
            onChangeText={(value) => handleChange('individual.email', value)}
          />
          <TextInput
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            placeholder="Phone (U.S. number)"
            value={formData.individual.phone}
            onChangeText={(value) => handleChange('individual.phone', value)}
          />
          <TextInput
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            placeholder="Last 4 digits of SSN"
            value={formData.individual.ssn_last_4}
            onChangeText={(value) => handleChange('individual.ssn_last_4', value)}
          />
        </View>

        <TouchableOpacity 
          className="bg-blue-500 p-3 rounded"
          onPress={handleSubmit}
        >
          <Text className="text-white text-center font-semibold">Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default StripeOnboardingForm;