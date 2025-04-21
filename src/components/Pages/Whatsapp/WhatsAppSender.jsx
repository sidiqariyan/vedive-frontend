import React, { useState } from "react";
import axios from "axios";
import QRCodeDisplay from "./Auth";
import { MessageCircle, UploadCloud, HelpCircle } from "lucide-react"; // Import icons for consistency
import { Helmet } from 'react-helmet';

const MessageForm = () => {
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [media, setMedia] = useState(null);
  const [response, setResponse] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate inputs before prompting for campaign name
    if (!users.trim()) {
      setError("Please provide at least one phone number");
      return;
    }

    if (!message.trim()) {
      setError("Please provide a message");
      return;
    }

    // Prompt user to enter campaign name
    const campaignNameInput = prompt("Please name your campaign:");
    if (!campaignNameInput || campaignNameInput.trim() === "") {
      setError("Campaign name is required!");
      return;
    }

    // Update campaign name state
    setCampaignName(campaignNameInput);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("users", users);
    formData.append("message", message);
    formData.append("campaignName", campaignNameInput);
    if (media) formData.append("media", media);

    try {
      // Added auth token from localStorage
      const token = localStorage.getItem("token");

      const result = await axios.post(
        "https://vedive.com:3000/api/whatsapp/send",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`, // Add authentication header
          },
        }
      );
      setResponse(result.data.message);
    } catch (error) {
      console.error("Error sending messages:", error);
      setError(error.response?.data?.error || "Error sending messages. Please try again.");
      setResponse(""); // Clear any previous response
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-0 sm:p-4 md:p-8">
      <Helmet>
      <title>Bulk WhatsApp Sender Tool – Send Free Messages Online | Vedive</title>
      <meta name="description" content="Use Vedive’s bulk WhatsApp sender to send unlimited messages online. 100% free, no daily limits or fees. Boost marketing reach for businesses & freelancers."/>
      </Helmet>
      <div className="mx-auto bg-white rounded-lg shadow-md border border-gray-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-b border-gray-300">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <MessageCircle className="text-third" size={30} sm:size={40} />
            <h1 className="text-2xl sm:text-3xl md:text-[40px] font-semibold text-gray-900">WhatsApp Sender</h1>
          </div>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
            <HelpCircle size={16} className="text-third" />
            <span>Need help?</span>
            <a href="#" className="text-third underline">
              Watch tutorial
            </a>
          </div>
        </div>
  
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* QR Code Display Section */}
          <div className="mb-4 sm:mb-6 text-center">
            <QRCodeDisplay />
          </div>
  
          {/* Campaign Name Display */}
          {campaignName && (
            <div className="mb-4 text-center">
              <p className="text-primary font-semibold text-sm sm:text-base">Selected Campaign: {campaignName}</p>
            </div>
          )}
  
          {/* Error message display */}
          {error && (
            <div className="mt-4 p-3 sm:p-4 bg-red-50 border border-red-300 rounded-lg">
              <p className="text-xs sm:text-sm text-red-600">{error}</p>
            </div>
          )}
  
          {/* Message Form Section */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Users and Message Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Users (One phone number per line):
                </label>
                <textarea
                  id="users"
                  value={users}
                  onChange={(e) => setUsers(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-third focus:border-transparent text-secondary"
                  rows="4"
                  placeholder="Example: +1234567890"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Message:
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-third focus:border-transparent text-secondary"
                  rows="4"
                  placeholder="Type your message here..."
                />
              </div>
            </div>
  
            {/* Media Input and Submit Button */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Media (Optional):
                </label>
                <input
                  id="media"
                  type="file"
                  onChange={(e) => setMedia(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-third focus:border-transparent text-secondary text-xs sm:text-sm"
                />
              </div>
              <div className="flex items-end justify-end mt-4 md:mt-0">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full md:w-auto px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-white ${
                    isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-third hover:bg-third-dark"
                  }`}
                >
                  {isLoading ? "Sending..." : "Send Messages"}
                </button>
              </div>
            </div>
          </form>
  
          {/* Response Message */}
          {response && (
            <div
              className={`mt-4 p-3 sm:p-4 rounded-lg ${
                response.includes("Error") ? "bg-red-50 border border-red-300" : "bg-green-50 border border-green-300"
              }`}
            >
              <p className={`text-xs sm:text-sm ${response.includes("Error") ? "text-red-600" : "text-green-600"}`}>
                {response}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageForm;
