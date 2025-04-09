import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import {useNavigate } from "react-router-dom";

const Dashboard = () => {
  const API_URL = "https://vedive.com:3000";
  // const API_URL = "https://ec2-51-21-1-175.eu-north-1.compute.amazonaws.com:3000";
  const [currentPlan, setCurrentPlan] = useState("Free");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
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

  }, [navigate]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/dashboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setStats(data.stats);
        setChartData(data.chartData);
        setRecentActivities(data.recentActivities);
        setCurrentPlan(data.userPlan || "Free");
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="text-xl">Error: {error}</div>
      </div>
    );

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
          <div className="text-right">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-gray-800/40 backdrop-filter backdrop-blur-sm rounded-xl border border-gray-700/30 p-5 shadow-lg hover:shadow-xl transition duration-200 hover:translate-y-[-2px]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-blue-400">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </span>
          </div>
          <div className="text-3xl font-bold mb-1">{stats.emailCampaigns || 0}</div>
          <div className="text-sm text-gray-400 font-medium">Email Campaigns</div>
          <div className="mt-4 w-full bg-gray-700/50 rounded-full h-1">
            <div className="bg-blue-500 h-1 rounded-full" style={{ width: "100%" }}></div>
          </div>
        </div>
        <div className="bg-gray-800/40 backdrop-filter backdrop-blur-sm rounded-xl border border-gray-700/30 p-5 shadow-lg hover:shadow-xl transition duration-200 hover:translate-y-[-2px]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-green-400">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
            </span>
          </div>
          <div className="text-3xl font-bold mb-1">{stats.whatsappMessages || 0}</div>
          <div className="text-sm text-gray-400 font-medium">WhatsApp Messages</div>
          <div className="mt-4 w-full bg-gray-700/50 rounded-full h-1">
            <div className="bg-green-500 h-1 rounded-full" style={{ width: "100%" }}></div>
          </div>
        </div>
        <div className="bg-gray-800/40 backdrop-filter backdrop-blur-sm rounded-xl border border-gray-700/30 p-5 shadow-lg hover:shadow-xl transition duration-200 hover:translate-y-[-2px]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-purple-400">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
          <div className="text-3xl font-bold mb-1">{stats.emailsCollected || 0}</div>
          <div className="text-sm text-gray-400 font-medium">Emails Collected</div>
          <div className="mt-4 w-full bg-gray-700/50 rounded-full h-1">
            <div className="bg-purple-500 h-1 rounded-full" style={{ width: "100%" }}></div>
          </div>
        </div>
        <div className="bg-gray-800/40 backdrop-filter backdrop-blur-sm rounded-xl border border-gray-700/30 p-5 shadow-lg hover:shadow-xl transition duration-200 hover:translate-y-[-2px]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-yellow-400">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </span>
          </div>
          <div className="text-3xl font-bold mb-1">{stats.phoneNumbers || 0}</div>
          <div className="text-sm text-gray-400 font-medium">Phone Numbers</div>
          <div className="mt-4 w-full bg-gray-700/50 rounded-full h-1">
            <div className="bg-yellow-500 h-1 rounded-full" style={{ width: "100%" }}></div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
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
          <div className="bg-gray-800/40 backdrop-filter backdrop-blur-sm rounded-xl border border-gray-700/30 p-5 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
            <div className="space-y-5">
              {recentActivities && recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => {
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
                    switch (type) {
                      case "mail-sender":
                        return "bg-blue-400 bg-gradient-to-br from-blue-400 to-blue-600";
                      case "gmail-sender":
                        return "bg-red-400 bg-gradient-to-br from-red-400 to-red-600";
                      case "whatsapp-sender":
                        return "bg-green-400 bg-gradient-to-br from-green-400 to-green-600";
                      case "email-scraper":
                        return "bg-purple-400 bg-gradient-to-br from-purple-400 to-purple-600";
                      case "number-scraper":
                        return "bg-yellow-400 bg-gradient-to-br from-yellow-400 to-yellow-600";
                      default:
                        return "bg-gray-400 bg-gradient-to-br from-gray-400 to-gray-600";
                    }
                  };

                  const getBadgeClass = (type) => {
                    switch (type) {
                      case "mail-sender":
                        return "bg-blue-500/20 text-blue-300";
                      case "gmail-sender":
                        return "bg-red-500/20 text-red-300";
                      case "whatsapp-sender":
                        return "bg-green-500/20 text-green-300";
                      case "email-scraper":
                        return "bg-purple-500/20 text-purple-300";
                      case "number-scraper":
                        return "bg-yellow-500/20 text-yellow-300";
                      default:
                        return "bg-gray-500/20 text-gray-300";
                    }
                  };

                  const activityType = activity.type;
                  const icon = iconMapping[activityType];

                  return (
                    <div key={index} className="flex items-start">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full ${getBgClass(activityType)} flex items-center justify-center shadow-lg`}>
                        {icon || null}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-400">{activity.time}</span>
                          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getBadgeClass(activityType)}`}>
                            {activityType}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-400">No recent activities</div>
              )}
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
