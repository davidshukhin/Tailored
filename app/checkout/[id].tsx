import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import {
  router,
  useGlobalSearchParams,
  useLocalSearchParams,
} from "expo-router";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../providers/AuthProvider";

const API_URL = "http://localhost:4242"; // Replace with your actual API URL

export default function CheckoutScreen() {
  const { id } = useLocalSearchParams();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);
  const { session } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [customerId, setCustomerId] = useState<any>(null);
  useEffect(() => {
    fetchProduct();

    console.log(id);
  }, [id]);

  useEffect(() => {
    initializePaymentSheet();
  }, [seller]);

  useEffect(() => {
    console.log("Customer ID updated", customerId);
  }, [customerId]);

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
      ] = await Promise.all([
        supabase.from("sellers").select("*").eq("user_id", user_id).single(),
        supabase
          .from("users")
          .select("stripe_customer_id")
          .eq("user_id", session?.user.id),
      ]);

      if (sellerError) throw sellerError;
      if (userError) throw userError;

      if (userData) {
        setCustomerId(userData);
      }
      if (sellerData) {
        console.log("Seller Data", sellerData);
        setSeller(sellerData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateUser = async (customer) => {
    
    const { data, error } = await supabase
      .from('users')
      .update({ stripe_customer_id: customer })
      .eq('user_id', session?.user.id)
      .select();
  }
 
  const fetchPaymentSheetParams = async () => {
    const connectedAccountId = String(seller.stripe_id);
    console.log("Connected Account ID befp fetch", customerId);
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
      console.log("Customer ID nice", customer);
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
        name: "Dave",
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

  if (!product) {
    return <Text>Loading item details...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      {/* <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text> */}
      <Button disabled={!loading} title="Checkout" onPress={openPaymentSheet} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  itemName: {
    fontSize: 18,
    marginBottom: 10,
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
