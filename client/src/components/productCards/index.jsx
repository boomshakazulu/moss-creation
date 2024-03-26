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
      <Row
        xs={1}
        sm={2}
        md={3}
        lg={3}
        xl={4}
        xxl={6}
        className="g-4 row-max-width"
      >
        {items.products.map((product) => (
          <Col key={product._id} className="mb-4">
            <Card className="h-100">
              <Link to={getProductLink(product)} className="card-link">
                <div className="card-image-container">
                  <Card.Img
                    variant="top"
                    src={product.photo[0]}
                    className="card-image"
                  />
                </div>
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>Price: ${product.price}</Card.Text>
                </Card.Body>
              </Link>
              {currentPage !== "admin" && (
                <Card.Footer>
                  <Button variant="primary" className="w-100">
                    Add to Cart
                  </Button>
                </Card.Footer>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default productCards;
