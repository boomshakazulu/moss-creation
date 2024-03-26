import React, { useState, useEffect } from "react";
import { Navbar, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Auth from "../../utils/auth";
import Cart from "../Cart";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import MenuBtn from "../menuBtn";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 992);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    if (isMenuOpen) {
      toggleMenu();
    }
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
      expanded={isMenuOpen}
      onToggle={toggleMenu}
      className={`header ${isMenuOpen ? "expanded" : ""}`}
    >
      <Container>
        {/* Hamburger menu button */}
        <MenuBtn isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
        {/* Brand name */}
        <Navbar.Brand className="brand-name">
          <Link to="/">Mossy Creations</Link>
        </Navbar.Brand>
        <Cart />
        {/* Navigation links */}
        <Navbar.Collapse className="links-location" id="responsive-navbar-nav">
          {isSmallScreen ? (
            <>
              <div className="link-row">
                <Link to="/" className="link-box" onClick={closeMenu}>
                  Home
                </Link>
                <Link to="/about" className="link-box" onClick={closeMenu}>
                  About
                </Link>
              </div>
              <div className="link-row">
                <Link to="/checkout" className="link-box" onClick={closeMenu}>
                  Checkout
                </Link>
                <Link to="/contact" className="link-box" onClick={closeMenu}>
                  Contact Me
                </Link>
              </div>
              {!Auth.loggedIn() ? (
                <div className="link-row">
                  <Link to="/signup" className="link-box" onClick={closeMenu}>
                    Signup
                  </Link>
                  <Link to="/login" className="link-box" onClick={closeMenu}>
                    Login
                  </Link>
                </div>
              ) : (
                <div className="link-row">
                  {Auth.isAdmin() && (
                    <Link to="/admin" className="link-box" onClick={closeMenu}>
                      Admin
                    </Link>
                  )}
                  <Link
                    onClick={() => Auth.logout()}
                    to="/"
                    className="link-box"
                  >
                    Logout
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              {/* <Cart /> */}
              {!Auth.loggedIn() ? (
                <>
                  <Link to="/signup">Signup</Link>
                  <Link to="/login">Login</Link>
                </>
              ) : (
                <Link onClick={() => Auth.logout()} to="/">
                  Logout
                </Link>
              )}
              {Auth.isAdmin() && <Link to="/admin">Admin</Link>}
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
