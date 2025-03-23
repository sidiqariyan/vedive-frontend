import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Passreset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch("https://ec2-51-21-1-175.eu-north-1.compute.amazonaws.com:3000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset link.");
      }

      setMessage("Reset link sent to your email.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div>
      <header className="login-header">
        <img src={Vedive} alt="logo" />
      </header>
      <div className="login-container">
        <h2>Trouble with logging in?</h2>
        <p>
          Enter your email address, and we’ll send you a link to reset your
          password.
        </p>
        <hr className="login-hr" />
        <form onSubmit={handleSubmit}>
          <div className="input-login-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-login-field"
              placeholder=" "
              required
            />
            <label className="input-login-label">Email</label>
          </div>
          {message && <p style={{ color: "green" }}>{message}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit" className="login-btn">
            Send Reset Link
          </button>
        </form>
        <div className="links">
          <Link to="/login" style={{ borderBottom: "solid 1px #0059FF" }}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Passreset;