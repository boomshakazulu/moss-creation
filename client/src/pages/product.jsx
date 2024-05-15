import React, { useState, useEffect } from "react";
import { QUERY_PRODUCT } from "../utils/queries";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import Carousel from "../components/carousel/index.jsx";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useStoreContext } from "../utils/GlobalState.jsx";
import { ADD_TO_CART, UPDATE_CART_QUANTITY } from "../utils/actions";
import { idbPromise } from "../utils/helpers";
import "./product.css";

function Product() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [state, dispatch] = useStoreContext();
  const { loading, error, data } = useQuery(QUERY_PRODUCT, {
    variables: { itemId },
  });
  const { cart } = state;

  // Show loading indicator while data is being fetched
  if (loading) return <p>Loading...</p>;

  // Show error message if there's an error fetching data
  if (error) return <p>Error: {error.message}</p>;

  console.log(data);

  const addToCart = () => {
    const itemInCart = cart.find(
      (cartItem) => cartItem._id === data.product._id
    );
    if (itemInCart) {
      const newQuantity = parseInt(itemInCart.purchaseQuantity) + 1;
      if (newQuantity <= itemInCart.stock) {
        dispatch({
          type: UPDATE_CART_QUANTITY,
          _id: _id,
          purchaseQuantity: newQuantity,
        });
        idbPromise("cart", "put", {
          ...itemInCart,
          purchaseQuantity: newQuantity,
        });
      } else {
        console.log("Cannot add more than available stock");
      }
    } else {
      dispatch({
        type: ADD_TO_CART,
        product: { ...data.product, purchaseQuantity: 1 },
      });
      idbPromise("cart", "put", { ...data.product, purchaseQuantity: 1 });
    }
  };

  const buyNow = () => {
    addToCart();
    navigate("/checkout");
  };

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
            <h2 className="product-price">${data.product.price}</h2>
            <p className="product-stock">
              {data.product.stock > 0
                ? `${data.product.stock} In Stock`
                : "Out of Stock"}
            </p>
          </div>
          <Row>
            <div className="product-btn-container">
              <Button
                variant="success"
                className="product-btn-atc"
                onClick={addToCart}
              >
                Add to Cart
              </Button>{" "}
              <Button
                variant="success"
                className="product-btn-buyNow"
                onClick={buyNow}
              >
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
