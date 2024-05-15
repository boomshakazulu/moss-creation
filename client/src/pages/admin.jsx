import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCards from "../components/productCards";
import { QUERY_ALL_PRODUCTS } from "../utils/queries.js";
import Auth from "../utils/auth.js";
import { useQuery } from "@apollo/client";
import { Card, Button, Row, Col } from "react-bootstrap";
import "./admin.css";

function Admin() {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(QUERY_ALL_PRODUCTS);

  useEffect(() => {
    if (!Auth.isAdmin()) {
      navigate("/");
    }
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

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
      <Row className="g-4 row-max-width admin-prod-container">
        {data.products.map((product) => (
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
      </Row>
    </div>
  );
}

export default Admin;
