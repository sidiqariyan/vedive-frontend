import React, { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import logoImg from "../assets/Vedive.png";
import Google from "../assets/google-icon.svg";
import backgroundImage from "../assets/background-login.png";
import { Link } from 'react-router-dom';

const API_URL = "https://vedive.com:3000"; 

const checkAuthAndRedirect = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 > Date.now()) {
        window.location.href = "/dashboard";
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

const Signup = () => {
  const [initialized, setInitialized] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (checkAuthAndRedirect()) return;
    setInitialized(true);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    let timer;
    if (message) {
      // ✅ Delay redirect until token is stored
      timer = setTimeout(() => {
        window.location.href = "/dashboard";
        setFormData({ name: "", username: "", email: "", password: "" });
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Registration failed.");
      }

      // ✅ Store token and user in localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setMessage(data.message);
    } catch (err) {
      console.error("Signup failed:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!initialized) return null;

  return (
    <div 
      className="min-h-screen flex flex-col text-white bg-[rgb(3,10,24)] bg-cover bg-center bg-no-repeat bg-blend-overlay"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Header Section */}
      <header className="p-2 ml-2.5">
        <Link to="/">
          <img
            src={logoImg}
            alt="Vedive Logo"
            className="w-[98px] h-[23px] sm:w-[98px] sm:h-[23px] lg:w-[140px] lg:h-[35.5px]"
          />
        </Link>
      </header>

      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px #0f172a inset !important;
          -webkit-text-fill-color: white !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      {/* Center Container */}
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-lg w-full mx-4 md:mx-auto p-0 md:p-8 rounded-lg">
          <h2 className="font-[400] text-[30px] sm:text-[30px] md:text-[32px] lg:text-[34px] leading-[100%] tracking-[0] text-center mb-4 font-dmsans">
            Sign Up to Vedive
          </h2>
          
          <div className="flex items-center my-6">
            <hr className="flex-grow border-t-[3px] border-third" />
          </div>
          
          {/* Google Sign Up Button */}
          <button
            onClick={handleGoogleSignup}
            type="button"
            className="flex items-center justify-center w-full py-3 h-[55px] px-4 mb-6 border-2 border-white rounded-md bg-transparent text-white hover:bg-blue-900/20 transition-colors"
          >
            <img src={Google} alt="Google logo" className="h-6 w-6 mr-2" />
            <span className="font-poppins font-medium text-[20px]">
              Continue with Google
            </span>
          </button>

          {/* Rest of your form code remains the same */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Full Name Input */}
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(formData.name.length > 0)}
                className="w-full px-3.5 py-3 h-[55px] text-[18px] font-poppins bg-transparent border-2 border-white rounded-md text-white outline-none focus:border-blue-400 pt-9"
                placeholder=" "
                required
                aria-label="Full Name"
              />
              <label
                htmlFor="name"
                className={`absolute transition-all duration-200 pointer-events-none text-gray-400 ${
                  nameFocused || formData.name 
                    ? 'text-xs top-2 left-4' 
                    : 'text-base top-1/2 left-4 transform -translate-y-1/2'
                }`}
              >
                Full Name
              </label>
            </div>

            {/* Username Input */}
            <div className="relative">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onFocus={() => setUsernameFocused(true)}
                onBlur={() => setUsernameFocused(formData.username.length > 0)}
                className="w-full px-3.5 py-3 h-[55px] text-[18px] font-poppins bg-transparent border-2 border-white rounded-md text-white outline-none focus:border-blue-400 pt-9"
                placeholder=" "
                required
                aria-label="Username"
              />
              <label
                htmlFor="username"
                className={`absolute transition-all duration-200 pointer-events-none text-gray-400 ${
                  usernameFocused || formData.username 
                    ? 'text-xs top-2 left-4' 
                    : 'text-base top-1/2 left-4 transform -translate-y-1/2'
                }`}
              >
                Username
              </label>
            </div>

            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(formData.email.length > 0)}
                className="w-full px-3.5 py-3 h-[55px] text-[18px] font-poppins bg-transparent border-2 border-white rounded-md text-white outline-none focus:border-blue-400 pt-9"
                placeholder=" "
                required
                aria-label="Email"
              />
              <label
                htmlFor="email"
                className={`absolute transition-all duration-200 pointer-events-none text-gray-400 ${
                  emailFocused || formData.email 
                    ? 'text-xs top-2 left-4' 
                    : 'text-base top-1/2 left-4 transform -translate-y-1/2'
                }`}
              >
                Email
              </label>
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(formData.password.length > 0)}
                className="w-full px-3.5 py-3 h-[55px] text-[18px] font-poppins bg-transparent border-2 border-white rounded-md text-white outline-none focus:border-blue-400 pt-9"
                placeholder=" "
                required
                aria-label="Password"
              />
              <label
                htmlFor="password"
                className={`absolute transition-all duration-200 pointer-events-none text-gray-400 ${
                  passwordFocused || formData.password 
                    ? 'text-xs top-2 left-4' 
                    : 'text-base top-1/2 left-4 transform -translate-y-1/2'
                }`}
              >
                Password
              </label>
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Messages */}
            {message && <p className="text-green-400 text-sm">{message}</p>}
            {error && <p className="text-red-400 text-sm">{error}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              className="block mx-auto max-w-[320px] w-full py-3 px-4 bg-white text-black rounded-md 
                     font-poppins font-medium text-[18px] leading-[100%] tracking-[0] 
                     hover:bg-blue-50 transition-colors 
                     sm:text-[16px] md:text-[18px] lg:text-[20px]"
              disabled={loading}
              aria-label="Sign Up"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm">
            <p className="font-poppins text-[16px] font-medium text-white/80">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400 hover:text-blue-300" aria-label="Login">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;