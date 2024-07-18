import { useState, useEffect } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";

export const useStripeConnect = (connectedAccountId) => {
    const [stripeConnectInstance, setStripeConnectInstance] = useState();
  
    useEffect(() => {
      if (connectedAccountId) {
        const fetchClientSecret = async () => {
          const response = await fetch("/account_session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              account: connectedAccountId,
            }),
          });
  
          if (!response.ok) {
            // Handle errors on the client side here
            const { error } = await response.json();
            throw ("An error occurred: ", error);
          } else {
            const { client_secret: clientSecret } = await response.json();
            return clientSecret;
          }
        };
  
        setStripeConnectInstance(
          loadConnectAndInitialize({
            publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
            fetchClientSecret,
            appearance: {
              overlays: "dialog",
              variables: {
                colorPrimary: "#635BFF",
              },
            },
          })
        );
      }
    }, [connectedAccountId]);
  
    return stripeConnectInstance;
  };
  
export default useStripeConnect;