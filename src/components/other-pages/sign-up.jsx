import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import logoImg from "../assets/Vedive.png";
import backgroundImage from "../assets/background-login.png";

const API_URL = "https://vedive.com:3000";

// Custom hook for authentication
const useAuth = () => {
  const navigate = useNavigate();
  
  const checkAuthAndRedirect = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 > Date.now()) {
        navigate("/dashboard");
        return true;
      }
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
    }
    return false;
  }, [navigate]);
  
  return { checkAuthAndRedirect };
};

// Custom hook for form management
const useSignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  
  const [focusState, setFocusState] = useState({
    name: false,
    username: false,
    email: false,
    password: false,
  });
  
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const handleFocus = useCallback((field) => {
    setFocusState(prev => ({ ...prev, [field]: true }));
  }, []);
  
  const handleBlur = useCallback((field) => {
    setFocusState(prev => ({ ...prev, [field]: formData[field].length > 0 }));
  }, [formData]);
  
  const resetForm = useCallback(() => {
    setFormData({ name: "", username: "", email: "", password: "" });
    setFocusState({ name: false, username: false, email: false, password: false });
  }, []);
  
  return {
    formData,
    focusState,
    handleChange,
    handleFocus,
    handleBlur,
    resetForm
  };
};

// Reusable FloatingInput component
const FloatingInput = React.memo(({ 
  id, 
  name, 
  type = "text", 
  value, 
  onChange, 
  onFocus, 
  onBlur, 
  label, 
  focused, 
  required = false,
  children 
}) => (
  <div className="relative">
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      className="w-full px-3.5 py-3 h-[55px] text-[18px] font-poppins bg-transparent border-2 border-white rounded-md text-white outline-none focus:border-blue-400 pt-9"
      placeholder=" "
      required={required}
      aria-label={label}
    />
    <label
      htmlFor={id}
      className={`absolute transition-all duration-200 pointer-events-none text-gray-400 ${
        focused || value 
          ? 'text-xs top-2 left-4' 
          : 'text-base top-1/2 left-4 transform -translate-y-1/2'
      }`}
    >
      {label}
    </label>
    {children}
  </div>
));

FloatingInput.displayName = 'FloatingInput';

// Eye icon components
const EyeIcon = React.memo(() => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
));

const EyeOffIcon = React.memo(() => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
));

EyeIcon.displayName = 'EyeIcon';
EyeOffIcon.displayName = 'EyeOffIcon';

const Signup = () => {
  const [initialized, setInitialized] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { checkAuthAndRedirect } = useAuth();
  const { formData, focusState, handleChange, handleFocus, handleBlur, resetForm } = useSignupForm();

  // Memoized styles to prevent re-creation
  const autofillStyles = useMemo(() => `
    /* Override autofill background and text color */
    input:-webkit-autofill,
    input:-webkit-autofill:hover, 
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 30px #0f172a inset !important;
      -webkit-text-fill-color: white !important;
      transition: background-color 5000s ease-in-out 0s;
    }
  `, []);

  const backgroundStyle = useMemo(() => ({
    backgroundImage: `url(${backgroundImage})`
  }), []);

  // Initialize component
  useEffect(() => {
    if (checkAuthAndRedirect()) return;
    setInitialized(true);
  }, [checkAuthAndRedirect]);

  // Handle success message and redirect
  useEffect(() => {
    if (!message) return;
    
    const timer = setTimeout(() => {
      navigate("/dashboard");
      resetForm();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [message, navigate, resetForm]);

  const handleSubmit = useCallback(async (e) => {
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
      
      setMessage(data.message);
    } catch (err) {
      console.error("Signup failed:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [formData]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // Form fields configuration
  const formFields = useMemo(() => [
    { id: 'name', name: 'name', type: 'text', label: 'Full Name' },
    { id: 'username', name: 'username', type: 'text', label: 'Username' },
    { id: 'email', name: 'email', type: 'email', label: 'Email' },
  ], []);

  if (!initialized) return null;

  return (
    <div 
      className="min-h-screen flex flex-col text-white bg-[rgb(3,10,24)] bg-cover bg-center bg-no-repeat bg-blend-overlay"
      style={backgroundStyle}
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
      
      <style>{autofillStyles}</style>

      {/* Center Container */}
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-lg w-full mx-4 md:mx-auto p-0 md:p-8 rounded-lg">
          <h2 className="font-[400] text-[30px] sm:text-[30px] md:text-[32px] lg:text-[34px] leading-[100%] tracking-[0] text-center mb-4 font-dmsans">
            Sign Up to Vedive
          </h2>
          
          <div className="flex items-center my-6">
            <hr className="flex-grow border-t-[3px] border-third" />
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Regular form fields */}
            {formFields.map(({ id, name, type, label }) => (
              <FloatingInput
                key={id}
                id={id}
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                onFocus={() => handleFocus(name)}
                onBlur={() => handleBlur(name)}
                label={label}
                focused={focusState[name]}
                required
              />
            ))}

            {/* Password field with toggle */}
            <FloatingInput
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              onFocus={() => handleFocus('password')}
              onBlur={() => handleBlur('password')}
              label="Password"
              focused={focusState.password}
              required
            >
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </FloatingInput>

            {/* Messages */}
            {message && <p className="text-green-400 text-sm" role="status">{message}</p>}
            {error && <p className="text-red-400 text-sm" role="alert">{error}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              className="block mx-auto max-w-[320px] w-full py-3 px-4 bg-white text-black rounded-md 
                         font-poppins font-medium text-[18px] leading-[100%] tracking-[0] 
                         hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                         sm:text-[16px] md:text-[18px] lg:text-[20px]"
              disabled={loading}
              aria-label="Sign Up"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Additional Links */}
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