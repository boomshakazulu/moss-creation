import React, { useCallback, useState, useEffect } from "react";
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

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    fetch(`http://localhost:3001/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, []);

  useEffect(() => {
    if (state.cart && state.cart.length > 0) {
      setIsCartLoaded(true);
    }
  }, [state.cart]);

  useEffect(() => {
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

    updateStockAsync();
  }, [isCartLoaded]);

  if (status === "open") {
    return <Navigate to="/checkout" />;
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
