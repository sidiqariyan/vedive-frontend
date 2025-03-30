import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import jwtDecode from "jwt-decode";
import "./secondarystyles.css";
import Vedive from "../assets/Vedive.png";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for input fields
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  // State for error messages and loading state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Use HTTPS for API_URL
  const API_URL = "http://ec2-51-21-1-175.eu-north-1.compute.amazonaws.com:3000";

  // Check if the user is already authenticated and redirect them to the dashboard
  const checkAuthAndRedirect = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // decoded.exp is in seconds; compare with current time in milliseconds
        if (decoded.exp * 1000 > Date.now()) {
          navigate("/dashboard");
          return true;
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
      }
    }
    return false;
  };

  useEffect(() => {
    if (checkAuthAndRedirect()) return;
  }, [navigate]);

  // Handle token from URL (if any)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          setError("Your session has expired. Please log in again.");
          navigate("/login");
          return;
        }
        localStorage.setItem("token", token);
        navigate("/dashboard");
      } catch (err) {
        console.error("Invalid token:", err);
        setError("Invalid session. Please log in again.");
        navigate("/login");
      }
    }
  }, [location, navigate]);

  // Handle email/password login using the Fetch API
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include", // to send cookies with the request
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      // If the response is not ok, throw an error
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      setEmailOrUsername("");
      setPassword("");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err.message ||
          "An unexpected error occurred. Please check your connection or server status."
      );
    } finally {
      setLoading(false);
    }
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

        {/* Login Form */}
        <form onSubmit={handleLogin}>
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

          {/* Display error messages */}
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

        {/* Additional Links */}
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
