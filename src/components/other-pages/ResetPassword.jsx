import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the token from the URL query parameters
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Validate that passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* Header Section */}

      {/* Reset Password Container */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Reset Password
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* New Password Input */}
          <div className="relative mb-4">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-300 peer"
              placeholder=" "
              required
              aria-label="New Password"
            />
            <label
              htmlFor="newPassword"
              className="absolute left-4 top-2 text-gray-500 text-sm transition-all duration-300 pointer-events-none peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-blue-500"
            >
              New Password
            </label>
          </div>

          {/* Confirm Password Input */}
          <div className="relative mb-4">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-300 peer"
              placeholder=" "
              required
              aria-label="Confirm Password"
            />
            <label
              htmlFor="confirmPassword"
              className="absolute left-4 top-2 text-gray-500 text-sm transition-all duration-300 pointer-events-none peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-blue-500"
            >
              Confirm Password
            </label>
          </div>

          {/* Success or Error Messages */}
          {message && (
            <p className="text-green-600 text-sm text-center mb-4">
              {message}
            </p>
          )}
          {error && (
            <p className="text-red-600 text-sm text-center mb-4">{error}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
            aria-label="Reset Password"
          >
            Reset Password
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 text-sm border-b border-blue-600 transition duration-300"
            aria-label="Back to Login"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;