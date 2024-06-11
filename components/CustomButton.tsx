import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface CustomButtonProps {
  title: string;
  handlePress: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <LinearGradient
      colors={["#7B73D3", "#DED9FB"]}
      start={[0, 0]}
      end={[1, 0]}
      style={{
        borderRadius: 67,
        shadowColor: "rgba(0, 0, 0, 0.15)",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 5.038,
        marginTop: 20,
        marginBottom: 20,
      }}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={{
          display: "flex",
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 67,
          opacity: isLoading ? 0.5 : 1,
        }}
        disabled={isLoading}
      >
        <Text
          style={{
            color: "#ffffff",
            fontWeight: "600",
            fontSize: 18,
            textAlign: "center",
          }}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default CustomButton;
