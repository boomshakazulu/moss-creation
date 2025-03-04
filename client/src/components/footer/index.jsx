import React from "react";
import { Link } from "react-router-dom";
import instaLogo from "../../assets/images/insta-logo.png";
import facebookLogo from "../../assets/images/facebook-icon.png";
import "./style.css";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4">
      <div className="footer-container">
        <div className="footer-column">
          <ul className="footer-left-ul">
            <li>
              <a
                className="text-light"
                href="mailto:support@mossy-creations.com"
              >
                support@mossy-creations.com
              </a>
            </li>
            <li>
              <Link
                to={{ pathname: "/contact", state: { scrollToBottom: true } }}
                className="text-light"
              >
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <ul>
            <li>
              <a href="https://www.instagram.com/mossy_creations_by_katie/">
                <img
                  src={instaLogo}
                  alt="Instagram Logo"
                  className="insta-logo"
                />
                @mossy_creations_by_katie
              </a>
            </li>
            <li className="facebook-list-item">
              <a href="https://www.facebook.com/profile.php?id=61558554467419">
                <img
                  src={facebookLogo}
                  alt="Facebook Logo"
                  className="facebook-logo"
                />
                Mossy Creations
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <ul className="footer-right-ul">
            <li>
              <a
                href="/terms-of-service.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
