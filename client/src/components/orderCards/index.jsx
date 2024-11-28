import React, { useState } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { COMPLETE_ORDER } from "../../utils/mutations";

import "./style.css";
import Product from "../../pages/product";

const OrderCards = ({ order }) => {
  const [orderData, setOrderData] = useState(order);
  const [completeOrder, { error }] = useMutation(COMPLETE_ORDER);
  const [errorMessage, setErrorMessage] = useState(null);

  console.log(orderData.purchaseDate);

  const handleCarrierChange = (e) => {
    setOrderData((prevOrder) => ({
      ...prevOrder,
      carrier: e.target.value,
    }));
  };

  const handleTrackingNumberChange = (e) => {
    if (!orderData.fulfilled) {
      setOrderData((prevOrder) => ({
        ...prevOrder,
        trackingNum: e.target.value,
      }));
    }
  };

  const handleFulfilledChange = () => {
    setOrderData((prevOrder) => ({
      ...prevOrder,
      fulfilled: !prevOrder.fulfilled,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await completeOrder({
        variables: {
          orderId: orderData._id,
          carrier: orderData.carrier ? orderData.carrier : "UPS",
          trackingNum: orderData.trackingNum,
          fulfilled: orderData.fulfilled,
          email: orderData.email,
        },
      });
    } catch (err) {
      setErrorMessage("Error completing order " + err);
    }
  };

  return (
    <Container className="order-card mb-3">
      <Form onSubmit={handleSubmit}>
        <h5 className="mt-4">
          {orderData.purchaseDate
            ? new Date(Number(orderData.purchaseDate)).toLocaleString()
            : "Invalid date"}
        </h5>
        <Form.Group as={Row} className="order-card-row py-2">
          <Form.Label column sm={4} className="order-hist-label">
            Email:
          </Form.Label>
          <Col sm={8} className="order-hist-info">
            <Form.Control plaintext readOnly defaultValue={orderData.email} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="order-card-row py-2">
          <Form.Label column sm={4} className="order-hist-label">
            Products:
          </Form.Label>
          <Col sm={8} className="order-hist-info">
            <ul className="list-unstyled mb-0 order-card-list">
              {orderData.products.map((product, index) => (
                <li key={index}>
                  {product.product.name}({product.quantity})
                </li>
              ))}
            </ul>
          </Col>
        </Form.Group>

        {/* <Form.Group as={Row} className="order-card-row py-2">
          <Form.Label column sm={4} className="order-hist-label">
            Stripe Payment Intent ID:
          </Form.Label>
          <Col sm={8} className="order-hist-info">
            <Form.Control
              plaintext
              readOnly
              defaultValue={orderData.stripePaymentIntentId}
            />
          </Col>
        </Form.Group> */}

        {/* <h5 className="mt-4">Shipping Information</h5> */}

        <Form.Group as={Row} className="order-card-row py-2">
          <Form.Label column sm={4} className="order-hist-label">
            Customer Name:
          </Form.Label>
          <Col sm={8} className="order-hist-info">
            <Form.Control
              plaintext
              readOnly
              defaultValue={orderData.customerName}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="order-card-row py-2">
          <Form.Label column sm={4} className="order-hist-label">
            Address:
          </Form.Label>
          <Col sm={8} className="order-hist-info">
            {/* Wrap defaultValue in a div and apply style */}
            <div style={{ whiteSpace: "pre-line" }}>{orderData.address}</div>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="order-card-row py-2">
          <Form.Label column sm={4} className="order-hist-label">
            Amount Paid:
          </Form.Label>
          <Col sm={8} className="order-hist-info">
            <Form.Control
              plaintext
              readOnly
              defaultValue={`$${orderData.price}`}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="order-card-row py-2">
          <Form.Label column sm={4} className="order-hist-label">
            Carrier:
          </Form.Label>
          <Col sm={8} className="order-hist-info">
            <Form.Control
              as="select"
              value={orderData.carrier || "UPS"}
              onChange={handleCarrierChange}
              readOnly={order.fulfilled}
            >
              {!order.fulfilled ? (
                <>
                  <option value="UPS">UPS</option>
                  <option value="Fedex">Fedex</option>
                  <option value="USPS">USPS</option>
                </>
              ) : (
                <option value={order.carrier}>{order.carrier}</option>
              )}
            </Form.Control>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="order-card-row py-2">
          <Form.Label column sm={4} className="order-hist-label">
            Tracking Number:
          </Form.Label>
          <Col sm={8} className="order-hist-info">
            <Form.Control
              type="text"
              value={orderData.trackingNum || ""}
              onChange={handleTrackingNumberChange}
              readOnly={order.fulfilled}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="order-card-row py-2">
          <Form.Label column sm={4} className="order-hist-label">
            Order Fulfilled:
          </Form.Label>
          <Col sm={8} className="order-hist-info">
            <Form.Check
              type="checkbox"
              checked={orderData.fulfilled}
              onChange={handleFulfilledChange}
              className="order-hist-checkbox"
            />
          </Col>
        </Form.Group>

        {!order.fulfilled ? (
          <Button type="submit" className="order-hist-submit">
            Submit
          </Button>
        ) : (
          ""
        )}
      </Form>
      {errorMessage ? (
        <div>
          <p className="error-text">{errorMessage}</p>
        </div>
      ) : null}
    </Container>
  );
};

export default OrderCards;
