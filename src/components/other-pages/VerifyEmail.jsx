import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyEmail = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");

      if (!token) {
        setError("Invalid verification link.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/api/auth/verify-email?token=${token}`
        );
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Verification failed.");
        } else {
          setMessage(data.message);
          localStorage.setItem("token", data.token); // Save the token securely
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