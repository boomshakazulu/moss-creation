import React, { useCallback, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useStoreContext } from "../utils/GlobalState";
import { useNavigate, useLocation } from "react-router-dom";
import Auth from "../utils/auth";

const stripePromise = loadStripe(
  "pk_test_51OepiODs30DMhvSh8ixbeX0chGCZQ4Mkkr2xgdlOyvIR4yJLyJW0TBdYcCpZ22yrnvBv0seEoO4YDdwtV3864sBf00TM8vwKgQ"
);

const CheckoutForm = () => {
  const [state, dispatch] = useStoreContext();
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const location = useLocation();
  const { buyNow } = location.state || {};
  console.log(buyNow);

  useEffect(() => {
    // Redirect logic with messages
    if (!Auth.loggedIn() || errorMessage) {
      const redirectTimer = setTimeout(() => {
        navigate("/signup");
      }, 5000);

      return () => clearTimeout(redirectTimer); // Cleanup timer on unmount
    }

    if (!state.cart || (state.cart.length === 0 && !buyNow)) {
      const redirectTimer = setTimeout(() => {
        navigate("/");
      }, 5000);

      return () => clearTimeout(redirectTimer);
    }
  }, []);

  const fetchClientSecret = useCallback(async () => {
    const user = Auth.getProfile();
    try {
      const cartItems = buyNow
        ? [{ price: buyNow.product.priceId, quantity: 1 }]
        : state.cart.map((item) => ({
            price: item.priceId,
            quantity: item.purchaseQuantity,
          }));

      const productIds = buyNow
        ? [
            {
              productId: buyNow.product._id,
              quantity: 1,
              price: buyNow.product.price,
            },
          ]
        : state.cart.map((item) => ({
            productId: item._id,
            quantity: item.purchaseQuantity,
            price: item.price,
          }));

      const response = await fetch(
        "http://localhost:3001/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            line_items: cartItems,
            shipping_address_collection: {
              allowed_countries: ["US", "CA"], // Specify the countries you want to allow shipping to
            },
            metadata: {
              products: JSON.stringify(productIds),
              customerEmail: user.data.email,
              userId: user.data.id,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch client secret");
      }

      const data = await response.json();
      return data.clientSecret;
    } catch (error) {
      throw error;
    }
  }, [state.cart]);

  useEffect(() => {
    const fetchDecodedToken = async () => {
      try {
        const decodedToken = Auth.getProfile();
        const userId = decodedToken ? decodedToken.data.id : null;
        // Set userId or handle accordingly
        setInitialFetchComplete(true);
        if (state.cart.length > 0) {
          const secret = await fetchClientSecret(userId);
          setClientSecret(secret);
        }
        setErrorMessage(null);
      } catch (error) {
        // If error occurs due to user not being logged in
        setErrorMessage("User not logged in error");
      }
    };

    fetchDecodedToken();
  }, [fetchClientSecret, state.cart]);

  if (!Auth.loggedIn()) {
    return (
      <div>
        <h3 style={{ textAlign: "center" }}>
          Please create an account to checkout.
          <br />
          <br />
          You will be redirected to the signup page in 5 seconds.
        </h3>
      </div>
    );
  }

  if (!initialFetchComplete) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return (
      <div>
        <h2>Error:</h2>
        <h3>
          The checkout is having some issues please try again in some minutes or
          contact us at{" "}
          <a href="mailto:support@mossy-creations.com">
            support@mossy-creations.com
          </a>
        </h3>
      </div>
    );
  }

  if (!state.cart || (state.cart.length === 0 && !buyNow)) {
    return (
      <div>
        <h3 style={{ textAlign: "center" }}>
          Your cart is currently empty! You will be redirected to the homepage
          in 5 seconds.
        </h3>
      </div>
    );
  }

  const options = {
    fetchClientSecret,
  };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default CheckoutForm;
