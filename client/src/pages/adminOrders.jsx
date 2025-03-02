import React, { useState, useEffect } from "react";
import OrderCards from "../components/orderCards/index";
import { QUERY_ORDERS } from "../utils/queries.js";
import Auth from "../utils/auth.js";
import Pagination from "../components/pagination/index.jsx";
import { useQuery } from "@apollo/client";

const AdminOrders = () => {
  const { loading, error, data } = useQuery(QUERY_ORDERS);
  const [isFulfilledOpen, setIsFulfilledOpen] = useState(false);
  const [currentPageFulfilled, setCurrentPageFulfilled] = useState(1);
  const [currentPageUnfulfilled, setCurrentPageUnfulfilled] = useState(1);
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

  //handles pagination for order history.
  const ordersPerPage = 2;

  const totalPagesUnfulfilled = Math.ceil(
    unfulfilledOrders.length / ordersPerPage
  );
  const totalPagesFulfilled = Math.ceil(fulfilledOrders.length / ordersPerPage);

  const startIndexUnfulfilled = (currentPageUnfulfilled - 1) * ordersPerPage;
  const startIndexFulfilled = (currentPageFulfilled - 1) * ordersPerPage;
  const currentUnfulfilledOrders = unfulfilledOrders.slice(
    startIndexUnfulfilled,
    startIndexUnfulfilled + ordersPerPage
  );
  const currentFulfilledOrders = fulfilledOrders.slice(
    startIndexFulfilled,
    startIndexFulfilled + ordersPerPage
  );

  //handles page change to scroll to top
  const handlePageChangeUnfulfilled = (page) => {
    const scrollLocation = document.getElementById("unfulfilled");
    setCurrentPageUnfulfilled(page);
    if (scrollLocation) {
      scrollLocation.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePageChangeFulfilled = (page) => {
    const scrollLocation = document.getElementById("fulfilled");
    setCurrentPageFulfilled(page);
    if (scrollLocation) {
      scrollLocation.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div>
      {/* Unfulfilled Orders Section */}
      <div className="order-section">
        <h2
          id="unfulfilled"
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
            {currentUnfulfilledOrders.map((order) => (
              <OrderCards key={order._id} order={order} />
            ))}
            {/* Pagination Controls */}
            <Pagination
              totalPages={totalPagesUnfulfilled}
              currentPage={currentPageUnfulfilled}
              onPageChange={handlePageChangeUnfulfilled}
            />
          </section>
        )}
      </div>

      {/* Fulfilled Orders Section */}
      <div className="order-section">
        <h2
          id="fulfilled"
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
            {currentFulfilledOrders.map((order) => (
              <OrderCards key={order._id} order={order} />
            ))}
            {/* Pagination Controls */}
            <Pagination
              totalPages={totalPagesFulfilled}
              currentPage={currentPageFulfilled}
              onPageChange={handlePageChangeFulfilled}
            />
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
