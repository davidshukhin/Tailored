import React, { useState } from "react";
import {
  View,
  Button,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import StripeOnboardingForm from "../components/StripeOnboardingForm";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "../lib/supabase";
import { useAuth } from "../providers/AuthProvider";

const LOCAL_IP = "192.168.0.4"; // Replace with your actual local IP
const SERVER_URL = `http://${LOCAL_IP}:4242`;

export default function Home() {
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [accountUpdatePending, setAccountUpdatePending] = useState(false);
  const [connectedAccountUpdated, setConnectedAccountUpdated] = useState(false);
  const [error, setError] = useState(false);
  const [connectedAccountId, setConnectedAccountId] = useState();
  const { session} = useAuth();

  const handleFormSubmit = async (formData) => {
    console.log("Form submitted with data:", formData);
    console.log("Connected Account ID:", connectedAccountId);
    setAccountUpdatePending(true);
    setError(false);
    try {
      console.log(
        "Sending request to:",
        `http://localhost:4242/account/${connectedAccountId}`
      );
      const response = await fetch(
        `http://localhost:4242/account/${connectedAccountId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Response data:", result);
      setAccountUpdatePending(false);
      setConnectedAccountUpdated(true);
    } catch (err) {
      console.error("Error updating account:", err);
      setError(true);
      setAccountUpdatePending(false);
    }
  };

  const updateStripeId = async (connectedAccountId) => {
    try {
      const { data, error } = await supabase
        .from("sellers")
        .update({ stripe_id: connectedAccountId })
        .eq("user_id", session?.user.id);
    } catch (error) {}
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-4">
        <View className="bg-blue-500 p-4 rounded-lg mb-4">
          <Text className="text-white text-xl font-bold">Tailored</Text>
        </View>

        <View className="mb-6">
          {!connectedAccountId && (
            <>
              <Text className="mb-4">
                Sign up to start selling on Tailored!
              </Text>
              {!accountCreatePending && (
                <TouchableOpacity
                  className="bg-green-500 p-3 rounded"
                  onPress={async () => {
                    setAccountCreatePending(true);
                    setError(false);
                    fetch("http://localhost:4242/account", {
                      method: "POST",
                    })
                      .then((response) => response.json())
                      .then((json) => {
                        setAccountCreatePending(false);
                        const { account, error } = json;

                        if (account) {
                          setConnectedAccountId(account);
                        }
                        console.log(account);
                        if (error) {
                          setError(true);
                        }
                      });
                  }}
                >
                  <Text className="text-white text-center font-semibold">
                    Sign Up
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {connectedAccountId && (
            <>
              <Text className="text-lg font-semibold mb-2">
                Add information to start accepting money
              </Text>
              <Text className="mb-4">
                Tailored partners with Stripe to help you receive payments while
                keeping your personal and bank details secure.
              </Text>
              {!accountUpdatePending && !connectedAccountUpdated && (
                <TouchableOpacity
                  className="bg-blue-500 p-3 rounded mb-4"
                  onPress={async () => {
                    setError(false);
                    console.log(
                      "Sending request to:",
                      `http://localhost:4242/account_links/${connectedAccountId}`
                    );
                    fetch(`http://localhost:4242/account_links/`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        account: { connectedAccountId },
                      }),
                    })
                      .then((response) => response.json())
                      .then((json) => {
                        console.log("Response data:", json);
                        const { link, error } = json;

                        if (link) {
                          console.log("Opening onboarding link:", link.url);
                          WebBrowser.openBrowserAsync(link.url).catch((err) =>
                            console.error("An error occurred", err)
                          );
                        }

                        if (error) {
                          setError(true);
                        }
                      });
                  }}
                >
                  <Text className="text-white text-center font-semibold">
                    Add Info
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {connectedAccountUpdated && (
            <View className="mt-4">
              <StripeOnboardingForm onSubmit={handleFormSubmit} />
            </View>
          )}

          {error && (
            <Text className="text-red-500 mt-2">Something went wrong!</Text>
          )}

          {(connectedAccountId ||
            accountCreatePending ||
            accountUpdatePending) && (
            <View className="mt-4 p-4 bg-gray-200 rounded-lg">
              {connectedAccountId && (
                <Text>Your connected account ID is: {connectedAccountId}</Text>
              )}
              {accountCreatePending && (
                <Text>Creating a connected account...</Text>
              )}
              {accountUpdatePending && (
                <Text>Adding some onboarding information...</Text>
              )}
              {connectedAccountUpdated && (
                <View>
                  <Text className="mb-2">
                    Account onboarding has begun. Determine the required
                    information you need to gather.
                  </Text>
                  <Text className="mb-2">
                    Build a flow for your connected accounts to input it and
                    pass it to Stripe.
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(
                        "https://docs.stripe.com/connect/required-verification-information"
                      )
                    }
                  >
                    <Text className="text-blue-500 underline">
                      View required verification information
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
