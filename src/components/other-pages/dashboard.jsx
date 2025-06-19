import React, { useEffect, useState, useCallback } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// Move constants outside component to avoid recreation
const API_URL = "https://vedive.com:3000";

const iconMapping = {
  "mail-sender": (
    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
  ),
  "gmail-sender": (
    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
  ),
  "whatsapp-sender": (
    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
    </svg>
  ),
  "email-scraper": (
    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
        clipRule="evenodd"
      />
    </svg>
  ),
  "number-scraper": (
    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    </svg>
  )
};

const getBgClass = (type) => {
  const classMap = {
    "mail-sender": "bg-blue-400 bg-gradient-to-br from-blue-400 to-blue-600",
    "gmail-sender": "bg-red-400 bg-gradient-to-br from-red-400 to-red-600",
    "whatsapp-sender": "bg-green-400 bg-gradient-to-br from-green-400 to-green-600",
    "email-scraper": "bg-purple-400 bg-gradient-to-br from-purple-400 to-purple-600",
    "number-scraper": "bg-yellow-400 bg-gradient-to-br from-yellow-400 to-yellow-600"
  };
  return classMap[type] || "bg-gray-400 bg-gradient-to-br from-gray-400 to-gray-600";
};

const getBadgeClass = (type) => {
  const classMap = {
    "mail-sender": "bg-blue-500/20 text-blue-300",
    "gmail-sender": "bg-red-500/20 text-red-300",
    "whatsapp-sender": "bg-green-500/20 text-green-300",
    "email-scraper": "bg-purple-500/20 text-purple-300",
    "number-scraper": "bg-yellow-500/20 text-yellow-300"
  };
  return classMap[type] || "bg-gray-500/20 text-gray-300";
};

const Dashboard = () => {
  const [currentPlan, setCurrentPlan] = useState("Free");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fixed: Removed useCallback and moved function inside useEffect to avoid dependency issues
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Wait for token
        const maxWaitTime = 5000;
        const startTime = Date.now();
        let token = null;
        
        while (Date.now() - startTime < maxWaitTime) {
          token = localStorage.getItem("token");
          if (token && token.trim() !== '') {
            console.log("Token found:", token.substring(0, 20) + "...");
            break;
          }
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        if (!token) {
          console.log("No token found after waiting, redirecting to login");
          navigate("/login");
          return;
        }

        console.log("Token found, proceeding with API calls");

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const [userResponse, dashboardResponse, subscriptionResponse] = await Promise.all([
          fetch(`${API_URL}/api/auth/user`, { headers }),
          fetch(`${API_URL}/api/dashboard`, { headers }),
          fetch(`${API_URL}/api/subscription/status`, { headers })
        ]);

        if (!userResponse.ok) {
          if (userResponse.status === 401) {
            console.log("Token invalid, clearing localStorage and redirecting");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
            return;
          }
          throw new Error(`Authentication failed: ${userResponse.status}`);
        }

        const userData = await userResponse.json();
        console.log("User data received:", userData);
        
        if (subscriptionResponse.ok) {
          const subscriptionData = await subscriptionResponse.json();
          userData.currentPlan = subscriptionData.currentPlan.charAt(0).toUpperCase() + 
                                 subscriptionData.currentPlan.slice(1);
        }

        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json();
          console.log("Dashboard data received:", dashboardData);
          setStats(dashboardData.stats || {});
          setChartData(dashboardData.chartData || []);
          setRecentActivities(dashboardData.recentActivities || []);
          setCurrentPlan(dashboardData.userPlan || userData.currentPlan || "Free");
        } else {
          console.warn("Dashboard data fetch failed:", dashboardResponse.status);
        }

        setUser(userData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        
        if (err.message.includes('401') || err.message.includes('Authentication')) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [navigate]); // Only navigate as dependency

  // Create a separate retry function that doesn't need useCallback
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Trigger a re-run by updating a state that will cause useEffect to re-run
    // Since we can't easily re-trigger the useEffect, we'll create a simple retry mechanism
    window.location.reload();
  };

  // Now we can safely use conditional rendering after all hooks are declared
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <div className="text-xl">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="text-center">
          <div className="text-xl mb-4">Error: {error}</div>
          <button 
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      icon: (
        <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      ),
      value: stats.emailCampaigns || 0,
      label: "Email Campaigns",
      color: "text-blue-400",
      bgColor: "bg-blue-500"
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
          <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
        </svg>
      ),
      value: stats.whatsappMessages || 0,
      label: "WhatsApp Messages",
      color: "text-green-400",
      bgColor: "bg-green-500"
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
            clipRule="evenodd"
          />
        </svg>
      ),
      value: stats.emailsCollected || 0,
      label: "Emails Collected",
      color: "text-purple-400",
      bgColor: "bg-purple-500"
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
      ),
      value: stats.phoneNumbers || 0,
      label: "Phone Numbers",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500"
    }
  ];

  const renderRecentActivities = () => {
    if (!recentActivities?.length) {
      return <div className="text-center text-gray-400">No recent activities</div>;
    }

    return recentActivities.map((activity, index) => (
      <div key={`${activity.type}-${index}`} className="flex items-start">
        <div className={`flex-shrink-0 h-10 w-10 rounded-full ${getBgClass(activity.type)} flex items-center justify-center shadow-lg`}>
          {iconMapping[activity.type]}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium">{activity.description}</p>
          <div className="flex items-center mt-1">
            <span className="text-xs text-gray-400">{activity.time}</span>
            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getBadgeClass(activity.type)}`}>
              {activity.type}
            </span>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="p-4 md:p-6 overflow-y-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 mt-2 md:mt-0">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-third">
            Dashboard Overview
          </h2>
          <p className="text-gray-400 text-sm">
            Analytics and quick actions for your marketing campaigns
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <div className="text-left">
            <p className="text-sm font-medium">{user?.name || "User"}</p>
            <p className="text-xs text-gray-400">
              {user?.currentPlan && user.currentPlan !== "Free" ? `${user.currentPlan} Plan` : "Free User"}
            </p>
          </div>
          {currentPlan.toLowerCase() === "free" && (
            <Link to="/plan">
              <button className="bg-third hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition duration-200 text-sm font-medium shadow-lg">
                Upgrade Plan
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-gray-800/40 backdrop-filter backdrop-blur-sm rounded-xl border border-gray-700/30 p-5 shadow-lg hover:shadow-xl transition duration-200 hover:translate-y-[-2px]">
            <div className="flex items-center justify-between mb-4">
              <span className={card.color}>
                {card.icon}
              </span>
            </div>
            <div className="text-3xl font-bold mb-1">{card.value}</div>
            <div className="text-sm text-gray-400 font-medium">{card.label}</div>
            <div className="mt-4 w-full bg-gray-700/50 rounded-full h-1">
              <div className={`${card.bgColor} h-1 rounded-full`} style={{ width: "100%" }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Activities */}
      <div className="mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
          {/* Chart */}
          <div className="bg-gray-800/40 backdrop-filter backdrop-blur-sm rounded-xl border border-gray-700/30 p-5 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Message Performance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(30, 41, 59, 0.9)",
                      border: "1px solid rgba(71, 85, 105, 0.3)",
                      borderRadius: "8px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)"
                    }}
                    itemStyle={{ color: "#F3F4F6" }}
                    labelStyle={{ color: "#F3F4F6", fontWeight: "bold" }}
                  />
                  <Bar dataKey="sent" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-4 space-x-6">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-xs text-gray-400">Messages Sent</span>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-gray-800/40 backdrop-filter backdrop-blur-sm rounded-xl border border-gray-700/30 p-5 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
            <div className="space-y-5">
              {renderRecentActivities()}
            </div>
            <button className="w-full mt-5 py-2 px-4 text-xs font-medium rounded-lg text-gray-300 hover:text-white bg-gray-700/30 hover:bg-gray-700/50 transition duration-200">
              View All Activities
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;