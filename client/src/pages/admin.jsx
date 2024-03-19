import React from "react";
import { Link } from "react-router-dom";
import ProductCards from "../components/productCards";
import { QUERY_ALL_PRODUCTS } from "../utils/queries.js";
import { useQuery } from "@apollo/client";
import "./admin.css";

function Admin() {
  const { loading, error, data } = useQuery(QUERY_ALL_PRODUCTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div className="add-product-button">
        <Link to="/admin/add" className="btn btn-primary addbtn">
          <span className="plus-sign">+</span> Add Product
        </Link>
      </div>
      <ProductCards items={data} currentPage="admin" />
    </div>
  );
}

export default Admin;
