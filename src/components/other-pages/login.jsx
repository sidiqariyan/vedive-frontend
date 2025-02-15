<<<<<<< HEAD
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./secondarystyles.css";
=======
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios"; // Import Axios for API requests
import "./secondarystyles.css"; // Ensure your styles are imported
>>>>>>> 90ae9e8 (New changes added)
import Vedive from "../assets/Vedive.png";
import Google from "../assets/google-icon.svg";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for input fields
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for error messages

  useEffect(() => {
    // Extract token from URL query parameters
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    if (token) {
      // Store token in localStorage
      localStorage.setItem("token", token);
      navigate("/dashboard"); // Redirect to dashboard
    }
  }, [location, navigate]);

  // Handle Google Login
  const handleGoogleLogin = () => {
    // Redirect to backend Google authentication route
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  // Handle Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(""); // Clear previous errors

    try {
      // Send login request to backend
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        emailOrUsername,
        password,
      });

      // Save token in localStorage
      localStorage.setItem("token", response.data.token);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.error || "An unexpected error occurred.");
    }
  };

  return (
    <div>
      {/* Header Section */}
      <header className="login-header">
        <img src={Vedive} alt="logo" />
      </header>

      {/* Login Container */}
      <div className="login-container">
        <h2>Login to Vedive</h2>
        <hr className="login-hr" />
<<<<<<< HEAD
        <form onSubmit={handleLogin}>
          <button className="google-btn">
            <img src={Google} alt="Google Icon" /> Continue with Google
          </button>

=======

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* Google Sign-In Button */}
          <button className="google-btn" onClick={handleGoogleLogin}>
            <img src={Google} alt="Google Icon" /> Continue with Google
          </button>

          {/* Email/Username Input */}
>>>>>>> 90ae9e8 (New changes added)
          <div className="input-login-group">
            <input
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className="input-login-field"
              placeholder=" "
              required
            />
            <label className="input-login-label">Email or Username</label>
          </div>

          {/* Password Input */}
          <div className="input-login-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-login-field"
              placeholder=" "
              required
            />
            <label className="input-login-label">Password</label>
          </div>

          {/* Error Message */}
          {error && <p className="error-message">{error}</p>}

          {/* Submit Button */}
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        {/* Links */}
        <div className="links">
          <Link to="/reset" style={{ borderBottom: "solid 1px #0059FF" }}>
            Forgot Password?
          </Link>
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;