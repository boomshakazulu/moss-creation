import React, { useState, useEffect } from "react";
import { QUERY_PRODUCT } from "../utils/queries";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import Carousel from "../components/carousel/index.jsx";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./product.css";

function Product() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(QUERY_PRODUCT, {
    variables: { itemId },
  });

  // Show loading indicator while data is being fetched
  if (loading) return <p>Loading...</p>;

  // Show error message if there's an error fetching data
  if (error) return <p>Error: {error.message}</p>;

  console.log(data);

  return (
    <Container className="product-section">
      <h1 className="product-title">{data.product.name}</h1>
      <Row>
        <Col xs={12} md={6} className="carousel-column">
          <div className="carousel-container">
            <Carousel items={data.product} />
          </div>
        </Col>
        <Col className="info-col">
          <div className="product-info-container">
            <p
              className="product-description"
              dangerouslySetInnerHTML={{ __html: data.product.description }}
            ></p>
            <p className="product-stock">
              {data.product.stock > 0 ? "In Stock" : "Out of Stock"}
            </p>
            <h2 className="product-price">{data.product.price}</h2>
          </div>
          <Row>
            <div className="product-btn-container">
              <Button variant="primary" className="produce-btn-atc">
                Add to Cart
              </Button>{" "}
              <Button variant="success" className="product-btn-buyNow">
                Buy Now
              </Button>
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Product;
