import React, { useState, useEffect, useRef } from "react";
import "./styles.css"; // Ensure your CSS is imported
import Vedive from "../assets/Vedive.png";
import { Link, useNavigate } from "react-router-dom";
import svg1 from "../assets/svg1.svg";
import svg2 from "../assets/svg2.svg";
import svg3 from "../assets/svg3.svg";
import svg4 from "../assets/svg4.svg";
import svg5 from "../assets/svg5.svg";
import user from "../assets/user.svg";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  // Check if the user is logged in based on token
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Handle clicks outside the mobile menu
  const handleClickOutside = (event) => {
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target) &&
      !hamburgerRef.current.contains(event.target)
    ) {
      setIsMenuOpen(false);
    }
  };

  // Close mobile menu on window resize if screen width > 1024px
  const handleResize = () => {
    if (window.innerWidth > 1024) {
      setIsMenuOpen(false);
    }
  };

  // Add event listeners for click outside and resize
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="navbar">
      {/* Logo */}
      <div className="logo-main">
        <img src={Vedive} alt="Logo" />
      </div>

      {/* Desktop Navigation Links */}
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

      {/* Buttons for Desktop View */}
      <div className="buttons">
        {isLoggedIn ? (
          <>
            <Link
              to="/dashboard"
              style={{
                backgroundColor: "#1E90FF",
                border: "solid #1E90FF 1px",
                padding: "5px 25px",
              }}
            >
              My Account
            </Link>
            <button
              onClick={handleLogout}
              style={{
                border: "solid rgb(255, 255, 255) 1px",
                padding: "5px 25px",
                borderRadius: "5px",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ padding: "" }}>
              Log in
            </Link>
            <Link
              to="/signup"
              style={{
                backgroundColor: "#1E90FF",
                border: "solid #1E90FF 1px",
                padding: "",
              }}
            >
              Get Started For Free
            </Link>
          </>
        )}
      </div>

      {/* Hamburger Menu for Mobile */}
      <div
        className={`hamburger ${isMenuOpen ? "active" : ""}`}
        ref={hamburgerRef}
        onClick={toggleMenu}
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      {/* Mobile Menu */}
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

        {/* Mobile Buttons */}
        {isLoggedIn ? (
          <>
            <Link
              to="/dashboard"
            >
              My Account
            </Link>
            <button
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
            >
              Log in
            </Link>
            <Link
              to="/signup"
            >
              Get Started For Free
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;