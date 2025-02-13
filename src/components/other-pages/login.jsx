import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./secondarystyles.css";
import Vedive from "../assets/Vedive.png";
import Google from "../assets/google-icon.svg";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "An error occurred during login.");
        return;
      }

      localStorage.setItem("token", data.token);
      navigate("/dashboard"); // Redirect to dashboard after login
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div>
      <header className="login-header">
        <img src={Vedive} alt="logo" />
      </header>
      <div className="login-container">
        <h2>Login to Vedive</h2>
        <hr className="login-hr" />
        <form onSubmit={handleLogin}>
          <button className="google-btn">
            <img src={Google} alt="Google Icon" /> Continue with Google
          </button>

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
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
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
