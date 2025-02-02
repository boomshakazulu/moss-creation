import React, { useCallback, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useStoreContext } from "../utils/GlobalState";
import { useNavigate, useLocation } from "react-router-dom";
import Auth from "../utils/auth";
import { QUERY_ALL_PRODUCTS } from "../utils/queries.js";
import { useQuery } from "@apollo/client";

const stripePromise = loadStripe(import.meta.env.VITE_API_STRIPEPROMISE);

const CheckoutForm = () => {
  const [state, dispatch] = useStoreContext();
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [cartVerified, setCartVerified] = useState(false);
  const location = useLocation();
  const { loading, error, data } = useQuery(QUERY_ALL_PRODUCTS, {
    fetchPolicy: "network-only",
  });
  const { buyNow } = location.state || {};

  const redirectOnError = (location) => {
    if (!Auth.loggedIn() || errorMessage) {
      const redirectTimer = setTimeout(() => {
        navigate(location);
      }, 5000);
      return () => clearTimeout(redirectTimer);
    }
  };

  useEffect(() => {
    if (loading) return;

    if (data?.products?.length && state.cart.length > 0) {
      // Ensure updatedCart is an array
      const updatedCart = Array.isArray(state.cart) ? state.cart : [state.cart];

      const finalUpdatedCart = updatedCart
        .map((cartItem) => {
          const latestProduct = data.products.find(
            (prod) => prod._id === cartItem._id
          );

          if (!latestProduct || data.products.stock === 0) {
            return null;
          }

          return {
            ...cartItem,
            averageRating: latestProduct.averageRating,
            name: latestProduct.name,
            price: latestProduct.price,
            priceId: latestProduct.priceId,
            stock: latestProduct.stock,
            stripeProductId: latestProduct.stripeProductId,
            purchaseQuantity: cartItem.purchaseQuantity,
          };
        })
        .filter((cartItem) => cartItem !== null);

      // Dispatch an action to update the cart in state
      dispatch({
        type: "VERIFY_CART_ITEMS",
        payload: finalUpdatedCart,
      });
    }
    setCartVerified(true);
    setInitialFetchComplete(true);
  }, [data]);

  const fetchClientSecret = useCallback(async () => {
    if (!initialFetchComplete) return;
    if (
      !state.cart ||
      (state.cart.length === 0 && initialFetchComplete && !buyNow)
    ) {
      throw new Error("Cart is empty");
    }
    const user = Auth.getProfile();
    // Ensure state.cart is always treated as an array
    const cartItems = Array.isArray(state.cart) ? state.cart : [state.cart];

    const items = buyNow
      ? [{ price: buyNow.product.priceId, quantity: 1 }]
      : cartItems.map((item) => ({
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
      : cartItems.map((item) => ({
          productId: item._id,
          quantity: item.purchaseQuantity,
          price: item.price,
        }));

    try {
      const response = await fetch(import.meta.env.VITE_API_CHECKOUT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          line_items: items,
          shipping_address_collection: {
            allowed_countries: ["US", "CA"],
          },
          metadata: {
            products: JSON.stringify(productIds),
            customerEmail: user.data.email,
            userId: user.data.id,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch client secret");
      }

      const result = await response.json();
      return result.clientSecret;
    } catch (error) {
      console.error("Error in fetchClientSecret:", error);
      throw error;
    }
  }, [initialFetchComplete, buyNow]);

  useEffect(() => {
    if (initialFetchComplete) {
      const fetchDecodedToken = async () => {
        try {
          const decodedToken = Auth.getProfile();
          const userId = decodedToken ? decodedToken.data.id : null;

          if ((userId && state.cart.length > 0) || (userId && buyNow)) {
            const secret = await fetchClientSecret(state.cart);
            setClientSecret(secret);
          } else {
            setErrorMessage("There was an issue with your cart on checkout");
          }
        } catch (error) {
          setErrorMessage("There was an issue with your cart on checkout.");
        }
      };

      fetchDecodedToken();
    }
  }, [initialFetchComplete, buyNow]);

  useEffect(() => {
    if (!Auth.loggedIn()) {
      redirectOnError("/login");
    }
    if (initialFetchComplete && !state.cart) {
      redirectOnError("/");
    }
  }, []);

  if (!Auth.loggedIn()) {
    return (
      <div>
        <h3 style={{ textAlign: "center" }}>
          Please create an account to checkout. You will be redirected to the
          signup page in 5 seconds.
        </h3>
      </div>
    );
  }

  if (!initialFetchComplete || loading) {
    return <div>Loading...</div>;
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

  if (errorMessage) {
    return (
      <div>
        <h2>Error:</h2>
        <h3>
          {errorMessage} Please try again later or contact us at{" "}
          <a href="mailto:support@mossy-creations.com">
            support@mossy-creations.com
          </a>
        </h3>
      </div>
    );
  }

  return (
    <div id="checkout">
      {/* Now conditionally render loading and error states inside JSX */}
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default CheckoutForm;
