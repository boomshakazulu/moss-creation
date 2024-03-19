import React, { useState, useEffect } from "react";
import Carousel from "../components/carousel/index.jsx";
import ProductCards from "../components/productCards/index.jsx";
import { QUERY_ALL_PRODUCTS } from "../utils/queries.js";
import { useQuery } from "@apollo/client";

const Home = () => {
  const { loading, error, data } = useQuery(QUERY_ALL_PRODUCTS);
  const [items, setItems] = useState([]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log(data);

  const productsWithCarousel = data.products.filter(
    (product) => product.carousel
  );

  console.log(data, productsWithCarousel);

  return (
    <div>
      <section>
        <Carousel items={productsWithCarousel} />
      </section>
      <ProductCards items={data} currentPage="home" />
    </div>
  );
};

export default Home;
