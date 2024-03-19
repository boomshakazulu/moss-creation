import React, { useState } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./index.css";

const productCards = ({ items, currentPage }) => {
  const getProductLink = (product) => {
    if (currentPage === "admin") {
      return `/admin/${product._id}`;
    } else {
      return `/item/${product._id}`;
    }
  };

  return (
    <section className="product-cards">
      <Row xs={2} md={3} lg={4} xl={5} className="g-4 row-max-width">
        {items.products.map((product) => (
          <Col key={product._id} className="mb-4 d-flex col-no-padding">
            <Card className="h-100 w-100">
              <Link to={getProductLink(product)} className="card-link">
                <Card.Img
                  variant="top"
                  src={product.photo[0]}
                  className="card-image"
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>Price: ${product.price}</Card.Text>
                </Card.Body>
              </Link>
              <Button variant="primary" className="mt-auto">
                Add to Cart
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default productCards;
