import React, { useState } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { COMPLETE_ORDER } from "../../utils/mutations";
import AutoResizeInput from "../autoResizeInput";

import "./style.css";

const OrderCards = ({ order }) => {
  const [orderData, setOrderData] = useState(order);
  const [completeOrder, { error }] = useMutation(COMPLETE_ORDER);
  const [hasBeenWarned, setHasBeenWarned] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  //sets the correct shipping carrier on change
  const handleCarrierChange = (e) => {
    setOrderData((prevOrder) => ({
      ...prevOrder,
      carrier: e.target.value,
    }));
  };
  //handles trackingnumber input
  const handleTrackingNumberChange = (e) => {
    if (!orderData.fulfilled) {
      setOrderData((prevOrder) => ({
        ...prevOrder,
        trackingNum: e.target.value,
      }));
    }
  };
  //handles the change for when an order is completed
  const handleFulfilledChange = () => {
    setOrderData((prevOrder) => ({
      ...prevOrder,
      fulfilled: !prevOrder.fulfilled,
    }));
  };
  //completes the order and runs the mutation to notify the user via email
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!hasBeenWarned && !orderData.trackingNum && orderData.fulfilled) {
        setErrorMessage(
          "Warning: You are completing the order without a tracking number. This will send an email to the user without tracking! Hit submit again to proceed without tracking."
        );
        setHasBeenWarned(true);
      } else {
        await completeOrder({
          variables: {
            orderId: orderData._id,
            carrier: orderData.carrier ? orderData.carrier : "UPS",
            trackingNum: orderData.trackingNum,
            fulfilled: orderData.fulfilled,
            email: orderData.email,
          },
        });
      }
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

        {/* Email field (using AutoResizeInput) */}
        <Form.Group as={Row} className="order-card-row py-2">
          <Form.Label column sm={4} className="order-hist-label">
            Email:
          </Form.Label>
          <Col sm={8} className="order-hist-info">
            <AutoResizeInput value={orderData.email} readOnly />
          </Col>
        </Form.Group>

        {/* Products list (using AutoResizeInput) */}
        <Form.Group as={Row} className="order-card-row py-2">
          <Form.Label column sm={4} className="order-hist-label">
            Products:
          </Form.Label>
          <Col sm={8} className="order-hist-info">
            <AutoResizeInput
              value={orderData.products
                .map(
                  (product) => `${product.product.name} (${product.quantity})`
                )
                .join("\n")}
              readOnly
            />
          </Col>
        </Form.Group>

        {/* Customer Name field (using AutoResizeInput) */}
        <Form.Group as={Row} className="order-card-row py-2">
          <Form.Label column sm={4} className="order-hist-label">
            Customer Name:
          </Form.Label>
          <Col sm={8} className="order-hist-info">
            <AutoResizeInput value={orderData.customerName} readOnly />
          </Col>
        </Form.Group>

        {/* Address field (using AutoResizeInput) */}
        <Form.Group as={Row} className="order-card-row py-2">
          <Form.Label column sm={4} className="order-hist-label">
            Address:
          </Form.Label>
          <Col sm={8} className="order-hist-info">
            <AutoResizeInput value={orderData.address} readOnly />
          </Col>
        </Form.Group>

        {/* Amount Paid field */}
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

        {/* Carrier field */}
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

        {/* Tracking Number field */}
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

        {/* Order Fulfilled checkbox */}
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

        {/* Submit button */}
        {!order.fulfilled ? (
          <Button type="submit" className="order-hist-submit">
            Submit
          </Button>
        ) : (
          ""
        )}
      </Form>

      {/* Error Message */}
      {errorMessage ? (
        <div>
          <p className="error-text">{errorMessage}</p>
        </div>
      ) : null}
    </Container>
  );
};

export default OrderCards;
