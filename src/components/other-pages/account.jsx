import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Base URL for your API
const API_BASE_URL = "https://vedive.com:3000";

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Improved helper to fetch JSON data with better error handling
  const fetchData = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          Accept: "application/json",
        },
      });
      
      // Check for response status first
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error(`Request failed with status ${response.status}`);
      }

      // Now try to parse JSON, but handle potential parsing errors
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          return data;
        } else {
          console.warn("Response was not JSON:", await response.text());
          return null;
        }
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        throw new Error("Failed to parse server response as JSON");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        setError("Network error: Please check your connection or the server might be down");
      }
      throw err;
    }
  };

  // Extract user data from dashboard response
  const extractUserFromDashboard = (dashboardData) => {
    // Log the full dashboard data for debugging
    console.log("Full dashboard data:", dashboardData);
    
    // First check if there's user info directly in the response
    if (dashboardData?.user) {
      console.log("Found user object in dashboard data");
      return dashboardData.user;
    }
    
    // Check if user data is in stats
    if (dashboardData?.stats?.user) {
      console.log("Found user object in stats");
      return dashboardData.stats.user;
    }
    
    // Check if there's profile info in subscriptionInfo
    if (dashboardData?.subscriptionInfo?.userProfile) {
      console.log("Found userProfile in subscriptionInfo");
      return dashboardData.subscriptionInfo.userProfile;
    }
    
    // Try to find relevant user fields in recentActivities
    if (dashboardData?.recentActivities && dashboardData.recentActivities.length > 0) {
      const activity = dashboardData.recentActivities[0];
      if (activity.user) {
        console.log("Found user in recentActivities");
        return activity.user;
      }
    }
    
    // Look directly in the stats object for user fields
    if (dashboardData?.stats) {
      const stats = dashboardData.stats;
      // If stats contains user-related fields directly
      if (stats.email || stats.username || stats.name || stats.userId) {
        console.log("Found user fields directly in stats");
        return {
          email: stats.email || "",
          username: stats.username || "",
          name: stats.name || stats.fullName || "",
          id: stats.userId || stats.id || ""
        };
      }
    }
    
    // Get the first key of stats to see if it might be the user ID
    if (dashboardData?.stats && typeof dashboardData.stats === 'object') {
      const statsKeys = Object.keys(dashboardData.stats);
      if (statsKeys.length > 0) {
        const firstKey = statsKeys[0];
        const firstValue = dashboardData.stats[firstKey];
        
        // If the first value is an object with user-like properties
        if (typeof firstValue === 'object' && 
            (firstValue.email || firstValue.username || firstValue.name)) {
          console.log("Found user-like object in stats property");
          return firstValue;
        }
      }
    }
    
    // Check if we can find user info from any key in the dashboard data
    for (const key in dashboardData) {
      const value = dashboardData[key];
      if (typeof value === 'object' && value !== null) {
        // Check if this object has common user fields
        if (value.email && (value.name || value.username)) {
          console.log(`Found user-like object in ${key}`);
          return {
            email: value.email,
            name: value.name || value.fullName || "",
            username: value.username || value.email.split('@')[0]
          };
        }
      }
    }
    
    // Last resort: try to find any fields that look like user data
    let email = "";
    let name = "";
    let username = "";
    
    // Look for email pattern in any string property in the dashboard data
    const searchForUserFields = (obj, path = "") => {
      if (!obj || typeof obj !== 'object') return;
      
      for (const key in obj) {
        const value = obj[key];
        const currentPath = path ? `${path}.${key}` : key;
        
        if (typeof value === 'string') {
          // Is this an email?
          if (!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            console.log(`Found potential email at ${currentPath}: ${value}`);
            email = value;
          }
          
          // Is this a name or username?
          if (key.toLowerCase().includes('name') && !name) {
            name = value;
          } else if (key.toLowerCase().includes('user') && !username) {
            username = value;
          }
        } else if (typeof value === 'object' && value !== null) {
          searchForUserFields(value, currentPath);
        }
      }
    };
    
    searchForUserFields(dashboardData);
    
    if (email) {
      console.log("Constructed user object from fields found in dashboard data");
      return {
        email,
        name: name || email.split('@')[0],
        username: username || email.split('@')[0]
      };
    }
    
    // If we still don't have anything, check if we can use localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.email || parsedUser.username) {
          console.log("Retrieved user from localStorage");
          return parsedUser;
        }
      } catch (e) {
        console.error("Failed to parse stored user data", e);
      }
    }
    
    console.error("Could not find user data in the dashboard response");
    return null;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return navigate("/login");
    }

    const getUserData = async () => {
      try {
        // Get data from the dashboard since we know that endpoint works
        const dashboardData = await fetchData("/api/dashboard", { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        
        if (dashboardData) {
          console.log("Received dashboard data:", dashboardData);
          const userData = extractUserFromDashboard(dashboardData);
          
          if (userData && (userData.email || userData.username)) {
            console.log("Extracted user data:", userData);
            setUser(userData);
            setFormData({
              fullName: userData.name || userData.fullName || "",
              username: userData.username || "",
              email: userData.email || "",
              currentPassword: "",
              newPassword: "",
            });
          } else {
            console.error("Could not extract user data from dashboard response");
            setError("Could not find your account information in the system. Please try logging in again.");
          }
        } else {
          setError("Could not retrieve dashboard data. Please try logging in again.");
        }
      } catch (err) {
        console.error("Error in getUserData:", err);
        setError("Failed to retrieve your account information");
      } finally {
        setIsLoading(false);
      }
    };

    getUserData();
  }, [navigate]);

  const handleChange = e => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.newPassword && formData.newPassword.length < 8) {
      return setError("New password must be at least 8 characters long");
    }

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    // Password update
    if (formData.newPassword) {
      try {
        const possibleEndpoints = [
          "/api/auth/update-password",
          "/api/user/password",
          "/api/user/update-password"
        ];
        
        let updated = false;
        let lastError = null;
        
        for (const endpoint of possibleEndpoints) {
          try {
            console.log(`Trying password update at endpoint: ${endpoint}`);
            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
              method: "PUT",
              headers: { 
                "Content-Type": "application/json", 
                "Accept": "application/json",
                Authorization: `Bearer ${token}` 
              },
              body: JSON.stringify({ 
                currentPassword: formData.currentPassword, 
                newPassword: formData.newPassword,
                password: formData.newPassword, // Alternative field name
                oldPassword: formData.currentPassword // Alternative field name
              }),
            });
            
            if (res.ok) {
              updated = true;
              setSuccess("Password updated successfully");
              setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "" }));
              break;
            } else {
              const contentType = res.headers.get("content-type");
              if (contentType && contentType.includes("application/json")) {
                const json = await res.json();
                lastError = json.error || json.message || `Failed to update password (${res.status})`;
              } else {
                const text = await res.text();
                console.error(`Non-JSON response from ${endpoint}:`, text);
                lastError = `Server error (${res.status})`;
              }
            }
          } catch (endpointErr) {
            console.error(`Error with ${endpoint}:`, endpointErr);
            lastError = endpointErr.message;
          }
        }
        
        if (!updated) {
          setError(lastError || "Failed to update password. Please try again later.");
        }
      } catch (err) {
        console.error("Password update error:", err);
        setError(`Error updating password: ${err.message}`);
      }
      return;
    }

    // Profile update
    if (formData.currentPassword) {
      try {
        const possibleEndpoints = [
          "/api/update-user",
          "/api/user/update",
          "/api/user/profile",
          "/api/account/update"
        ];
        
        let updated = false;
        let lastError = null;
        
        for (const endpoint of possibleEndpoints) {
          try {
            console.log(`Trying profile update at endpoint: ${endpoint}`);
            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
              method: "PUT",
              headers: { 
                "Content-Type": "application/json", 
                "Accept": "application/json",
                Authorization: `Bearer ${token}` 
              },
              body: JSON.stringify({
                name: formData.fullName,
                fullName: formData.fullName, // Alternative field name
                username: formData.username,
                email: formData.email,
                currentPassword: formData.currentPassword,
                password: formData.currentPassword, // Alternative field name
              }),
            });
            
            if (res.ok) {
              updated = true;
              setSuccess("Profile updated successfully");
              setFormData(prev => ({ ...prev, currentPassword: "" }));
              break;
            } else {
              const contentType = res.headers.get("content-type");
              if (contentType && contentType.includes("application/json")) {
                const json = await res.json();
                lastError = json.error || json.message || `Failed to update profile (${res.status})`;
              } else {
                const text = await res.text();
                console.error(`Non-JSON response from ${endpoint}:`, text);
                lastError = `Server error (${res.status})`;
              }
            }
          } catch (endpointErr) {
            console.error(`Error with ${endpoint}:`, endpointErr);
            lastError = endpointErr.message;
          }
        }
        
        if (!updated) {
          setError(lastError || "Failed to update profile. Please try again later.");
        }
      } catch (err) {
        console.error("Profile update error:", err);
        setError(`Error updating profile: ${err.message}`);
      }
    } else {
      setError("Current password is required to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto px-4 sm:px-6 lg:px-7 py-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-third">Account Settings</h2>
          <p className="text-gray-700 mt-1">Manage your profile and security preferences</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-third"></div>
          </div>
        ) : (
          <>
            {success && (
              <div className="bg-green-100 border-l-4 border-green-400 p-4 mb-6 rounded">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="ml-3 text-sm text-green-700">{success}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border-l-4 border-red-400 p-4 mb-6 rounded">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="ml-3 text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow border border-gray-300">
              <div className="px-6 py-4 border-b border-gray-300">
                <h2 className="text-lg font-medium text-black">Personal Information</h2>
              </div>
              {user ? (
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        id="fullName" 
                        value={formData.fullName} 
                        onChange={handleChange} 
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                      <input 
                        type="text" 
                        id="username" 
                        value={formData.username} 
                        onChange={handleChange} 
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        id="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                  </div>

                  <div className="mt-8 border-t border-gray-300 pt-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Change Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <input 
                          type="password" 
                          id="currentPassword" 
                          value={formData.currentPassword} 
                          onChange={handleChange} 
                          required 
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                      </div>
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input 
                          type="password" 
                          id="newPassword" 
                          value={formData.newPassword} 
                          onChange={handleChange} 
                          placeholder="Leave blank to keep current password" 
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                        <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-4">
                    <button 
                      type="button" 
                      onClick={() => navigate("/dashboard")} 
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-third text-white rounded-md hover:opacity-90"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-700">Unable to load account information. Please try logging in again.</p>
                  <button 
                    onClick={() => navigate("/login")} 
                    className="mt-4 px-4 py-2 bg-third text-white rounded-md hover:opacity-90"
                  >
                    Go to Login
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Account;