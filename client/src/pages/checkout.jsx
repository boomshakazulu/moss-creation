import React, { useCallback, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useStoreContext } from "../utils/GlobalState";
import { useNavigate } from "react-router-dom";
import Auth from "../utils/auth";
import { useMutation } from "@apollo/client";
import { CLEAR_CART } from "../utils/actions";
import { UPDATE_STOCK } from "../utils/mutations";

const stripePromise = loadStripe(
  "pk_test_51OepiODs30DMhvSh8ixbeX0chGCZQ4Mkkr2xgdlOyvIR4yJLyJW0TBdYcCpZ22yrnvBv0seEoO4YDdwtV3864sBf00TM8vwKgQ"
);

const CheckoutForm = () => {
  const [state, dispatch] = useStoreContext();
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();
  const decodedToken = Auth.getProfile();
  const userId = decodedToken ? decodedToken.data.id : null;
  const [updateStock] = useMutation(UPDATE_STOCK);

  const handleComplete = () => setIsComplete(true);

  const fetchClientSecret = useCallback(async () => {
    try {
      const cartItems = state.cart.map((item) => ({
        price: item.priceId,
        quantity: item.purchaseQuantity,
      }));

      const productIds = state.cart.map((item) => ({
        productId: item._id,
        quantity: item.purchaseQuantity,
        price: item.price,
      }));

      console.log(state.cart, productIds);

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
              allowed_countries: ["US"], // Specify the countries you want to allow shipping to
            },
            metadata: {
              products: JSON.stringify(productIds),
              userId: userId,
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
      console.error("Error fetching client secret:", error);
      throw error;
    }
  }, [state.cart, userId]);

  useEffect(() => {
    // Fetch client secret only after initial state is set
    if (state.cart.length > 0) {
      fetchClientSecret().then(() => {
        setInitialFetchComplete(true);
      });
    }
  }, [fetchClientSecret, state.cart]);

  useEffect(() => {
    if (isComplete) {
      state.cart.forEach((cart) => {
        updateStock({
          variables: {
            itemId: cart._id,
            stock: cart.purchaseQuantity,
          },
        })
          .then((response) => {
            // Handle response if needed
            dispatch({ type: CLEAR_CART });
            console.log(response).then(() => {
              navigate("/success");
            });
          })
          .catch((error) => {
            // Handle error if needed
            console.error(error);
          });
      });
    }
  }, [isComplete, state.cart, updateStock, dispatch, navigate]);

  const options = {
    fetchClientSecret,
    onComplete: handleComplete,
  };

  if (!Auth.loggedIn() && initialFetchComplete) {
    setTimeout(() => {
      navigate("/signup"); // Redirect to the homepage
    }, 5000);

    return (
      <div>
        <h3 style={{ textAlign: "center" }}>
          Please Create an account to checkout.
          <br></br>
          <br></br>you will be redirected to the signup page in 5 seconds
        </h3>
      </div>
    );
  }
  if (!state.cart || (state.cart.length === 0 && initialFetchComplete)) {
    setTimeout(() => {
      navigate("/"); // Redirect to the homepage
    }, 5000);

    return (
      <div>
        <h3 style={{ textAlign: "center" }}>
          Your cart is currently empty! You will be redirected to the homepage
          in 5 seconds
        </h3>
      </div>
    );
  }

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
