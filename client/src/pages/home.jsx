import React, { useState, useEffect } from "react";
import Carousel from "../components/carousel/index.jsx";
import { Card, Button, Row, Col } from "react-bootstrap";
import ProductCards from "../components/productCards/index.jsx";
import { QUERY_ALL_PRODUCTS } from "../utils/queries.js";
import { useQuery } from "@apollo/client";

const Home = () => {
  const { loading, error, data } = useQuery(QUERY_ALL_PRODUCTS);
  const [items, setItems] = useState([]);

  if (loading) return <p>Loading...</p>;
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
