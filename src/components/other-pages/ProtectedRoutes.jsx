import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import jwtDecode from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Function to validate the token
  const isValidToken = (token) => {
    try {
      const decoded = jwtDecode(token); // Decode the token
      return decoded.exp * 1000 > Date.now(); // Check if token is not expired
    } catch (error) {
      console.error("Invalid token:", error);
      return false; // Invalid or corrupted token
    }
  };

  // If no token or token is invalid, redirect to login
  if (!token || !isValidToken(token)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If token is valid, render the protected content
  return children;
};

export default ProtectedRoute;