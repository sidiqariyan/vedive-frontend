import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import jwtDecode from "jwt-decode";
import logoImg from "../assets/Vedive.png"; // Make sure your logo is in this path
import Google from "../assets/google-icon.svg";
import backgroundImage from "../assets/loginbackground.png";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for input fields
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // State for input focus
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // State for error messages and loading state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Use HTTPS for API_URL to avoid mixed content errors
  const API_URL = "https://vedive.com:3000";

  // Check if the user is already authenticated and redirect them to the dashboard
  const checkAuthAndRedirect = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // decoded.exp is in seconds; compare with current time in milliseconds
        if (decoded.exp * 1000 > Date.now()) {
          navigate("/dashboard");
          return true;
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
      }
    }
    return false;
  };

  useEffect(() => {
    if (checkAuthAndRedirect()) return;
  }, [navigate]);

  // Handle token from URL (if any)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          setError("Your session has expired. Please log in again.");
          navigate("/login");
          return;
        }
        localStorage.setItem("token", token);
        navigate("/dashboard");
      } catch (err) {
        console.error("Invalid token:", err);
        setError("Invalid session. Please log in again.");
        navigate("/login");
      }
    }
  }, [location, navigate]);

  // Handle email/password login using the Fetch API
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include", // Send cookies with the request
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      // If the response is not ok, extract the error message and throw an error
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      setEmailOrUsername("");
      setPassword("");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "An unexpected error occurred. Please check your connection or server status.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
<div 
  className="min-h-screen flex flex-col text-white bg-cover bg-center bg-no-repeat bg-blend-overlay"
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
            /* Override autofill background and text color */
            input:-webkit-autofill,
            input:-webkit-autofill:hover, 
            input:-webkit-autofill:focus,
            input:-webkit-autofill:active {
              -webkit-box-shadow: 0 0 0 30px #0f172a inset !important;
              -webkit-text-fill-color: white !important;
              transition: background-color 5000s ease-in-out 0s;
            }
          `}</style>
    
          {/* Center Container - Added flex-grow and flex centering */}
          <div className="flex-grow flex items-center justify-center">
    
      {/* Login Container */}
      <div className="max-w-lg w-full mx-4 md:mx-auto p-0 md:p-8 rounded-lg mb-[163px]">
      <h2 className="font-[400] text-[30px] sm:text-[30px] md:text-[32px] lg:text-[34px] leading-[100%] tracking-[0] text-center mb-4 font-primary ">
          Welcome to Vedive
        </h2>
        <div className="flex items-center my-6 ">
          <hr className="flex-grow border-t-[3px] border-third" />
        </div>
        
        {/* Google Sign In Button */}
        {/* <button className="flex items-center justify-center w-full py-3 h-[55px] px-4 mb-6 border-2 border-white rounded-md bg-transparent text-white hover:bg-blue-900/20 transition-colors">
          <img src={Google} alt="Google logo" className="h-16 w-16 " />
          <span className="font-poppins font-medium leading-[100%] tracking-[0] 
                          sm:text-[20px] md:text-[20px] lg:text-[20px]">
            Continue with Google
          </span>
        </button> */}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email/Username Input with Floating Label */}
          <div className="relative">
            <input
              type="text"
              id="email"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(emailOrUsername.length > 0)}
              className="w-full px-3.5 py-3 h-[55px] text-[18px] font-poppins bg-transparent border-2 border-white rounded-md text-white outline-none focus:border-blue-400 pt-9"
              placeholder=" "
              required
              aria-label="Email or Username"
            />
            <label
              htmlFor="email"
              className={`absolute transition-all duration-200 pointer-events-none text-gray-400
                ${emailFocused || emailOrUsername 
                  ? 'text-xs top-2 left-4' 
                  : 'text-base top-1/2 left-4 transform -translate-y-1/2'}
              `}
            >
              Email or Username
            </label>
          </div>

          {/* Password Input with Floating Label */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(password.length > 0)}
              className="w-full px-3.5 py-3 h-[55px] text-[18px] font-poppins bg-transparent border-2 border-white rounded-md text-white outline-none focus:border-blue-400 pt-9"
              placeholder=" "
              required
              aria-label="Password"
            />
            <label
              htmlFor="password"
              className={`absolute transition-all duration-200 pointer-events-none text-gray-400
                ${passwordFocused || password 
                  ? 'text-xs top-2 left-4' 
                  : 'text-base top-1/2 left-4 transform -translate-y-1/2'}
              `}
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

          {/* Display error messages */}
          {error && <p className="text-red-400 text-sm">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="block mx-auto max-w-[320px] w-full py-3 px-4 bg-white text-black rounded-md 
                   font-poppins font-medium text-[18px] leading-[100%] tracking-[0] 
                   hover:bg-blue-50 transition-colors 
                   sm:text-[16px] md:text-[18px] lg:text-[20px]"
            disabled={loading}
            aria-label="Login"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Additional Links */}
        <div className="mt-6 text-center text-sm">
          <Link to="/pass-reset" className="text-blue-400 hover:text-blue-300 font-poppins text-[16px] font-medium" aria-label="Forgot Password">
            Forgot Password?
          </Link>
          <p className="mt-4 font-poppins text-[16px] font-medium text-white/80">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300" aria-label="Sign Up">
              Sign Up
            </Link>
          </p>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Login;