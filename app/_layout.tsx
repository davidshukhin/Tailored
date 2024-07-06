import { Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Slot, SplashScreen, Stack, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import CartProvider from "../providers/CartProvider";
import AuthProvider from "../providers/AuthProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
SplashScreen.preventAutoHideAsync();
const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Mplus-Regular": require("../assets/fonts/MPLUSRounded1c-Regular.ttf"),
    "Mplus-Bold": require("../assets/fonts/MPLUSRounded1c-Bold.ttf"),
    PoorStory: require("../assets/fonts/PoorStory-Regular.ttf"),
  });

  const [initialRoute, setInitialRoute] = useState(null);
  const router = useRouter();
  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <CartProvider>
        <SafeAreaProvider>
          <Slot />
        </SafeAreaProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default RootLayout;
