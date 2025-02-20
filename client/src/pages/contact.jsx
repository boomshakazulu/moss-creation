import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import instaPhoto from "../assets/images/instagram.jpeg";
import "./contact.css";
import Accordion from "react-bootstrap/Accordion";

function Contact() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToBottom) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [location.state]);

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
            style={{ whiteSpace: "nowrap" }}
            href="https://www.instagram.com/mossy_creations_by_katie/"
            target="_blank"
          >
            @mossy_creations_by_katie
          </a>{" "}
          or by email{" "}
          <a
            style={{ whiteSpace: "nowrap" }}
            href="mailto:support@mossy-creations.com"
          >
            support@mossy-creations.com
          </a>
          .
          <br /> <br />
          If you are reaching out about a previous order please email{" "}
          <a
            style={{ whiteSpace: "nowrap" }}
            href="mailto:support@mossy-creations.com"
          >
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
          <Accordion.Item eventKey="3">
            <Accordion.Header>What is your privacy policy?</Accordion.Header>
            <Accordion.Body>
              We only store the information necessary to complete your order or
              maintain your account.
              <br />
              <br />
              **The information we store includes:** - Email address - Username
              - Address (for shipping) - Name (for shipping) - Payment statuses
              and payment amounts - Reviews - **Encrypted (hashed) passwords
              (for account authentication only, never stored in plain text)**
              <br />
              <br />
              We do **not** store any billing information. All billing details
              are securely processed by our payment provider,
              <a
                href="https://stripe.com"
                style={{ color: "blue" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                Stripe
              </a>
              . You can review their privacy policy for more details.
              <br />
              <br />
              We do **not** sell or share any stored information with third
              parties. If you wish to update or delete your information, please
              contact our support team.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4">
            <Accordion.Header>What is your return policy?</Accordion.Header>
            <Accordion.Body>
              <p>
                We offer a <strong>30-day return policy</strong> for all
                products, including custom-made items. To request a return,
                please contact us at{" "}
                <a href="mailto:support@mossy-creations.com">
                  support@mossy-creations.com
                </a>{" "}
                with details about the issue.
              </p>
              <p>
                <strong>Damaged Items:</strong> If your order arrives damaged,
                please email us with photos, and we’ll arrange a refund or
                exchange.
              </p>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
}

export default Contact;
