import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyEmail = () => {
  const API_URL = "https://vedive.com:3000";
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const [resending, setResending] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get("token");
      
      if (!token) {
        setError("Invalid verification link. Please check your email for the correct link.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/auth/verify-email?token=${token}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        const data = await response.json();

        if (!response.ok) {
          console.log('Verification failed:', data); // Debug log
          setError(data.error || "Verification failed.");
          
          // Check for expired token
          if (data.expired || 
              data.error?.includes("expired") || 
              data.error?.includes("Verification link has expired")) {
            setIsExpired(true);
          }
        } else {
          setMessage(data.message);
          localStorage.setItem("token", data.token);
          
          // Start countdown
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                navigate("/dashboard");
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          return () => clearInterval(timer);
        }
      } catch (err) {
        console.error('Verification error:', err);
        setError("Network error occurred. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [location, navigate]);

  const handleResendVerification = async () => {
    if (!userEmail) {
      setError("Please enter your email address to resend verification.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setResending(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to resend verification email.");
      } else {
        setMessage(data.message || "Verification email sent successfully! Please check your inbox and spam folder. The new link will expire in 15 minutes.");
        setIsExpired(false);
        setUserEmail(""); // Clear email field
      }
    } catch (err) {
      console.error('Resend error:', err);
      setError("Network error occurred. Please check your connection and try again.");
    } finally {
      setResending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !resending && userEmail) {
      handleResendVerification();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Verifying your email...</h2>
          <p className="text-gray-500 mt-2">Please wait while we verify your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            VEDIVE
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">Email Verification</h1>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-green-800 font-medium">{message}</p>
                {message.includes("successfully") && !message.includes("sent") && (
                  <p className="text-green-600 text-sm mt-1">
                    Redirecting to dashboard in {countdown} seconds...
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {isExpired && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-yellow-800 font-medium">Verification Link Expired</p>
                <p className="text-yellow-700 text-sm mt-1">
                  Your verification link has expired (links expire after 15 minutes for security). 
                  Enter your email below to receive a new verification link.
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  required
                  autoComplete="email"
                />
              </div>
              
              <button
                onClick={handleResendVerification}
                disabled={resending || !userEmail.trim()}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                  resending || !userEmail.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transform hover:scale-105'
                }`}
              >
                {resending ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Resend Verification Email (15 min expiry)'
                )}
              </button>
              
              <p className="text-xs text-gray-500 text-center">
                The new verification link will expire in 15 minutes for security.
              </p>
            </div>
          </div>
        )}

        {!message && !isExpired && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Verification Failed</h3>
            <p className="text-gray-600">
              We couldn't verify your email address. The link may be invalid or expired.
              Please try clicking the verification link in your email again, or request a new one.
            </p>
            <button
              onClick={() => setIsExpired(true)}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Request New Verification Link
            </button>
          </div>
        )}

        {message && message.includes("Email verified successfully") && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Email Verified Successfully!</h3>
            <p className="text-gray-600">
              Your account has been verified. You'll be redirected to your dashboard in {countdown} seconds.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-1000" 
                style={{width: `${((3 - countdown) / 3) * 100}%`}}
              ></div>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              Go to Dashboard Now
            </button>
          </div>
        )}

        <div className="text-center mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? Contact us at{' '}
            <a href="mailto:info@vedive.com" className="text-purple-600 hover:text-purple-700 font-medium">
              info@vedive.com
            </a>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Verification links expire after 15 minutes for your security.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;