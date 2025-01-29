import React, { useState, useEffect } from "react";
import Carousel from "../components/carousel/index.jsx";
import { Card, Button, Row, Col } from "react-bootstrap";
import ProductCards from "../components/productCards/index.jsx";
import { QUERY_ALL_PRODUCTS } from "../utils/queries.js";
import { useQuery } from "@apollo/client";
import { useStoreContext } from "../utils/GlobalState";

const Home = () => {
  const [state, dispatch] = useStoreContext();
  const { loading, error, data } = useQuery(QUERY_ALL_PRODUCTS);

  useEffect(() => {
    if (loading) return;

    if (data?.products?.length && state.cart.length > 0) {
      // Ensure updatedCart is an array
      const updatedCart = Array.isArray(state.cart) ? state.cart : [state.cart];

      const finalUpdatedCart = updatedCart
        .map((cartItem) => {
          const latestProduct = data.products.find(
            (prod) => prod._id === cartItem._id
          );

          if (!latestProduct || data.products.stock === 0) {
            return null;
          }

          return {
            ...cartItem,
            averageRating: latestProduct.averageRating,
            name: latestProduct.name,
            price: latestProduct.price,
            priceId: latestProduct.priceId,
            stock: latestProduct.stock,
            stripeProductId: latestProduct.stripeProductId,
            purchaseQuantity: cartItem.purchaseQuantity,
          };
        })
        .filter((cartItem) => cartItem !== null);

      // Dispatch an action to update the cart in state
      dispatch({
        type: "VERIFY_CART_ITEMS",
        payload: finalUpdatedCart,
      });
      // Mark as complete
    }
  }, [data]);

  if (loading || !data) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const productsWithCarousel = data.products.filter(
    (product) => product.carousel
  );

  const productsInStock = data.products
    .filter((product) => product.stock > 0)
    .sort((a, b) => b.averageRating - a.averageRating);
  const productsOutOfStock = data.products
    .filter((product) => product.stock <= 0)
    .sort((a, b) => b.averageRating - a.averageRating);

  return (
    <div className="product-div">
      <section>
        <Carousel items={productsWithCarousel} isHomePage />
      </section>
      <section className="product-cards">
        <Row className="g-4 row-max-width">
          {productsInStock.map((product) => (
            <ProductCards
              key={product._id}
              _id={product._id}
              photo={product.photo}
              name={product.name}
              price={product.price}
              priceId={product.priceId}
              stripeProductId={product.stripeProductId}
              stock={product.stock}
              averageRating={product.averageRating}
              totalRatings={product.totalRatings}
              currentPage="home"
            />
          ))}
          {productsOutOfStock.map((product) => (
            <ProductCards
              key={product._id}
              _id={product._id}
              photo={product.photo}
              name={product.name}
              price={product.price}
              priceId={product.priceId}
              stripeProductId={product.stripeProductId}
              stock={product.stock}
              averageRating={product.averageRating}
              totalRatings={product.totalRatings}
              currentPage="home"
            />
          ))}
        </Row>
      </section>
    </div>
  );
};

export default Home;
