import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation, Outlet } from "react-router-dom";
import logo from "../assets/Vedive.png";
import mailIcon from "./assets/mail.svg";
import whatsappIcon from "./assets/whatsapp.svg";
import numberIcon from "./assets/number.svg";
import gmailIcon from "./assets/gmail.svg";
import mailScraperIcon from "./assets/mail-scraper.svg";

const MainLayout = () => {
  const API_URL = "https://vedive.com:3000";
  // const API_URL = "https://ec2-51-21-1-175.eu-north-1.compute.amazonaws.com:3000";
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // List of routes that require a paid plan
  const protectedRoutes = ["/gmail-sender", "/email-scraper", "/number-scraper"];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        
        // Fetch user authentication data
        const userResponse = await fetch(`${API_URL}/api/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (!userResponse.ok) {
          if (userResponse.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          throw new Error(`HTTP error: ${userResponse.status}`);
        }
        
        const userData = await userResponse.json();
        
        // Fetch subscription status
        const subscriptionResponse = await fetch(`${API_URL}/api/subscription/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (subscriptionResponse.ok) {
          const subscriptionData = await subscriptionResponse.json();
          // Combine user data with subscription data
          userData.currentPlan = subscriptionData.currentPlan.charAt(0).toUpperCase() + 
                                 subscriptionData.currentPlan.slice(1); // Capitalize first letter
        }
        
        setUser(userData);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  useEffect(() => {
    if (protectedRoutes.includes(location.pathname) && 
        user && 
        user.currentPlan && 
        user.currentPlan.toLowerCase() === "free") {
      navigate("/plan");
    }
  }, [location, user, navigate]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleNavLinkClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const hasAccess = (feature) => {
    if (feature === "paid-tools") {
      return user?.currentPlan && user.currentPlan.toLowerCase() !== "free";
    }
    return true;
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (error) return <div className="error p-4 bg-red-600 text-white">An error occurred: {error}</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-zinc-800 text-white relative overflow-hidden">
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}
      <div
        className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 fixed lg:relative z-30 w-64 h-full
          bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-sm
          border-r border-gray-700/50 transition-transform duration-300
        `}
      >
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <NavLink to="/">
                <img src={logo} alt="Vedive Logo" className="w-[150px] mb-2" />     
                </NavLink>
              </div>
            </div>
            <button
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
              onClick={toggleSidebar}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-4 flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
              <span className="text-xs font-bold">
                {user?.name?.split(" ").map((n) => n[0]).join("") || "U"}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.name || "User"}</p>
              <p className="text-xs text-gray-400">
                {user?.currentPlan && user.currentPlan !== "Free" ? `${user.currentPlan} Plan` : "Free User"}
              </p>
            </div>
          </div>
        </div>
        <nav className="mt-6 px-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition duration-200 ${
                isActive ? "bg-blue-600 text-white shadow-lg" : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
              }`
            }
            onClick={handleNavLinkClick}
          >
            <svg className="mr-3 h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Dashboard
          </NavLink>
          <NavLink
            to="/email-sender"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 mt-1 text-sm font-medium rounded-lg transition duration-200 ${
                isActive ? "bg-third text-white shadow-lg" : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
              }`
            }
            onClick={handleNavLinkClick}
          >
            <img src={mailIcon} alt="Email" className="mr-3 h-5 w-5 text-gray-400" />
            Email Sender
          </NavLink>
          <NavLink
            to="/whatsapp-sender"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 mt-1 text-sm font-medium rounded-lg transition duration-200 ${
                isActive ? "bg-third text-white shadow-lg" : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
              }`
            }
            onClick={handleNavLinkClick}
          >
            <img src={whatsappIcon} alt="WhatsApp" className="mr-3 h-5 w-5 text-gray-400" />
            Whatsapp Sender
          </NavLink>
          <div
            className={`flex items-center px-4 py-3 mt-1 text-sm font-medium rounded-lg transition duration-200 cursor-pointer ${
              hasAccess("paid-tools")
                ? "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                : "text-gray-500 relative group"
            }`}
            onClick={() => {
              if (hasAccess("paid-tools")) {
                navigate("/gmail-sender");
                handleNavLinkClick();
              } else {
                navigate("/plan");
                handleNavLinkClick();
              }
            }}
          >
            <img src={gmailIcon} alt="Gmail" className="mr-3 h-5 w-5 text-gray-400" />
            Gmail Sender
            {!hasAccess("paid-tools") && (
              <>
                <svg className="ml-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded hidden group-hover:block w-32">
                  Upgrade to access
                </div>
              </>
            )}
          </div>
          <div
            className={`flex items-center px-4 py-3 mt-1 text-sm font-medium rounded-lg transition duration-200 cursor-pointer ${
              hasAccess("paid-tools")
                ? "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                : "text-gray-500 relative group"
            }`}
            onClick={() => {
              if (hasAccess("paid-tools")) {
                navigate("/email-scraper");
                handleNavLinkClick();
              } else {
                navigate("/plan");
                handleNavLinkClick();
              }
            }}
          >
            <img src={mailScraperIcon} alt="Email Scraper" className="mr-3 h-5 w-5 text-gray-400" />
            Email Scraper
            {!hasAccess("paid-tools") && (
              <>
                <svg className="ml-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded hidden group-hover:block w-32">
                  Upgrade to access
                </div>
              </>
            )}
          </div>
          {/* <div
            className={`flex items-center px-4 py-3 mt-1 text-sm font-medium rounded-lg transition duration-200 cursor-pointer ${
              hasAccess("paid-tools")
                ? "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                : "text-gray-500 relative group"
            }`}
            onClick={() => {
              if (hasAccess("paid-tools")) {
                navigate("/number-scraper");
                handleNavLinkClick();
              } else {
                navigate("/plan");
                handleNavLinkClick();
              }
            }}
          >
            <img src={numberIcon} alt="Number Scraper" className="mr-3 h-5 w-5 text-gray-400" />
            Number Scraper
            {!hasAccess("paid-tools") && (
              <>
                <svg className="ml-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded hidden group-hover:block w-32">
                  Upgrade to access
                </div>
              </>
            )}
          </div> */}
          <NavLink
            to="/account"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 mt-1 text-sm font-medium rounded-lg transition duration-200 ${
                isActive ? "bg-third text-white shadow-lg" : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
              }`
            }
            onClick={handleNavLinkClick}
          >
            <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Account
          </NavLink>
          <NavLink
            to="/plan"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 mt-1 text-sm font-medium rounded-lg transition duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
              }`
            }
            onClick={handleNavLinkClick}
          >
            <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Subscription Plan
          </NavLink>
        </nav>
      </div>
      <div className="flex-1 flex flex-col overflow-auto relative">
        <button
          className={`lg:hidden fixed top-2 left-2 z-10  rounded-lg p-2 text-gray-400 hover:text-white transition-colors ${sidebarOpen ? "hidden" : "block"}`}
          onClick={toggleSidebar}
        >
<svg 
  className="h-8 w-8" 
  fill="none" 
  viewBox="0 0 24 24" 
  style={{ stroke: "black" }}
>
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
</svg>        </button>
        <div className="flex-1 min-h-screen">
          {/* This is the key change - using Outlet to render nested routes */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;