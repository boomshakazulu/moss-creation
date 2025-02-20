import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCards from "../components/productCards";
import { QUERY_ALL_PRODUCTS } from "../utils/queries.js";
import Auth from "../utils/auth.js";
import { useQuery } from "@apollo/client";
import { Card, Button, Row, Col } from "react-bootstrap";
import Pagination from "../components/pagination/index.jsx";
import "./admin.css";
import { getTypenameFromResult } from "@apollo/client/utilities";

function Admin() {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(QUERY_ALL_PRODUCTS);
  const [currentPageActive, setCurrentPageActive] = useState(1);
  const [currentPageInactive, setCurrentPageInactive] = useState(1);
  const [isActiveOpen, setIsActiveOpen] = useState(true);
  const [isInactiveOpen, setIsInactiveOpen] = useState(false);

  useEffect(() => {
    if (!Auth.isAdmin()) {
      navigate("/");
    }
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const activeProducts = data.products.filter(
    (product) => product.active === true
  );
  const inactiveProducts = data.products.filter(
    (product) => product.active === false
  );

  //toggle visibility of active products
  const toggleActive = () => {
    setIsActiveOpen(!isActiveOpen);
  };

  //toggles inactive visibility
  const toggleInactive = () => {
    setIsInactiveOpen(!isInactiveOpen);
  };

  //handles pagination for products.
  const productsPerPage = 8;

  const totalPagesActive = Math.ceil(activeProducts.length / productsPerPage);
  const totalPagesInactive = Math.ceil(
    inactiveProducts.length / productsPerPage
  );

  const startIndexActive = (currentPageActive - 1) * productsPerPage;
  const startIndexInactive = (currentPageInactive - 1) * productsPerPage;
  const currentActive = activeProducts.slice(
    startIndexActive,
    startIndexActive + productsPerPage
  );
  const currentInactive = inactiveProducts.slice(
    startIndexInactive,
    startIndexInactive + productsPerPage
  );

  const handlePageChangeActive = (page) => {
    const scrollLocation = document.getElementById("active-products");
    setCurrentPageActive(page);
    if (scrollLocation) {
      scrollLocation.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePageChangeInactive = (page) => {
    const scrollLocation = document.getElementById("inactive-products");
    setCurrentPageInactive(page);
    if (scrollLocation) {
      scrollLocation.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="admin-container">
      <div className="add-product-button">
        <Link to="/admin/add" className="btn btn-primary addbtn adminbtn">
          <span className="plus-sign">+</span> Add Product
        </Link>
        <Link to="/admin/orders" className="btn btn-primary orderbtn adminbtn">
          View Orders
        </Link>
      </div>
      <h2 className="text-center edit-text">Select a Product to edit</h2>
      <h2
        id="active-products"
        onClick={toggleActive}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          marginBottom: "50px",
          marginTop: "30px",
          paddingLeft: "25px",
          color: "#72b787",
        }}
      >
        <span>Active Products</span>
        <span style={{ marginLeft: "10px", transition: "transform 0.3s" }}>
          {isActiveOpen ? "▲" : "▼"} {/* Arrow changes direction */}
        </span>
      </h2>
      {isActiveOpen && (
        <Row className="g-4 row-max-width admin-prod-container">
          {currentActive.map((product) => (
            <ProductCards
              key={product._id}
              _id={product._id}
              photo={product.photo}
              name={product.name}
              price={product.price}
              stock={product.stock}
              currentPage="admin"
            />
          ))}
          <Pagination
            totalPages={totalPagesActive}
            currentPage={currentPageActive}
            onPageChange={handlePageChangeActive}
          />
        </Row>
      )}
      <h2
        id="inactive-products"
        onClick={toggleInactive}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          marginBottom: "30px",
          paddingLeft: "25px",
          color: "#72b787",
        }}
      >
        <span>Inactive Products</span>
        <span style={{ marginLeft: "10px", transition: "transform 0.3s" }}>
          {isInactiveOpen ? "▲" : "▼"} {/* Arrow changes direction */}
        </span>
      </h2>
      {isInactiveOpen && (
        <Row className="g-4 row-max-width admin-prod-container">
          {currentInactive.map((product) => (
            <ProductCards
              key={product._id}
              _id={product._id}
              photo={product.photo}
              name={product.name}
              price={product.price}
              stock={product.stock}
              currentPage="admin"
            />
          ))}
          <Pagination
            totalPages={totalPagesInactive}
            currentPage={currentPageInactive}
            onPageChange={handlePageChangeInactive}
          />
        </Row>
      )}
    </div>
  );
}

export default Admin;
