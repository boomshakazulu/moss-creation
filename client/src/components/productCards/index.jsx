import React, { useState } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useStoreContext } from "../../utils/GlobalState";
import { ADD_TO_CART, UPDATE_CART_QUANTITY } from "../../utils/actions";
import { idbPromise } from "../../utils/helpers";
import StarRating from "../starRating/index";
import "./index.css";

const productCards = (item) => {
  const [state, dispatch] = useStoreContext();
  const {
    photo,
    name,
    _id,
    price,
    stock,
    currentPage,
    priceId,
    averageRating,
    totalRatings,
  } = item;

  const { cart } = state;
  const getProductLink = (item) => {
    if (item.currentPage === "admin") {
      return `/admin/${item._id}`;
    } else {
      return `/item/${item._id}`;
    }
  };

  const addToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === _id);
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
        product: { ...item, purchaseQuantity: 1 },
      });
      idbPromise("cart", "put", { ...item, purchaseQuantity: 1 });
    }
  };

  return (
    <Col xs={6} sm={6} md={4} lg={4} xl={3} xxl={2}>
      <Card className="h-100">
        <Link to={getProductLink(item)} className="card-link">
          <div className="card-image-container">
            <Card.Img variant="top" src={photo[0]} className="card-image" />
          </div>
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            {totalRatings > 0 && (
              <div className="prod-card-rating">
                <StarRating averageRating={averageRating || 5} />({totalRatings}
                )
              </div>
            )}
            <Card.Text>${price}</Card.Text>
          </Card.Body>
        </Link>
        {currentPage !== "admin" && (
          <Card.Footer>
            {stock > 0 ? (
              <Button variant="primary" className="w-100" onClick={addToCart}>
                Add to Cart
              </Button>
            ) : (
              <div className="out-of-stock">Out of Stock</div>
            )}
          </Card.Footer>
        )}
      </Card>
    </Col>
  );
};

export default productCards;
