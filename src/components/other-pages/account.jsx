import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

  // Helper function to fetch data from the backend
  const fetchData = async (url, options = {}) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      console.error("Error fetching data:", err.message);
      setError(err.message);
      navigate("/login");
      return null;
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch user data and form data
    const fetchUserData = async () => {
      try {
        const userData = await fetchData("https://ec2-51-21-1-175.eu-north-1.compute.amazonaws.com:3000/api/dashboard", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (userData?.user) {
          setUser(userData.user);
          setFormData((prevData) => ({
            ...prevData,
            fullName: userData.user.name,
            username: userData.user.username,
            email: userData.user.email,
          }));
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUserData();
  }, [navigate]);

  // Handle form data changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate new password
    if (formData.newPassword && formData.newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }

    // Check if the user is updating the password
    if (formData.newPassword) {
      try {
        const response = await fetch("https://ec2-51-21-1-175.eu-north-1.compute.amazonaws.com:3000/api/auth/update-password", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setSuccess("Password updated successfully");
          setFormData(prev => ({...prev, currentPassword: "", newPassword: ""}));
        } else {
          setError(data.error || "Failed to update password");
        }
      } catch (error) {
        console.error("Error updating password:", error);
        setError("An error occurred while updating password");
      }
    }

    // Check if the user is updating other fields
    if (formData.currentPassword && !formData.newPassword) {
      try {
        const response = await fetch("https://ec2-51-21-1-175.eu-north-1.compute.amazonaws.com:3000/api/update-user", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: formData.fullName,
            username: formData.username,
            email: formData.email,
            currentPassword: formData.currentPassword,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setSuccess("User data updated successfully");
          setFormData(prev => ({...prev, currentPassword: ""}));
        } else {
          setError(data.error || "Failed to update user data");
        }
      } catch (error) {
        console.error("Error updating user data:", error);
        setError("An error occurred while updating user data");
      }
    }
  };


  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-7 py-6">
        <div className="mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-third">Account Settings</h2>
        <p className="text-gray-700 mt-1">Manage your profile and security preferences</p>
        </div>

        {/* Success message */}
        {success && (
          <div className="bg-green-900 bg-opacity-20 border-l-4 border-green-400 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-400">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-900 bg-opacity-20 border-l-4 border-red-400 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Account Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Personal Information Card */}
          <div className="lg:col-span-2">
          <div className="mx-auto bg-white rounded-lg shadow-md border border-gray-300">
          <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-lg font-medium text-black">Personal Information</h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-800 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        readOnly
                        className="w-full px-4 py-2.5 bg-white border border-gray-600 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-800 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        readOnly
                        className="w-full px-4 py-2.5 bg-white border border-gray-600 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        readOnly
                        className="w-full px-4 py-2.5 bg-white border border-gray-600 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mt-8 border-t border-gray-700 pt-6">
                    <h3 className="text-sm font-medium text-gray-800 mb-4">Change Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-800 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 bg-white border border-gray-600 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-800 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          placeholder="Leave blank to keep current password"
                          className="w-full text-black px-4 py-2.5 bg-white border border-gray-600 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="mt-1 text-xs text-gray-800">Minimum 8 characters</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard')}
                      className="px-4 py-2 border border-gray-600 rounded-md text-gray-800 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-third rounded-md text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;