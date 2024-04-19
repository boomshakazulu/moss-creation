import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useStoreContext } from "../utils/GlobalState";
import { UPDATE_STOCK } from "../utils/mutations";
import { useMutation } from "@apollo/client";

const Success = () => {
  const [updateStock] = useMutation(UPDATE_STOCK);
  const [state] = useStoreContext();
  const location = useLocation();
  const { email } = location.state;

  console.log(state.cart);

  useEffect(() => {
    if (state.cart) {
      state.cart.forEach((cart) => {
        updateStock({
          variables: {
            itemId: cart._id,
            stock: cart.purchaseQuantity,
          },
        })
          .then((response) => {
            // Handle response if needed
            console.log(response);
          })
          .catch((error) => {
            // Handle error if needed
            console.error(error);
          });
      });
    }
  }, [state.cart, updateStock]);

  return (
    <section id="success">
      <p>
        We appreciate your business! A confirmation email will be sent to{" "}
        {email}. If you have any questions, please email{" "}
        <a href="mailto:orders@example.com">orders@example.com</a>.
      </p>
    </section>
  );
};

export default Success;
