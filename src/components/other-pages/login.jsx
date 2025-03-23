import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";
import "./secondarystyles.css";
import Vedive from "../assets/Vedive.png";
import Google from "../assets/google-icon.svg";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for input fields
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  // State for error messages and loading
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle token from URL (e.g., after Google OAuth)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          console.error("Token has expired");
          setError("Your session has expired. Please log in again.");
          navigate("/login");
          return;
        }
        localStorage.setItem("token", token);
        navigate("/dashboard");
      } catch (error) {
        console.error("Invalid token:", error);
        setError("Invalid session. Please log in again.");
        navigate("/login");
      }
    }
  }, [location, navigate]);

  // Handle Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://ec2-51-21-1-175.eu-north-1.compute.amazonaws.com:3000/api/auth/login",
        { emailOrUsername, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      localStorage.setItem("token", response.data.token);
      setEmailOrUsername("");
      setPassword("");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      if (err.code === "ERR_NETWORK") {
        setError("Network error. Please check your connection or server status.");
      } else {
        setError(err.response?.data?.error || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-In
  const handleGoogleLogin = () => {
    window.location.href = "https://ec2-51-21-1-175.eu-north-1.compute.amazonaws.com:3000/api/auth/google";
  };

  return (
    <div>
      {/* Header Section */}
      <header className="login-header">
        <img src={Vedive} alt="Vedive Logo" />
      </header>

      {/* Login Container */}
      <div className="login-container">
        <h2>Login to Vedive</h2>
        <hr className="login-hr" />

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* Google Sign-In Button */}
          <button
            type="button"
            className="google-btn"
            onClick={handleGoogleLogin}
            aria-label="Continue with Google"
          >
            <img src={Google} alt="Google Icon" /> Continue with Google
          </button>

          {/* Email/Username Input */}
          <div className="input-login-group">
            <input
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className="input-login-field"
              placeholder=" "
              required
              aria-label="Email or Username"
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
              aria-label="Password"
            />
            <label className="input-login-label">Password</label>
          </div>

          {/* Error Message */}
          {error && <p className="error-message">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
            aria-label="Login"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Links */}
        <div className="links">
          <Link
            to="/pass-reset"
            style={{ borderBottom: "solid 1px #0059FF" }}
            aria-label="Forgot Password"
          >
            Forgot Password?
          </Link>
          <p>
            Don't have an account?{" "}
            <Link to="/signup" aria-label="Sign Up">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;