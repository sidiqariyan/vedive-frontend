import React, { useState, useEffect, useRef } from "react";
import "./styles.css"; // Ensure your CSS is imported
import Vedive from "../assets/Vedive.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import svg1 from "../assets/svg1.svg";
import svg2 from "../assets/svg2.svg";
import svg3 from "../assets/svg3.svg";
import svg4 from "../assets/svg4.svg";
import svg5 from "../assets/svg5.svg";

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
      <Link to="/">
      <div className="logo-main">
        
        <img src={Vedive} alt="Logo" />
       
      </div>
      </Link>
      {/* Desktop Navigation Links */}
      <ul className="nav-links">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            About Us
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/services"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Services
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/templates"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Templates
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/pricing"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Pricing
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/blogs"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Blogs
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Contact Us
          </NavLink>
        </li>
      </ul>

      {/* Buttons for Desktop View */}
      <div className="buttons">
        {isLoggedIn ? (
          <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "active button" : "button"
              }
              style={{
                backgroundColor: "#1E90FF",
                border: "solid #1E90FF 1px",
                padding: "5px 25px",
              }}
            >
              My Account
            </NavLink>
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
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Log in
            </NavLink>
            <NavLink
              to="/signup"
              className={({ isActive }) =>
                isActive ? "active button" : "button"
              }
              style={{
                backgroundColor: "#1E90FF",
                border: "solid #1E90FF 1px",
                padding: "5px 25px",
              }}
            >
              Get Started For Free
            </NavLink>
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

        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={() => setIsMenuOpen(false)}
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={() => setIsMenuOpen(false)}
        >
          About Us
        </NavLink>
        <NavLink
          to="/services"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={() => setIsMenuOpen(false)}
        >
          Services
        </NavLink>
        <NavLink
          to="/templates"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={() => setIsMenuOpen(false)}
        >
          Templates
        </NavLink>
        <NavLink
          to="/pricing"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={() => setIsMenuOpen(false)}
        >
          Pricing
        </NavLink>
        <NavLink
          to="/blogs"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={() => setIsMenuOpen(false)}
        >
          Blogs
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={() => setIsMenuOpen(false)}
        >
          Contact Us
        </NavLink>

        {/* Mobile Buttons */}
        {isLoggedIn ? (
          <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setIsMenuOpen(false)}
            >
              My Account
            </NavLink>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setIsMenuOpen(false)}
            >
              Log in
            </NavLink>
            <NavLink
              to="/signup"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started For Free
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
