import React, { useState, useEffect, useCallback, useMemo } from "react";
import { NavLink, useNavigate, useLocation, Outlet } from "react-router-dom";
import logo from "../assets/Vedive.png";
import mailIcon from "./assets/mail.svg";
import whatsappIcon from "./assets/whatsapp.svg";
import numberIcon from "./assets/number.svg";
import gmailIcon from "./assets/gmail.svg";
import mailScraperIcon from "./assets/mail-scraper.svg"; 

// Constants
const API_URL = "https://vedive.com:3000";
const PROTECTED_ROUTES = ["/email-scraper", "/number-scraper"];
const DESKTOP_BREAKPOINT = 1024;

// Custom hookss
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

const fetchUserData = useCallback(async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    
    const [userResponse, subscriptionResponse] = await Promise.all([
      fetch(`${API_URL}/api/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }),
      fetch(`${API_URL}/api/subscription/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
    ]);
    
    if (!userResponse.ok) {
      if (userResponse.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      throw new Error(`Authentication failed: ${userResponse.status}`);
    }
    
    const userData = await userResponse.json();
    
    if (subscriptionResponse.ok) {
      const subscriptionData = await subscriptionResponse.json();
      userData.currentPlan = subscriptionData.currentPlan.charAt(0).toUpperCase() + 
                             subscriptionData.currentPlan.slice(1);
    }
    
    setUser(userData);
  } catch (err) {
    console.error("Error fetching user data:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, []); // Remove navigate dependency

useEffect(() => {
  fetchUserData();
}, []); // Empty dependency array - only run once

  return { user, loading, error };
};

const useResponsiveSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleResize = useCallback(() => {
    setSidebarOpen(window.innerWidth >= DESKTOP_BREAKPOINT);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const closeSidebarOnMobile = useCallback(() => {
    if (window.innerWidth < DESKTOP_BREAKPOINT) {
      setSidebarOpen(false);
    }
  }, []);

  return { sidebarOpen, toggleSidebar, closeSidebarOnMobile };
};

// Navigation items configuration
const navigationItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg className="mr-3 h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    )
  },
  {
    to: "/email-sender",
    label: "Email Sender",
    icon: <img src={mailIcon} alt="" className="mr-3 h-5 w-5" aria-hidden="true" />
  },
  {
    to: "/whatsapp-sender",
    label: "Whatsapp Sender",
    icon: <img src={whatsappIcon} alt="" className="mr-3 h-5 w-5" aria-hidden="true" />
  }
];

const protectedNavigationItems = [
  {
    to: "/gmail-sender",
    label: "Gmail Sender",
    icon: <img src={gmailIcon} alt="" className="mr-3 h-5 w-5" aria-hidden="true" />
  },
  {
    to: "/email-scraper",
    label: "Email Scraper",
    icon: <img src={mailScraperIcon} alt="" className="mr-3 h-5 w-5" aria-hidden="true" />
  }
];

const bottomNavigationItems = [
  {
    to: "/account",
    label: "Account",
    icon: (
      <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  {
    to: "/plan",
    label: "Subscription Plan",
    icon: (
      <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    className: "bg-gradient-to-r from-blue-600 to-indigo-600"
  }
];

// Component for rendering navigation links
const NavigationLink = ({ to, label, icon, className = "", onClick, isActive }) => (
  <NavLink
    to={to}
    className={({ isActive: linkIsActive }) => {
      const active = isActive !== undefined ? isActive : linkIsActive;
      return `flex items-center px-4 py-3 mt-1 text-sm font-medium rounded-lg transition duration-200 ${
        active 
          ? `${className || "bg-blue-600"} text-white shadow-lg` 
          : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
      }`;
    }}
    onClick={onClick}
    aria-label={label}
  >
    {icon}
    {label}
  </NavLink>
);

// Component for protected navigation items
const ProtectedNavigationItem = ({ item, hasAccess, navigate, onNavigate }) => (
  <div
    className={`flex items-center px-4 py-3 mt-1 text-sm font-medium rounded-lg transition duration-200 cursor-pointer ${
      hasAccess
        ? "text-gray-300 hover:bg-gray-800/50 hover:text-white"
        : "text-gray-500 relative group"
    }`}
    onClick={() => {
      if (hasAccess) {
        navigate(item.to);
      } else {
        navigate("/plan");
      }
      onNavigate();
    }}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (hasAccess) {
          navigate(item.to);
        } else {
          navigate("/plan");
        }
        onNavigate();
      }
    }}
    aria-label={`${item.label}${!hasAccess ? ' - Upgrade required' : ''}`}
  >
    {item.icon}
    {item.label}
    {!hasAccess && (
      <>
        <svg className="ml-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded hidden group-hover:block w-32 z-50">
          Upgrade to access
        </div>
      </>
    )}
  </div>
);

// User avatar component
const UserAvatar = ({ user }) => {
  const initials = useMemo(() => {
    return user?.name?.split(" ").map(n => n[0]).join("") || "U";
  }, [user?.name]);

  return (
    <div className="mt-4 flex items-center">
      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
        <span className="text-xs font-bold" aria-hidden="true">
          {initials}
        </span>
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium">{user?.name || "User"}</p>
        <p className="text-xs text-gray-400">
          {user?.currentPlan && user.currentPlan !== "Free" ? `${user.currentPlan} Plan` : "Free User"}
        </p>
      </div>
    </div>
  );
};

// Loading component
const LoadingSpinner = () => (
  <div className="flex h-screen items-center justify-center" role="status" aria-label="Loading">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    <span className="sr-only">Loading...</span>
  </div>
);

// Error component
const ErrorMessage = ({ error }) => (
  <div className="error p-4 bg-red-600 text-white" role="alert">
    <strong>Error:</strong> {error}
  </div>
);

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, error } = useAuth();
  const { sidebarOpen, toggleSidebar, closeSidebarOnMobile } = useResponsiveSidebar();

  // Check if user has access to paid features
  const hasAccess = useCallback((feature) => {
    if (feature === "paid-tools") {
      return user?.currentPlan && user.currentPlan.toLowerCase() !== "free";
    }
    return true;
  }, [user?.currentPlan]);

  // Redirect free users from protected routes
  useEffect(() => {
    if (PROTECTED_ROUTES.includes(location.pathname) && 
        user && 
        user.currentPlan && 
        user.currentPlan.toLowerCase() === "free") {
      navigate("/plan");
    }
  }, [location.pathname, user, navigate]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-zinc-800 text-white relative overflow-hidden">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 fixed lg:relative z-30 w-64 h-full
          bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-sm
          border-r border-gray-700/50 transition-transform duration-300
        `}
        aria-label="Main navigation"
      >
        {/* Sidebar header */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <NavLink to="/" aria-label="Vedive Home">
                <img src={logo} alt="Vedive Logo" className="w-[150px] mb-2" />     
              </NavLink>
            </div>
            <button
              className="lg:hidden text-gray-400 hover:text-white transition-colors p-1"
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <UserAvatar user={user} />
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4" role="navigation" aria-label="Main navigation">
          {/* Regular navigation items */}
          {navigationItems.map((item, index) => (
            <NavigationLink
              key={item.to}
              {...item}
              onClick={closeSidebarOnMobile}
              className={index === 0 ? "bg-blue-600" : "bg-third"}
            />
          ))}

          {/* Protected navigation items */}
          {protectedNavigationItems.map((item) => (
            <ProtectedNavigationItem
              key={item.to}
              item={item}
              hasAccess={hasAccess("paid-tools")}
              navigate={navigate}
              onNavigate={closeSidebarOnMobile}
            />
          ))}

          {/* Bottom navigation items */}
          {bottomNavigationItems.map((item) => (
            <NavigationLink
              key={item.to}
              {...item}
              onClick={closeSidebarOnMobile}
            />
          ))}
        </nav>
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex flex-col overflow-auto relative">
        {/* Mobile menu button */}
        <button
          className={`lg:hidden fixed top-2 right-2 z-10 bg-gray-600 bg-opacity-50 backdrop-filter backdrop-blur-sm
          border border-gray-700/50 rounded-lg p-1.5 text-gray-400 hover:text-white transition-colors ${
            sidebarOpen ? "hidden" : "block"
          }`}
          onClick={toggleSidebar}
          aria-label="Open sidebar"
        >
          <svg 
            className="h-8 w-8" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="white"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Content area */}
        <div className="flex-1 min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;