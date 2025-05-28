import React, { useState, useCallback, useMemo } from "react";
import axios from "axios";
import QRCodeDisplay from "./Auth";
import { MessageCircle, UploadCloud, HelpCircle, Send, AlertCircle } from "lucide-react";
import { Helmet } from 'react-helmet';

const MessageForm = () => {
  const [formData, setFormData] = useState({
    users: "",
    message: "",
    campaignName: ""
  });
  const [media, setMedia] = useState(null);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Memoized validation function
  const validation = useMemo(() => {
    const errors = {};
    
    if (!formData.users.trim()) {
      errors.users = "Please provide at least one phone number";
    }
    
    if (!formData.message.trim()) {
      errors.message = "Please provide a message";
    }
    
    // Validate phone number format (basic validation)
    const phoneNumbers = formData.users.split('\n').filter(num => num.trim());
    const invalidNumbers = phoneNumbers.filter(num => 
      !num.trim().match(/^\+?[\d\s-()]+$/) || num.trim().length < 10
    );
    
    if (invalidNumbers.length > 0) {
      errors.users = `Invalid phone number format: ${invalidNumbers[0]}`;
    }
    
    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };
  }, [formData.users, formData.message]);

  // Optimized input handler using useCallback
  const handleInputChange = useCallback((field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (error) setError("");
  }, [error]);

  // Optimized media handler
  const handleMediaChange = useCallback((e) => {
    const file = e.target.files[0];
    
    // File validation
    if (file) {
      const maxSize = 16 * 1024 * 1024; // 16MB limit
      const allowedTypes = ['image/', 'video/', 'audio/', 'application/pdf'];
      
      if (file.size > maxSize) {
        setError("File size must be less than 16MB");
        return;
      }
      
      if (!allowedTypes.some(type => file.type.startsWith(type))) {
        setError("Unsupported file type. Please use images, videos, audio, or PDF files.");
        return;
      }
    }
    
    setMedia(file);
    if (error) setError("");
  }, [error]);

  // Optimized campaign name prompt
  const getCampaignName = useCallback(() => {
    return new Promise((resolve) => {
      const campaignNameInput = prompt("Please name your campaign:");
      if (!campaignNameInput || campaignNameInput.trim() === "") {
        setError("Campaign name is required!");
        resolve(null);
      } else {
        resolve(campaignNameInput.trim());
      }
    });
  }, []);

  // Optimized API call with better error handling
  const sendMessages = useCallback(async (campaignName) => {
    const apiFormData = new FormData();
    apiFormData.append("users", formData.users);
    apiFormData.append("message", formData.message);
    apiFormData.append("campaignName", campaignName);
    if (media) apiFormData.append("media", media);

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      const result = await axios.post(
        "https://vedive.com:3000/api/whatsapp/send",
        apiFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
          },
          timeout: 30000, // 30 second timeout
        }
      );
      
      setResponse(result.data.message || "Messages sent successfully!");
      
      // Reset form on success
      setFormData({ users: "", message: "", campaignName: "" });
      setMedia(null);
      
    } catch (error) {
      console.error("Error sending messages:", error);
      
      if (error.code === 'ECONNABORTED') {
        setError("Request timeout. Please try again.");
      } else if (error.response?.status === 401) {
        setError("Authentication failed. Please log in again.");
      } else if (error.response?.status === 429) {
        setError("Too many requests. Please wait before trying again.");
      } else {
        setError(error.response?.data?.error || error.message || "Error sending messages. Please try again.");
      }
      
      setResponse("");
    }
  }, [formData, media]);

  // Main form submission handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError("");
    setResponse("");

    // Validate form
    if (!validation.isValid) {
      setError(Object.values(validation.errors)[0]);
      return;
    }

    setIsLoading(true);

    try {
      const campaignName = await getCampaignName();
      if (!campaignName) return;

      setFormData(prev => ({ ...prev, campaignName }));
      await sendMessages(campaignName);
      
    } finally {
      setIsLoading(false);
    }
  }, [validation, getCampaignName, sendMessages]);

  // Memoized phone number count
  const phoneNumberCount = useMemo(() => {
    return formData.users.split('\n').filter(num => num.trim()).length;
  }, [formData.users]);

  return (
    <div className="min-h-screen bg-gray-50 p-0 sm:p-4 md:p-8">
      <Helmet>
        <title>Bulk WhatsApp Sender Tool – Send Free Messages Online | Vedive</title>
        <meta name="description" content="Use Vedive's bulk WhatsApp sender to send unlimited messages online. 100% free, no daily limits or fees. Boost marketing reach for businesses & freelancers."/>
      </Helmet>
      
      <div className="mx-auto bg-white rounded-lg shadow-md border border-gray-300">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-b border-gray-300">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <MessageCircle className="text-third" size={30} />
            <h1 className="text-2xl sm:text-3xl md:text-[40px] font-semibold text-gray-900">
              WhatsApp Sender
            </h1>
          </div>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
            <HelpCircle size={16} className="text-third" />
            <span>Need help?</span>
            <a href="#" className="text-third underline hover:text-third-dark transition-colors">
              Watch tutorial
            </a>
          </div>
        </header>

        <main className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* QR Code Display Section */}
          <section className="mb-4 sm:mb-6 text-center">
            <QRCodeDisplay />
          </section>

          {/* Campaign Name Display */}
          {formData.campaignName && (
            <div className="mb-4 text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-primary font-semibold text-sm sm:text-base">
                Selected Campaign: {formData.campaignName}
              </p>
            </div>
          )}

          {/* Error/Success Messages */}
          {error && (
            <div className="flex items-center gap-2 p-3 sm:p-4 bg-red-50 border border-red-300 rounded-lg">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-red-600">{error}</p>
            </div>
          )}

          {response && (
            <div className="flex items-center gap-2 p-3 sm:p-4 bg-green-50 border border-green-300 rounded-lg">
              <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
              <p className="text-xs sm:text-sm text-green-600">{response}</p>
            </div>
          )}

          {/* Message Form Section */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Users and Message Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="users" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Phone Numbers ({phoneNumberCount} numbers):
                </label>
                <textarea
                  id="users"
                  value={formData.users}
                  onChange={handleInputChange('users')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-third focus:border-transparent text-secondary resize-vertical"
                  rows="4"
                  placeholder="Example:&#10;+1234567890&#10;+0987654321&#10;+1122334455"
                  aria-describedby="users-help"
                />
                <p id="users-help" className="text-xs text-gray-500 mt-1">
                  Enter one phone number per line with country code
                </p>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Message ({formData.message.length} characters):
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleInputChange('message')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-third focus:border-transparent text-secondary resize-vertical"
                  rows="4"
                  placeholder="Type your message here..."
                  maxLength="4096"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum 4096 characters
                </p>
              </div>
            </div>

            {/* Media Input and Submit Button */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="media" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Media (Optional):
                </label>
                <input
                  id="media"
                  type="file"
                  onChange={handleMediaChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-third focus:border-transparent text-secondary text-xs sm:text-sm"
                  accept="image/*,video/*,audio/*,.pdf"
                />
                {media && (
                  <p className="text-xs text-green-600 mt-1">
                    Selected: {media.name} ({(media.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
              
              <div className="flex items-end justify-end mt-4 md:mt-0">
                <button
                  type="submit"
                  disabled={isLoading || !validation.isValid}
                  className={`w-full md:w-auto px-6 py-2 rounded-lg text-xs sm:text-sm font-medium text-white flex items-center justify-center gap-2 transition-all duration-200 ${
                    isLoading || !validation.isValid
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-third hover:bg-third-dark hover:shadow-lg transform hover:-translate-y-0.5"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Messages
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default MessageForm;