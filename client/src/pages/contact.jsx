import React from "react";
import instaPhoto from "../assets/images/instagram.jpeg";
import "./contact.css";
import Accordion from "react-bootstrap/Accordion";

function Contact() {
  return (
    <div>
      <div className="insta-qr-container">
        <div className="insta-qr-anchor-size">
          <a
            href="https://www.instagram.com/mossy_creations_by_katie/"
            target="_blank"
          >
            <img
              src={instaPhoto}
              alt="mossy_creations_by_katie"
              className="instagram-qr"
            />
          </a>
        </div>
      </div>
      <div className="contact-text-container">
        <p className="contact-text">
          For all inquiries or for any special request please contact me by
          instagram{" "}
          <a
            href="https://www.instagram.com/mossy_creations_by_katie/"
            target="_blank"
          >
            @mossy_creations_by_katie
          </a>{" "}
          or by email{" "}
          <a href="mailto:support@mossy-creations.com">
            support@mossy-creations.com
          </a>
          .
          <br /> <br />
          If you are reaching out about a previous order please email{" "}
          <a href="mailto:support@mossy-creations.com">
            support@mossy-creations.com
          </a>{" "}
          and include your name to help us find your order.
          <br />
          <br />
          Thank you
        </p>
      </div>
      <div className="faq-container">
        <h2 className="faq-title">FAQ</h2>
        <Accordion defaultActiveKey={null}>
          <Accordion.Item eventKey="0">
            <Accordion.Header>What is the price of shipping?</Accordion.Header>
            <Accordion.Body>
              All shipping costs are included in the listed price of the item.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              Can you make custom alterations?
            </Accordion.Header>
            <Accordion.Body>
              Yes! <br /> Please contact me on instagram{" "}
              <a
                href="https://www.instagram.com/mossy_creations_by_katie/"
                target="_blank"
              >
                @mossy_creations_by_katie
              </a>{" "}
              or by email{" "}
              <a href="mailto:support@mossy-creations.com">
                support@mossy-creations.com
              </a>{" "}
              with any requests.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>What locations do you ship to?</Accordion.Header>
            <Accordion.Body>
              We currently only ship to the USA and Canada. However, it's
              possible international shipping could be arranged. Please contact
              me for international requests on instagram{" "}
              <a
                href="https://www.instagram.com/mossy_creations_by_katie/"
                target="_blank"
              >
                @mossy_creations_by_katie
              </a>{" "}
              or by email{" "}
              <a href="mailto:support@mossy-creations.com">
                support@mossy-creations.com
              </a>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
}

export default Contact;
