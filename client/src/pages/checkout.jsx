import React, { useCallback, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useStoreContext } from "../utils/GlobalState";
import { QUERY_CHECKOUT } from "../utils/queries";

const stripePromise = loadStripe(
  "pk_test_51OepiODs30DMhvSh8ixbeX0chGCZQ4Mkkr2xgdlOyvIR4yJLyJW0TBdYcCpZ22yrnvBv0seEoO4YDdwtV3864sBf00TM8vwKgQ"
);

const CheckoutForm = () => {
  const [state] = useStoreContext();
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);

  const fetchClientSecret = useCallback(async () => {
    try {
      const cartItems = state.cart.map((item) => ({
        price: item.priceId,
        quantity: item.purchaseQuantity,
      }));

      const response = await fetch(
        "http://localhost:3001/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ line_items: cartItems }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch client secret");
      }

      const data = await response.json();
      return data.clientSecret;
    } catch (error) {
      console.error("Error fetching client secret:", error);
      throw error;
    }
  }, [state.cart]);

  useEffect(() => {
    // Fetch client secret only after initial state is set
    if (state.cart.length > 0) {
      fetchClientSecret().then(() => {
        setInitialFetchComplete(true);
      });
    }
  }, [fetchClientSecret, state.cart]);

  const options = { fetchClientSecret };

  if (!initialFetchComplete) {
    return <div>Loading...</div>;
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default CheckoutForm;
