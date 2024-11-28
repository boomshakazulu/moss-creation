import React, { useState, useEffect } from "react";
import OrderCards from "../components/orderCards/index";
import { QUERY_ORDERS } from "../utils/queries.js";
import Auth from "../utils/auth.js";
import { useQuery } from "@apollo/client";

function AdminOrders() {
  const { loading, error, data } = useQuery(QUERY_ORDERS);
  const [isFulfilledOpen, setIsFulfilledOpen] = useState(false);
  const [isUnfulfilledOpen, setIsUnfulfilledOpen] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (!Auth.isAdmin()) {
      navigate("/");
    }
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  //sorts fulfilled and unfulfilled orders
  const fulfilledOrders = data.orders.filter((order) => order.fulfilled);
  const unfulfilledOrders = data.orders.filter((order) => !order.fulfilled);

  // Toggle the visibility of fulfilled orders
  const toggleFulfilled = () => {
    setIsFulfilledOpen(!isFulfilledOpen);
  };

  // Toggle the visibility of unfulfilled orders
  const toggleUnfulfilled = () => {
    setIsUnfulfilledOpen(!isUnfulfilledOpen);
  };

  return (
    <div>
      {/* Unfulfilled Orders Section */}
      <div className="order-section">
        <h2
          onClick={toggleUnfulfilled}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <span>Unfulfilled Orders</span>
          <span style={{ marginLeft: "10px", transition: "transform 0.3s" }}>
            {isUnfulfilledOpen ? "▲" : "▼"} {/* Arrow changes direction */}
          </span>
        </h2>
        {isUnfulfilledOpen && (
          <section className="unfulfilled">
            {unfulfilledOrders.map((order) => (
              <OrderCards key={order._id} order={order} />
            ))}
          </section>
        )}
      </div>

      {/* Fulfilled Orders Section */}
      <div className="order-section">
        <h2
          onClick={toggleFulfilled}
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <span>Fulfilled Orders</span>
          <span style={{ marginLeft: "10px", transition: "transform 0.3s" }}>
            {isFulfilledOpen ? "▲" : "▼"} {/* Arrow changes direction */}
          </span>
        </h2>
        {isFulfilledOpen && (
          <section className="fulfilled">
            {fulfilledOrders.map((order) => (
              <OrderCards key={order._id} order={order} />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
