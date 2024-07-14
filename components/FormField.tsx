import { useState } from "react";
import { TextInputProps, View, Text, TextInput, TouchableOpacity, Image } from "react-native";



interface FromFieldProps extends TextInputProps {
    title: string;
    value: string;
    handleChangeText: (value:string) => void;
    otherStyles?: object;
}

const FormField: React.FC<FromFieldProps> = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-black font-mbold">{title}</Text>

      <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-gray-300 focus:border-black flex flex-row items-center">
        <TextInput
          className="flex-1 text-black font-mregular text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;