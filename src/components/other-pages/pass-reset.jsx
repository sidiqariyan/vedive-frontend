import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Vedive from "../assets/Vedive.png";
import Google from "../assets/google-icon.svg";

const API_URL = "https://ec2-51-21-1-175.eu-north-1.compute.amazonaws.com:3000";

const checkAuthAndRedirect = (navigate) => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 > Date.now()) {
        navigate("/dashboard");
        return true;
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
    }
  }
  return false;
};

export const Passreset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (checkAuthAndRedirect(navigate)) return;
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Trouble with logging in?
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Enter your email address, and we’ll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md"
              placeholder="Email"
              required
            />
          </div>
          {message && <p className="text-green-600 text-sm text-center mb-4">{message}</p>}
          {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">
            Send Reset Link
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/login" className="text-blue-600">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Passreset;
