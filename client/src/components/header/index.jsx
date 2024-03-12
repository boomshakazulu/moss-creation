import React, { useState, useEffect } from "react";
import { Navbar, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 992);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 992);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Navbar
      expand="lg"
      variant="dark"
      bg="dark"
      fixed="top"
      expanded={isMenuOpen}
      onToggle={toggleMenu}
      className={`header ${isMenuOpen ? "expanded" : ""}`}
    >
      <Container className="menu-button">
        {/* Hamburger menu button */}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        {/* Navigation links */}
        <Navbar.Collapse id="responsive-navbar-nav">
          {isSmallScreen ? (
            <>
              <div className="link-row">
                <Link to="/" className="link-box">
                  Home
                </Link>
                <Link to="/about" className="link-box">
                  About
                </Link>
              </div>
              <div className="link-row">
                <Link to="/signup" className="link-box">
                  Signup
                </Link>
                <Link to="/login" className="link-box">
                  Login
                </Link>
              </div>
              <div className="link-row">
                <Link to="/cart" className="link-box">
                  Cart
                </Link>
                <Link to="/checkout" className="link-box">
                  Checkout
                </Link>
              </div>
            </>
          ) : (
            <div className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/signup">Signup</Link>
              <Link to="/login">Login</Link>
              <Link to="/cart">Cart</Link>
              <Link to="/checkout">Checkout</Link>
            </div>
          )}
        </Navbar.Collapse>

        {/* Responsive menu overlay */}
        {isMenuOpen && (
          <div className="menu-overlay" onClick={toggleMenu}></div>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
