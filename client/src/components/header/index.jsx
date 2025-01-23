import React, { useState, useEffect } from "react";
import { Navbar, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useStoreContext } from "../../utils/GlobalState";
import Auth from "../../utils/auth";
import Cart from "../Cart";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

import signupImg from "../../assets/images/menuBtns/signup.png";
import loginImg from "../../assets/images/menuBtns/login.png";
import contactmeImg from "../../assets/images/menuBtns/contactme.png";
import logoutImg from "../../assets/images/menuBtns/logout (2).png";
import homeImg from "../../assets/images/menuBtns/home.png";
import aboutmeImg from "../../assets/images/menuBtns/aboutme(2).png";
import profileImg from "../../assets/images/menuBtns/Profile.png";

import MenuBtn from "../menuBtn";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 992);
  const [state, dispatch] = useStoreContext();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    if (isMenuOpen) {
      toggleMenu();
    }
  };

  //useEffect for resizing the header for small windows
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
      className={`header ${isMenuOpen ? "expanded" : ""} ${
        state.cartOpen ? "header-cartOpen" : ""
      }`}
    >
      <Container>
        {/* Hamburger menu button */}
        {isSmallScreen ? (
          <MenuBtn isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
        ) : null}
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
                  <img src={homeImg} alt="Home" />
                </Link>
                <Link to="/about" className="link-box" onClick={closeMenu}>
                  <img src={aboutmeImg} alt="About me" />
                </Link>
              </div>
              <div className="link-row">
                <Link to="/contact" className="link-box" onClick={closeMenu}>
                  <img src={contactmeImg} alt="Contact me" />
                </Link>
                {Auth.loggedIn() ? (
                  <Link to="/profile" className="link-box" onClick={closeMenu}>
                    <img src={profileImg} alt="Profile" />
                  </Link>
                ) : (
                  <Link to="/login" className="link-box" onClick={closeMenu}>
                    <img src={loginImg} alt="Login" />
                  </Link>
                )}
              </div>
              {!Auth.loggedIn() ? (
                <div className="link-row">
                  <Link to="/signup" className="link-box" onClick={closeMenu}>
                    <img src={signupImg} alt="Signup" />
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
                    <img src={logoutImg} alt="Logout" />
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact Me</Link>
              {/* <Cart /> */}
              {!Auth.loggedIn() ? (
                <>
                  <Link to="/signup">Signup</Link>
                  <Link to="/login">Login</Link>
                </>
              ) : (
                <>
                  <Link to="/profile">Profile</Link>
                  <Link onClick={() => Auth.logout()} to="/">
                    Logout
                  </Link>
                </>
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
