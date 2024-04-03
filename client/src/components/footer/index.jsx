import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4">
      <div className="container">
        <p className="mb-0">
          If you have any questions or requests, please{" "}
          <Link to="/contact" className="text-light fw-bold">
            contact me
          </Link>
          .
        </p>
      </div>
    </footer>
  );
};

export default Footer;
