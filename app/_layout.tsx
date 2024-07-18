import { ActivityIndicator, Text, View, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import { Slot, SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import CartProvider from "../providers/CartProvider";
import AuthProvider from "../providers/AuthProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StripeProvider } from "@stripe/stripe-react-native";
SplashScreen.preventAutoHideAsync();
const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Mplus-Regular": require("../assets/fonts/MPLUSRounded1c-Regular.ttf"),
    "Mplus-Bold": require("../assets/fonts/MPLUSRounded1c-Bold.ttf"),
    PoorStory: require("../assets/fonts/PoorStory-Regular.ttf"),
  });

  const [initialRoute, setInitialRoute] = useState(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  useEffect(() => {
    const handleDeepLink = (event) => {
      let url = event.url;
      if (url.includes('reauth')) {
        router.push('/reauth');
      } else if (url.includes('example.com/return')) {
        router.push('/profile');
      }
    };

    Linking.addEventListener('url', handleDeepLink);
    return () => (Linking as any).removeEventListener('url', handleDeepLink);
  }, [router]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <CartProvider>
        <StripeProvider
          publishableKey="pk_test_51LLRCzFJ7qVxZQOXcn33eDCGdFjlgTGaN880bN4Jv7oXvaO2DbxXBKU0ss1ghOsPgVhpBdhAFktg1kyo9A6NtuVy00WLwUlMb5"
          urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
          merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
        >
          <SafeAreaProvider>
            <Slot />
          </SafeAreaProvider>
        </StripeProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default RootLayout;
