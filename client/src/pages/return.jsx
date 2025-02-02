import React, { useCallback, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useStoreContext } from "../utils/GlobalState"; // Import useStoreContext
import { UPDATE_STOCK } from "../utils/mutations";
import { useMutation } from "@apollo/client";
import { CLEAR_CART } from "../utils/actions";
import "./return.css";

const Return = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [state, dispatch] = useStoreContext(); // Initialize state using useStoreContext
  const [updateStock] = useMutation(UPDATE_STOCK);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  const isValidId = (value) => {
    // Check if the value is a non-empty string
    return typeof value === "string" && value.trim() !== "";
  };

  // Function to validate if a value is a valid integer
  const isValidInteger = (value) => {
    // Check if the value is an integer
    return Number.isInteger(value);
  };

  const MAX_RETRIES = 3;
  const INITIAL_DELAY = 1000;

  //attempts to fetch and refetch session status on failure to prevent false negatives
  const fetchSessionStatus = (
    sessionId,
    attempt = 1,
    delay = INITIAL_DELAY
  ) => {
    if (!sessionId) {
      setStatus("failed");
      return;
    }

    fetch(
      `${
        import.meta.env.VITE_API_SERVER_URL
      }/session-status?session_id=${sessionId}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server responded with status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      })
      .catch((err) => {
        if (attempt < MAX_RETRIES) {
          setTimeout(
            () => fetchSessionStatus(sessionId, attempt + 1, delay * 2),
            delay
          );
        } else {
          setStatus("failed");
        }
      });
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    fetchSessionStatus(sessionId);
  }, []);

  useEffect(() => {
    if (state.cart && state.cart.length > 0) {
      setIsCartLoaded(true);
    }
  }, [state.cart]);

  const updateStockAsync = async () => {
    if (state.cart) {
      try {
        for (const cart of state.cart) {
          // Validate that cart._id is a valid ID and cart.purchaseQuantity is a valid integer
          if (isValidId(cart._id) && isValidInteger(cart.purchaseQuantity)) {
            await updateStock({
              variables: {
                itemId: cart._id,
                quantity: cart.purchaseQuantity,
              },
            });
          }
        }

        // Dispatch the CLEAR_CART action after processing the cart
        dispatch({ type: CLEAR_CART });
      } catch (error) {
        // Handle error if needed
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (status === "complete") {
      updateStockAsync();
    }
  }, [status]);

  if (status === "open") {
    return <Navigate to="/checkout" />;
  }

  if (status === "failed") {
    return (
      <section id="failed">
        <p>
          We appreciate you for visiting us. <br />
          Unfortunately there was an issue with your payment method and we are
          unable to process your order order at this time. <br />
          Please try another method of payment or try again later <br />
          Thank you!
        </p>
      </section>
    );
  }

  if (status === "complete") {
    return (
      <section id="success">
        <p>
          We appreciate your business! <br />
          <br />A confirmation email will be sent to {customerEmail}. <br />{" "}
          <br />
          If you have any questions, please email{" "}
          <a href="mailto:support@mossy-creations.com" className="return-email">
            support@mossy-creations.com
          </a>
          .
        </p>
      </section>
    );
  }
};

export default Return;
