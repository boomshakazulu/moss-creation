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
    <Container className="order-card mb-3" style={{ maxWidth: "420px" }}>
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row} className="order-card-row py-2">
          <Form.Label column sm={4}>
            Email:
          </Form.Label>
          <Col sm={8}>
            <Form.Control plaintext readOnly defaultValue={orderData.email} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="order-card-row py-2">
          <Form.Label column sm={4}>
            Products:
          </Form.Label>
          <Col sm={8}>
            <ul className="list-unstyled mb-0">
              {orderData.products.map((product, index) => (
                <li key={index}>
                  {product.product.name}({product.quantity})
                </li>
              ))}
            </ul>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="order-card-row py-2">
          <Form.Label column sm={4}>
            Stripe Payment Intent ID:
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              plaintext
              readOnly
              defaultValue={orderData.stripePaymentIntentId}
            />
          </Col>
        </Form.Group>

        <h5 className="mt-4">Shipping Information</h5>

        <Form.Group as={Row} className="order-card-row py-2">
          <Form.Label column sm={4}>
            Customer Name:
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              plaintext
              readOnly
              defaultValue={orderData.customerName}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="order-card-row py-2">
          <Form.Label column sm={4}>
            Address:
          </Form.Label>
          <Col sm={8}>
            {/* Wrap defaultValue in a div and apply style */}
            <div style={{ whiteSpace: "pre-line" }}>{orderData.address}</div>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="order-card-row py-2">
          <Form.Label column sm={4}>
            Amount Paid:
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              plaintext
              readOnly
              defaultValue={`$${orderData.price}`}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="order-card-row py-2">
          <Form.Label column sm={4}>
            Carrier:
          </Form.Label>
          <Col sm={8}>
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
          <Form.Label column sm={4}>
            Tracking Number:
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              type="text"
              value={orderData.trackingNum || ""}
              onChange={handleTrackingNumberChange}
              readOnly={order.fulfilled}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="order-card-row py-2">
          <Form.Label column sm={4}>
            Order Fulfilled:
          </Form.Label>
          <Col sm={8}>
            <Form.Check
              type="checkbox"
              checked={orderData.fulfilled}
              onChange={handleFulfilledChange}
            />
          </Col>
        </Form.Group>

        {!order.fulfilled ? <Button type="submit">Submit</Button> : ""}
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
