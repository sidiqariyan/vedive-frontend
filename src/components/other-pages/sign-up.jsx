import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./secondarystyles.css";
import Vedive from "../assets/Vedive.png";
import Google from "../assets/google-icon.svg";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Registration failed.");
      }
      setMessage(data.message);
      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
      });
      setTimeout(() => navigate("/dashboard"), 3000);
    } catch (err) {
      console.error("Signup failed:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // const handleGoogleSignup = () => {
  //   try {
  //     window.location.href = "http://localhost:3000/api/auth/google";
  //   } catch (error) {
  //     console.error("Google signup failed:", error);
  //     setError("An error occurred while trying to sign up with Google.");
  //   }
  // };

  return (
    <div>
      <header className="login-header">
        <img src={Vedive} alt="logo" />
      </header>
      <div className="login-container">
        <h2>Sign Up to Vedive</h2>
        <hr className="login-hr" />
        <form onSubmit={handleSubmit}>
          {/* <button className="google-btn" onClick={handleGoogleSignup}>
            <img src={Google} alt="Google Icon" /> Continue with Google
          </button> */}
          <div className="input-login-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-login-field"
              placeholder=" "
              required
            />
            <label className="input-login-label">Full Name</label>
          </div>
          <div className="input-login-group">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input-login-field"
              placeholder=" "
              required
            />
            <label className="input-login-label">Username</label>
          </div>
          <div className="input-login-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-login-field"
              placeholder=" "
              required
            />
            <label className="input-login-label">Email</label>
          </div>
          <div className="input-login-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-login-field"
              placeholder=" "
              required
            />
            <label className="input-login-label">Password</label>
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <div className="links">
          <p>
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;