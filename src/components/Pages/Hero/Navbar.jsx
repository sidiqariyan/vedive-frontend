import React, { useState, useEffect } from "react";
import "./styles.css"; // Ensure your CSS is imported
import logo from "../../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="navbar ">
      <div className="logo-main">
        <img src={logo} alt="Logo" />
      </div>
      <ul className="nav-links ml-36">
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
          <Link to="/blog">Blogs</Link>
        </li>
        <li>
          <Link to="/contact">Contact Us</Link>
        </li>
       
      </ul>
      <div className="buttons">
        {isLoggedIn ? (
          <>
            <Link to="/dashboard">
              <img
                src="profile-icon.png"
                alt="Profile"
                style={{ width: "30px", height: "30px" }}
              />
            </Link>
            <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ padding: "5px 25px" }}>
              Log in
            </Link>
            <Link
              to="/signup"
              style={{
                backgroundColor: "#1E90FF",
                border: "solid #1E90FF 1px",
                padding: "5px 25px",
              }}
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
