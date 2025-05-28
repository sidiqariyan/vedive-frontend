import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./styles.css";
import Vedive from "../assets/Vedive.png";
import svg1 from "../assets/svg1.svg";
import svg2 from "../assets/svg2.svg";
import svg3 from "../assets/svg3.svg";
import svg4 from "../assets/svg4.svg";
import svg5 from "../assets/svg5.svg";

// Constants
const MOBILE_BREAKPOINT = 1024;
const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/templates", label: "Templates" },
  { to: "/pricing", label: "Pricing" },
  { to: "/blogs", label: "Blogs" },
  { to: "/contact", label: "Contact Us" }
];

const SVG_ASSETS = [
  { src: svg1, className: "menu-svg svg-1", alt: "SVG 1" },
  { src: svg2, className: "menu-svg svg-2", alt: "SVG 2" },
  { src: svg3, className: "menu-svg svg-3", alt: "SVG 3" },
  { src: svg4, className: "menu-svg svg-4", alt: "SVG 4" },
  { src: svg5, className: "menu-svg svg-5", alt: "SVG 5" }
];

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  // Memoized styles to prevent re-creation on every render
  const buttonStyles = useMemo(() => ({
    primary: {
      backgroundColor: "#1E90FF",
      border: "solid #1E90FF 1px",
      padding: "5px 25px",
    },
    secondary: {
      border: "solid rgb(255, 255, 255) 1px",
      padding: "5px 25px",
      borderRadius: "5px",
    }
  }), []);

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Memoized callback to close menu
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Handle clicks outside the mobile menu
  const handleClickOutside = useCallback((event) => {
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target) &&
      hamburgerRef.current &&
      !hamburgerRef.current.contains(event.target)
    ) {
      closeMenu();
    }
  }, [closeMenu]);

  // Close mobile menu on window resize if screen width > breakpoint
  const handleResize = useCallback(() => {
    if (window.innerWidth > MOBILE_BREAKPOINT) {
      closeMenu();
    }
  }, [closeMenu]);

  // Event listeners setup
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    window.addEventListener("resize", handleResize);
    
    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleClickOutside, handleResize]);

  // Toggle mobile menu
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  // Handle logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  }, [navigate]);

  // Render navigation links
  const renderNavLinks = useCallback((isMobile = false) => {
    return NAV_LINKS.map(({ to, label }) => (
      <li key={to}>
        <NavLink
          to={to}
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={isMobile ? closeMenu : undefined}
        >
          {label}
        </NavLink>
      </li>
    ));
  }, [closeMenu]);

  // Render mobile navigation links (without li wrapper)
  const renderMobileNavLinks = useCallback(() => {
    return NAV_LINKS.map(({ to, label }) => (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) => (isActive ? "active" : "")}
        onClick={closeMenu}
      >
        {label}
      </NavLink>
    ));
  }, [closeMenu]);

  // Render authentication buttons
  const renderAuthButtons = useCallback((isMobile = false) => {
    if (isLoggedIn) {
      return (
        <>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "active button" : "button"
            }
            style={!isMobile ? buttonStyles.primary : undefined}
            onClick={isMobile ? closeMenu : undefined}
          >
            My Account
          </NavLink>
          <button
            onClick={handleLogout}
            style={!isMobile ? buttonStyles.secondary : undefined}
          >
            Logout
          </button>
        </>
      );
    }

    return (
      <>
        <NavLink
          to="/login"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={isMobile ? closeMenu : undefined}
        >
          Log in
        </NavLink>
        <NavLink
          to="/signup"
          className={({ isActive }) =>
            isActive ? "active button" : "button"
          }
          style={!isMobile ? buttonStyles.primary : undefined}
          onClick={isMobile ? closeMenu : undefined}
        >
          Get Started For Free
        </NavLink>
      </>
    );
  }, [isLoggedIn, handleLogout, buttonStyles, closeMenu]);

  // Render SVG decorations
  const renderSVGDecorations = useCallback(() => {
    return SVG_ASSETS.map((svg, index) => (
      <img
        key={index}
        src={svg.src}
        className={svg.className}
        alt={svg.alt}
      />
    ));
  }, []);

  return (
    <div className="navbar">
      {/* Logo */}
      <Link to="/">
        <div className="logo-main">
          <img src={Vedive} alt="Vedive Logo" />
        </div>
      </Link>

      {/* Desktop Navigation Links */}
      <ul className="nav-links">
        {renderNavLinks()}
      </ul>

      {/* Desktop Authentication Buttons */}
      <div className="buttons">
        {renderAuthButtons()}
      </div>

      {/* Hamburger Menu for Mobile */}
      <div
        className={`hamburger ${isMenuOpen ? "active" : ""}`}
        ref={hamburgerRef}
        onClick={toggleMenu}
        role="button"
        tabIndex={0}
        aria-label="Toggle mobile menu"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
          }
        }}
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`mobile-menu ${isMenuOpen ? "active" : ""}`}
        ref={mobileMenuRef}
        role="navigation"
        aria-label="Mobile navigation menu"
      >
        {renderSVGDecorations()}
        {renderMobileNavLinks()}
        {renderAuthButtons(true)}
      </div>
    </div>
  );
};

export default Navbar;