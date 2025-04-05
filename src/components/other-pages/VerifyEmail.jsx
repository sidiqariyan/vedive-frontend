import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyEmail = () => {
  const API_URL = "http://ec2-51-21-1-175.eu-north-1.compute.amazonaws.com:3000";
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      // Extract token from URL query parameters
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");

      if (!token) {
        setError("Invalid verification link.");
        return;
      }

      try {
        // Call the backend verification endpoint with the token
        const response = await fetch(
          `${API_URL}/api/auth/verify-email?token=${token}`
        );
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Verification failed.");
        } else {
          setMessage(data.message);
          // Save the auth token returned by the backend securely in local storage
          localStorage.setItem("token", data.token);
          // Redirect to the dashboard after a 3-second delay
          setTimeout(() => navigate("/dashboard"), 3000);
        }
      } catch (err) {
        setError("An unexpected error occurred. Please try again.");
      }
    };

    verifyEmail();
  }, [location, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default VerifyEmail;
