import React, { useState, useEffect } from "react";
import OrderCards from "../components/orderCards/index";
import { QUERY_ORDERS } from "../utils/queries.js";
import Auth from "../utils/auth.js";
import { useQuery } from "@apollo/client";

function AdminOrders() {
  const { loading, error, data } = useQuery(QUERY_ORDERS);

  useEffect(() => {
    if (!Auth.isAdmin()) {
      navigate("/");
    }
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const fulfilledOrders = data.orders.filter((order) => order.fulfilled);
  const unfulfilledOrders = data.orders.filter((order) => !order.fulfilled);

  return (
    <div>
      <section className="unfulfilled">
        <h2>Unfulfilled Orders</h2>
        {unfulfilledOrders.map((order) => (
          <OrderCards key={order._id} order={order} />
        ))}
      </section>
      <section className="fulfilled">
        <h2>Fulfilled Orders</h2>
        {fulfilledOrders.map((order) => (
          <OrderCards key={order._id} order={order} />
        ))}
      </section>
    </div>
  );
}

export default AdminOrders;
