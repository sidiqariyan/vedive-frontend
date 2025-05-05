import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import jwtDecode from "jwt-decode";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  const isValidToken = token => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  if (!token || !isValidToken(token)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}