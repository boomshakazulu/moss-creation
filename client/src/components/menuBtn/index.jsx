import react from "react";
import "./index.css";

function menuBtn({ isMenuOpen, toggleMenu }) {
  return (
    <div
      id="nav-icon"
      className={isMenuOpen ? "open" : ""}
      onClick={toggleMenu}
    >
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}

export default menuBtn;
