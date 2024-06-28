import { View, Text } from 'react-native'
import React from 'react'
import { StripeProvider } from '@stripe/stripe-react-native';

const Checkout = () => {
  return (
    <StripeProvider
      publishableKey="pk_test_51LLRCzFJ7qVxZQOXcn33eDCGdFjlgTGaN880bN4Jv7oXvaO2DbxXBKU0ss1ghOsPgVhpBdhAFktg1kyo9A6NtuVy00WLwUlMb5"
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      merchantIdentifier="merchant.com.{{Tailored}}" // required for Apple Pay
    >
    <View>
      <Text>Checkout</Text>
    </View>
    </StripeProvider>
  )
}

export default Checkout