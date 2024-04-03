import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCards from "../components/productCards";
import { QUERY_ALL_PRODUCTS } from "../utils/queries.js";
import Auth from "../utils/auth.js";
import { useQuery } from "@apollo/client";
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
    <div>
      <div className="add-product-button">
        <Link to="/admin/add" className="btn btn-primary addbtn">
          <span className="plus-sign">+</span> Add Product
        </Link>
      </div>
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
    </div>
  );
}

export default Admin;
