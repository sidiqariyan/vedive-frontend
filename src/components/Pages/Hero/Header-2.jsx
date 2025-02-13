import React, { useState, useEffect, useRef } from "react";
import "./styles.css"; // Make sure to import your CSS
import Vedive from "../assets/Vedive.png";
import { Link } from "react-router-dom";
import svg1 from "../assets/svg1.svg";
import svg2 from "../assets/svg2.svg";
import svg3 from "../assets/svg3.svg";
import svg4 from "../assets/svg4.svg";
import svg5 from "../assets/svg5.svg";
import user from "../assets/user.svg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (event) => {
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target) &&
      !hamburgerRef.current.contains(event.target)
    ) {
      setIsMenuOpen(false);
    }
  };

  const handleResize = () => {
    if (window.innerWidth > 1024) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="navbar">
      <div className="logo-main">
        <img src={Vedive} alt="Logo" />
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About Us</Link>
        </li>
        <li>
          <Link to="/services">Services</Link>
        </li>
        <li>
          <Link to="/templates">Templates</Link>
        </li>
        <li>
          <Link to="/pricing">Pricing</Link>
        </li>
        <li>
          <Link to="/blogs">Blogs</Link>
        </li>
        <li>
          <Link to="/contact">Contact Us</Link>
        </li>
      </ul>
      <div className="buttons">
        <Link to="#" style={{ border: "none" }}>
          <img src={user} alt="user-icon" />
        </Link>
      </div>

      <div
        className={`hamburger ${isMenuOpen ? "active" : ""}`}
        ref={hamburgerRef}
        onClick={toggleMenu}
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      <div
        className={`mobile-menu ${isMenuOpen ? "active" : ""}`}
        ref={mobileMenuRef}
      >
        <img src={svg1} className="menu-svg svg-1" alt="SVG 1" />
        <img src={svg2} className="menu-svg svg-2" alt="SVG 2" />
        <img src={svg3} className="menu-svg svg-3" alt="SVG 3" />
        <img src={svg4} className="menu-svg svg-4" alt="SVG 4" />
        <img src={svg5} className="menu-svg svg-5" alt="SVG 5" />
        <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>
        <Link to="/services">Services</Link>
        <Link to="/templates">Templates</Link>
        <Link to="/pricing">Pricing</Link>
        <Link to="/blogs">Blogs</Link>
        <Link to="/contact">Contact Us</Link>
      </div>
    </div>
  );
};

export default Navbar;
