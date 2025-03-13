import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const LoginOrSignup = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");

    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the token
        if (decoded.exp * 1000 < Date.now()) {
          console.error("Token has expired");
          navigate("/login"); // Redirect to login if token is expired
          return;
        }
        localStorage.setItem("token", token); // Store token in localStorage
        navigate("/dashboard"); // Redirect to dashboard
      } catch (error) {
        console.error("Invalid token:", error);
        navigate("/login"); // Redirect to login if token is invalid
      }
    }
  }, [location, navigate]);

  return null; // This component doesn't render anything
};

export default LoginOrSignup;