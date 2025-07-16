import React, { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import logoImg from "../assets/Vedive.png";
import Google from "../assets/google-icon.svg";
import backgroundImage from "../assets/background-login.png";
import { Link } from 'react-router-dom';

const API_URL = "http://localhost:3000"; 

// Country list with popular countries at the top
const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "India", "Japan", "China", "Brazil",
  "Afghanistan", "Albania", "Algeria", "Argentina", "Armenia", "Austria", "Bangladesh", "Belgium", "Bolivia", "Bulgaria",
  "Cambodia", "Chile", "Colombia", "Croatia", "Czech Republic", "Denmark", "Ecuador", "Egypt", "Estonia", "Ethiopia",
  "Finland", "Ghana", "Greece", "Hungary", "Iceland", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Latvia", "Lebanon", "Lithuania", "Luxembourg", "Malaysia", "Mexico",
  "Morocco", "Netherlands", "New Zealand", "Nigeria", "Norway", "Pakistan", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar", "Romania", "Russia", "Saudi Arabia", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea",
  "Spain", "Sri Lanka", "Sweden", "Switzerland", "Thailand", "Turkey", "Ukraine", "United Arab Emirates", "Uruguay",
  "Venezuela", "Vietnam", "Zimbabwe"
];

// Industry options
const INDUSTRIES = [
  "Technology/Software", "Healthcare/Medical", "Finance/Banking", "Education", "Retail/E-commerce", "Manufacturing",
  "Real Estate", "Marketing/Advertising", "Consulting", "Legal Services", "Construction", "Transportation/Logistics",
  "Food & Beverage", "Entertainment/Media", "Non-profit", "Government", "Energy/Utilities", "Agriculture",
  "Telecommunications", "Insurance", "Automotive", "Aerospace", "Biotechnology", "Fashion/Apparel", "Travel/Tourism",
  "Sports/Recreation", "Architecture", "Interior Design", "Photography", "Other"
];

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
  const [currentStep, setCurrentStep] = useState(1); // Step 1: Basic info, Step 2: Business info
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    companyName: "",
    country: "",
    industry: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Focus state variables for step 1
  const [nameFocused, setNameFocused] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  // Focus state variables for step 2
  const [companyNameFocused, setCompanyNameFocused] = useState(false);
  const [countryFocused, setCountryFocused] = useState(false);
  const [industryFocused, setIndustryFocused] = useState(false);

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
      timer = setTimeout(() => {
        window.location.href = "/dashboard";
        setFormData({ 
          name: "", 
          username: "", 
          email: "", 
          password: "",
          companyName: "",
          country: "",
          industry: ""
        });
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [message]);

  const handleStep1Submit = (e) => {
    e.preventDefault();
    setError(null);

    // Validate step 1 fields
    if (!formData.name.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!formData.username.trim()) {
      setError("Username is required.");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!formData.password.trim()) {
      setError("Password is required.");
      return;
    }

    // Move to step 2
    setCurrentStep(2);
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    // Validate step 2 fields
    if (!formData.companyName.trim()) {
      setError("Company/Business name is required.");
      return;
    }
    if (!formData.country.trim()) {
      setError("Country is required.");
      return;
    }
    if (!formData.industry.trim()) {
      setError("Industry is required.");
      return;
    }

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
  };

  const handleGoogleSignup = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const goBackToStep1 = () => {
    setCurrentStep(1);
    setError(null);
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
        input:-webkit-autofill:active,
        select:-webkit-autofill,
        select:-webkit-autofill:hover, 
        select:-webkit-autofill:focus,
        select:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px #0f172a inset !important;
          -webkit-text-fill-color: white !important;
          transition: background-color 5000s ease-in-out 0s;
        }
        
        select option {
          background-color: #0f172a;
          color: white;
        }
      `}</style>

      {/* Center Container */}
      <div className="flex-grow flex items-center justify-center py-8">
        <div className="max-w-lg w-full mx-4 md:mx-auto p-0 md:p-8 rounded-lg">
          <h2 className="font-[400] text-[30px] sm:text-[30px] md:text-[32px] lg:text-[34px] leading-[100%] tracking-[0] text-center mb-4 font-dmsans">
            {currentStep === 1 ? 'Sign Up to Vedive' : 'Complete Your Profile'}
          </h2>
          
          {/* Step indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'
              }`}>
                1
              </div>
              <div className={`w-8 h-1 ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'
              }`}>
                2
              </div>
            </div>
          </div>

          {currentStep === 1 && (
            <>
              <div className="flex items-center my-6">
                <hr className="flex-grow border-t-[3px] border-third" />
              </div>
              
              {/* Google Sign Up Button */}
              <button
                onClick={handleGoogleSignup}
                type="button"
                className="flex items-center justify-center w-full py-3 h-[55px] px-4 mb-6 border-2 border-white rounded-md bg-transparent text-white hover:bg-blue-900/20 transition-colors"
              >
                <img src={Google} alt="Google logo" className="h-12 w-12 mr-2" />
                <span className="font-poppins font-medium text-[20px]">
                  Continue with Google
                </span>
              </button>

              <form onSubmit={handleStep1Submit} className="space-y-6">
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

                {/* Error message for step 1 */}
                {error && <p className="text-red-400 text-sm">{error}</p>}

                {/* Continue Button */}
                <button
                  type="submit"
                  className="block mx-auto max-w-[320px] w-full py-3 px-4 bg-white text-black rounded-md 
                         font-poppins font-medium text-[18px] leading-[100%] tracking-[0] 
                         hover:bg-blue-50 transition-colors 
                         sm:text-[16px] md:text-[18px] lg:text-[20px]"
                  aria-label="Continue"
                >
                  Continue
                </button>
              </form>
            </>
          )}

          {currentStep === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-6">
              {/* Company/Business Name Input */}
              <div className="relative">
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  onFocus={() => setCompanyNameFocused(true)}
                  onBlur={() => setCompanyNameFocused(formData.companyName.length > 0)}
                  className="w-full px-3.5 py-3 h-[55px] text-[18px] font-poppins bg-transparent border-2 border-white rounded-md text-white outline-none focus:border-blue-400 pt-9"
                  placeholder=" "
                  required
                  aria-label="Company/Business Name"
                />
                <label
                  htmlFor="companyName"
                  className={`absolute transition-all duration-200 pointer-events-none text-gray-400 ${
                    companyNameFocused || formData.companyName 
                      ? 'text-xs top-2 left-4' 
                      : 'text-base top-1/2 left-4 transform -translate-y-1/2'
                  }`}
                >
                  Company/Business Name
                </label>
              </div>
{/* Country Dropdown */}
<div className="relative">
  <select
    id="country"
    name="country"
    value={formData.country}
    onChange={handleChange}
    onFocus={() => setCountryFocused(true)}
    onBlur={() => setCountryFocused(formData.country !== "")}
    className="
      w-full 
      px-3.5 
      py-3      /* <-- smaller top+bottom padding */
      h-[55px] 
      text-[18px] 
      font-poppins 
      bg-transparent 
      border-2 
      border-white 
      rounded-md 
      text-white 
      outline-none 
      focus:border-blue-400 
      appearance-none 
      cursor-pointer
    "
    required
    aria-label="Country"
     style={{position: "relative", top: "5px"}}
  >
    {/* show this placeholder in the box when country="" */}
    <option value="" disabled>
      Select Country
    </option>
    {COUNTRIES.map((c) => (
      <option key={c} value={c}>
        {c}
      </option>
    ))}
  </select>
  <label
    htmlFor="country"
    className={`
      absolute 
      transition-all 
      duration-200 
      pointer-events-none 
      text-gray-400 
      ${
        countryFocused || formData.country
          ? "text-xs top-2 left-4"
          : "text-base top-1/2 left-4 transform -translate-y-1/2"
      }
    `}
  >
    Country
  </label>
  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
    <svg
      className="w-5 h-5 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </div>
</div>

{/* Industry Dropdown */}
<div className="relative">
  <select
    id="industry"
    name="industry"
    value={formData.industry}
    onChange={handleChange}
    onFocus={() => setIndustryFocused(true)}
    onBlur={() => setIndustryFocused(formData.industry !== "")}
    className="
      w-full 
      px-3.5  
      h-[55px] 
      text-[18px] 
      font-poppins 
      bg-transparent 
      border-2 
      border-white 
      rounded-md 
      text-white 
      outline-none 
      focus:border-blue-400 
      appearance-none 
      cursor-pointer
    "
    style={{position: "relative", top: "5px"}}
    required
    aria-label="Industry"
  >
    <option value="" disabled>
      Select Industry
    </option>
    {INDUSTRIES.map((i) => (
      <option key={i} value={i}>
        {i}
      </option>
    ))}
  </select>
  <label
    htmlFor="industry"
    className={`
      absolute 
      transition-all 
      duration-200 
      pointer-events-none 
      text-gray-400 
      ${
        industryFocused || formData.industry
          ? "text-xs top-2 left-4"
          : "text-base top-1/2 left-4 transform -translate-y-1/2"
      }
    `}
  >
    Industry
  </label>
  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
    <svg
      className="w-5 h-5 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </div>
</div>


              {/* Messages */}
              {message && <p className="text-green-400 text-sm">{message}</p>}
              {error && <p className="text-red-400 text-sm">{error}</p>}

              {/* Buttons */}
              <div className="flex flex-col space-y-4">
                {/* Create Account Button */}
                <button
                  type="submit"
                  className="block mx-auto max-w-[320px] w-full py-3 px-4 bg-white text-black rounded-md 
                         font-poppins font-medium text-[18px] leading-[100%] tracking-[0] 
                         hover:bg-blue-50 transition-colors 
                         sm:text-[16px] md:text-[18px] lg:text-[20px]"
                  disabled={loading}
                  aria-label="Create Account"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>

                {/* Back Button */}
                <button
                  type="button"
                  onClick={goBackToStep1}
                  className="block mx-auto max-w-[320px] w-full py-3 px-4 border-2 border-white bg-transparent text-white rounded-md 
                         font-poppins font-medium text-[18px] leading-[100%] tracking-[0] 
                         hover:bg-white/10 transition-colors 
                         sm:text-[16px] md:text-[18px] lg:text-[20px]"
                  aria-label="Go Back"
                >
                  Go Back
                </button>
              </div>
            </form>
          )}

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