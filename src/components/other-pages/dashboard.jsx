import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [currentPlan, setCurrentPlan] = useState('Professional');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);  
  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/dashboard", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setStats(data.stats);
        setChartData(data.chartData);
        setRecentActivities(data.recentActivities);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="text-xl">Loading...</div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="text-xl">Error: {error}</div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="p-4 md:p-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 mt-2 md:mt-0">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-third">Dashboard Overview</h2>
              <p className="text-gray-400 text-sm">Analytics and quick actions for your marketing campaigns</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <div className="text-right">
                <p className="text-sm font-semibold">{currentPlan} Plan</p>
              </div>
              <Link to="/plan"><button className="bg-third hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition duration-200 text-sm font-medium shadow-lg">
                Upgrade Plan
              </button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
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
                <div className="bg-blue-500 h-1 rounded-full" style={{ width: '100%' }}></div>
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
                <div className="bg-green-500 h-1 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div className="bg-gray-800/40 backdrop-filter backdrop-blur-sm rounded-xl border border-gray-700/30 p-5 shadow-lg hover:shadow-xl transition duration-200 hover:translate-y-[-2px]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-purple-400">
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
              <div className="text-3xl font-bold mb-1">{stats.emailsCollected || 0}</div>
              <div className="text-sm text-gray-400 font-medium">Emails Collected</div>
              <div className="mt-4 w-full bg-gray-700/50 rounded-full h-1">
                <div className="bg-purple-500 h-1 rounded-full" style={{ width: '100%' }}></div>
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
                <div className="bg-yellow-500 h-1 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>

          {/* Chart and Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
            <div className="bg-gray-800/40 backdrop-filter backdrop-blur-sm rounded-xl border border-gray-700/30 p-5 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Message Performance</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                        border: '1px solid rgba(71, 85, 105, 0.3)',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
                      }} 
                      itemStyle={{ color: '#F3F4F6' }}
                      labelStyle={{ color: '#F3F4F6', fontWeight: 'bold' }}
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
                // Define icon mapping with added gmail-sender
                const iconMapping = {
                  "mail-sender": (
                    <svg
                      className="h-5 w-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  ),
                  "gmail-sender": (
                    <svg
                    className="h-5 w-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  ),
                  "whatsapp-sender": (
                    <svg
                      className="h-5 w-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                  ),
                  "email-scraper": (
                    <svg
                      className="h-5 w-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ),
                  "number-scraper": (
                    <svg
                      className="h-5 w-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  )
                };

                // Function to get the correct background and text classes
                const getBgClass = (type) => {
                  switch(type) {
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

                // Function to get the badge class
                const getBadgeClass = (type) => {
                  switch(type) {
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

                // Get icon based on activity type
                const activityType = activity.type;
                const icon = iconMapping[activityType];

                return (
                  <div key={index} className="flex items-start">
                    <div
                      className={`flex-shrink-0 h-10 w-10 rounded-full ${getBgClass(activityType)} flex items-center justify-center shadow-lg`}
                    >
                      {icon || null}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-400">{activity.time}</span>
                        <span
                          className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getBadgeClass(activityType)}`}
                        >
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
          {/* Quick Actions */}
          <div className="bg-gray-800/40 backdrop-filter backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6 shadow-xl mb-8 transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-xl font-semibold mb-5 text-white flex items-center gap-2 group">
              <span className="bg-blue-500 h-1.5 w-6 rounded-full mr-2 group-hover:w-10 transition-all duration-300"></span>
              Quick Actions
              <span className="text-blue-400 ml-1 text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">(4)</span>
            </h3>
            
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <Link to="/email-sender" className="relative overflow-hidden bg-gradient-to-br from-blue-600/90 to-blue-700/90 text-white p-5 rounded-xl flex flex-col items-center justify-center text-sm transition-all duration-300 shadow-lg hover:shadow-blue-500/20 hover:shadow-xl group transform hover:-translate-y-1 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-all duration-300"></div>
                <svg className="h-7 w-7 mb-3 transform group-hover:scale-110 transition-all duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 7l-10 5L2 7" />
                  <line x1="12" y1="12" x2="12" y2="16" />
                </svg>
                <span className="font-medium relative z-10">New Email Campaign</span>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-400/40 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </Link>
              
              <Link to="/whatsapp-sender" className="relative overflow-hidden bg-gradient-to-br from-green-600/90 to-green-700/90 text-white p-5 rounded-xl flex flex-col items-center justify-center text-sm transition-all duration-300 shadow-lg hover:shadow-green-500/20 hover:shadow-xl group transform hover:-translate-y-1 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-green-500/10 group-hover:bg-green-500/20 transition-all duration-300"></div>
                <svg className="h-7 w-7 mb-3 transform group-hover:scale-110 transition-all duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  <path d="M12 12v.01" />
                  <path d="M8 12v.01" />
                  <path d="M16 12v.01" />
                </svg>
                <span className="font-medium relative z-10">Send WhatsApp Bulk</span>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-green-400/40 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </Link>
              
              <Link to="/email-scraper" className="relative overflow-hidden bg-gradient-to-br from-purple-600/90 to-purple-700/90 text-white p-5 rounded-xl flex flex-col items-center justify-center text-sm transition-all duration-300 shadow-lg hover:shadow-purple-500/20 hover:shadow-xl group transform hover:-translate-y-1 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition-all duration-300"></div>
                <svg className="h-7 w-7 mb-3 transform group-hover:scale-110 transition-all duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  <path d="M22 12l-3 3l-3-3" />
                </svg>
                <span className="font-medium relative z-10">Mail Scraper</span>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-400/40 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </Link>
              
              <Link to="/number-scraper" className="relative overflow-hidden bg-gradient-to-br from-amber-500/90 to-amber-600/90 text-white p-5 rounded-xl flex flex-col items-center justify-center text-sm transition-all duration-300 shadow-lg hover:shadow-amber-500/20 hover:shadow-xl group transform hover:-translate-y-1 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-amber-500/10 group-hover:bg-amber-500/20 transition-all duration-300"></div>
                <svg className="h-7 w-7 mb-3 transform group-hover:scale-110 transition-all duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                <span className="font-medium relative z-10">Number Scraper</span>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-400/40 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;