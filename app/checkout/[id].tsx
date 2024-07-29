import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import {
  router,
  useGlobalSearchParams,
  useLocalSearchParams,
} from "expo-router";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../providers/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Svg, Path, G } from "react-native-svg";
import Shippo from "shippo";

const API_URL = "http://localhost:4242"; // Replace with your actual API URL

interface AddressCreateRequest {
  name: string;
  company?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
  metadata?: string;
}


export default function CheckoutScreen() {
  const { id } = useLocalSearchParams();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);
  const { session } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [name, setName] = useState<string>(""); 
  const [customerId, setCustomerId] = useState<any>(null);
  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    initializePaymentSheet();
  }, [seller]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const [
        { data, error: productError },
        { count: likesCount, error: likesError },
        { data: inCart, error: cartError },
      ] = await Promise.all([
        await supabase.from("listings").select("*").eq("item_id", id).single(),
        await supabase
          .from("liked_items")
          .select("*", { count: "exact" })
          .eq("item_id", id),
        await supabase
          .from("cart")
          .select("*")
          .eq("item_id", id)
          .eq("user_id", session?.user.id),
      ]);

      if (productError) throw productError;
      if (likesError) throw likesError;
      if (cartError) throw cartError;

      setProduct(data);
      getSellerData(data.user_id);
    } catch (error) {
      console.log(error);
    }
  };

  const getSellerData = async (user_id) => {
    try {
      const [
        { data: sellerData, error: sellerError },
        { data: userData, error: userError },
        { data: nameData, error: nameError },
      ] = await Promise.all([
        supabase.from("sellers").select("*").eq("user_id", user_id).single(),
        supabase
          .from("users")
          .select("stripe_customer_id")
          .eq("user_id", session?.user.id),
        supabase.from("users").select("name").eq("user_id", user_id).single(),
      ]);

      if (sellerError) throw sellerError;
      if (userError) throw userError;
      if (nameError) throw nameError

      if (userData) {
        setCustomerId(userData);
      }
      if (sellerData) {
        setSeller(sellerData);
      }
      if (nameData) {
        setName(nameData.name);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateUser = async (customer) => {
    const { data, error } = await supabase
      .from("users")
      .update({ stripe_customer_id: customer })
      .eq("user_id", session?.user.id)
      .select();
  };

  const fetchPaymentSheetParams = async () => {
    const connectedAccountId = String(seller.stripe_id);
    const response = await fetch("http://localhost:4242/payment-sheet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerId: customerId,
        price: product.price,
        connectedAccountId: connectedAccountId,
      }),
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();
    if (typeof customerId != "string") {
      setCustomerId(customer);
      updateUser(customer);
    }

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const {
      paymentIntent,
      ephemeralKey,
      customer,
      //publishableKey,
    } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Tailored",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: false,
      defaultBillingDetails: {
        email: session?.user.email,
        name: name,
      },
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      console.log(`Error code: ${error.code}`, error.message);
    } else {
      console.log("Success", "Your order is confirmed!");
    }
  };

//working code. for testing purposes
  const shippingAddress = async () => {
    try {
        console.log("Attempting to create address...");
        fetch('http://localhost:3000/create-address')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error('There was a problem with the fetch operation:', error));

    } catch (error) {
        console.error("Error creating address:", error);
    }
}

async function createShipment() {
  const response = await fetch('http://localhost:3000/create-shipment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      addressFrom: {
        name: 'Shawn Ippotle',
        street1: '215 Clayton St.',
        city: 'San Francisco',
        state: 'CA',
        zip: '94117',
        country: 'US',
        phone: '+1 555 341 9393',
        email: 'shippotle@goshippo.com',
      },
      addressTo: {
        name: 'Mr Hippo',
        street1: 'Broadway 1',
        city: 'New York',
        state: 'NY',
        zip: '10007',
        country: 'US',
        phone: '+1 555 341 9393',
        email: 'mrhippo@goshippo.com',
      },
      parcel: {
        length: '5',
        width: '5',
        height: '5',
        distance_unit: 'in',
        weight: '2',
        massUnit: 'lb',
      },
    }),
  });

  const data = await response.json();
  if (response.ok) {
    console.log('Label URL:', data.label_url);
  } else {
    console.log("error")
    console.error('Error:', data.error);
  }
}

createShipment();


  if (!product) {
    return <Text>Loading item details...</Text>;
  }

  return (
    <SafeAreaView className="flex-1 m-2 p-4 bg-white rounded-lg shadow-lg">
      <View className="h-14 bg-white">
        <TouchableOpacity
          onPress={() => router.back()}
          className=" shadow-2xl shadow-black"
        >
          <Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <Path
              d="M26.25 13.75H8.01748L14.6337 7.13371L12.8662 5.36621L3.23248 15L12.8662 24.6337L14.6337 22.8662L8.01748 16.25H26.25V13.75Z"
              fill="black"
            />
          </Svg>
        </TouchableOpacity>
      </View>
      <Image
        source={{ uri: product.imageURLS[0] }}
        className=" h-80 w-auto rounded-lg "
      /> 
      <View className="p-4">
        <Text className="text-lg font-bold">{product.name}</Text>
        <Text className="text-gray-600">{product.description}</Text>
        <Text className="text-green-500 text-lg">${product.price}</Text>
        <Text className="text-gray-500">Size: {product.size}</Text>
        <Button
          disabled={!loading}
          title="Checkout"
          onPress={openPaymentSheet}
        />

        <Button
          title="Shipping Address"
          onPress={shippingAddress}
          />
      </View>
    </SafeAreaView>
  );
}
