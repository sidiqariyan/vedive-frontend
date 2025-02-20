import React, { useState } from "react";
import axios from "axios";
import QRCodeDisplay from "./Auth";

const MessageForm = () => {
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [media, setMedia] = useState(null);
  const [response, setResponse] = useState("");
  const [campaignName, setCampaignName] = useState(""); // State to store campaign name

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prompt user to enter campaign name
    const campaignNameInput = prompt("Please name your campaign:");
    if (!campaignNameInput || campaignNameInput.trim() === "") {
      alert("Campaign name is required!");
      return;
    }

    // Update campaign name state
    setCampaignName(campaignNameInput);

    if (!users || !message) {
      alert("Please provide users and message.");
      return;
    }

    const formData = new FormData();
    formData.append("users", users);
    formData.append("message", message);
    formData.append("campaignName", campaignNameInput); // Include campaign name in the request
    if (media) formData.append("media", media);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/whatsapp/send",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResponse(response.data.message);
    } catch (error) {
      console.error("Error sending messages:", error);
      setResponse("Error sending messages.");
    }
  };

  return (
    <div className="bg-[#121212] p-4 border rounded-lg">
      {/* QR Code Display Section */}
      <div className="mb-6 text-center">
        <QRCodeDisplay /> {/* Embed the QRCodeDisplay component here */}
      </div>

      {/* Campaign Name Display */}
      {campaignName && (
        <div className="mb-4 text-center">
          <p className="text-primary font-semibold">Selected Campaign: {campaignName}</p>
        </div>
      )}

      {/* Message Form Section */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          {/* Users Input */}
          <div>
            <label htmlFor="users" className="block text-sm font-medium text-gray-700">
              Users (One phone number per line):
            </label>
            <textarea
              id="users"
              value={users}
              onChange={(e) => setUsers(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm text-secondary"
              rows="4"
            />
          </div>
          {/* Message Input */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message:
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm text-secondary"
              rows="4"
            />
          </div>
        </div>

        <div className="flex gap-3">
          {/* Media Input */}
          <div>
            <label htmlFor="media" className="block text-sm font-medium text-gray-700">
              Media (Optional):
            </label>
            <input
              id="media"
              type="file"
              onChange={(e) => setMedia(e.target.files[0])}
              className="mt-1 block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:second hover:file:bg-indigo-100"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="py-1 px-4 bg-third text-white rounded-md shadow-md"
          >
            Send Messages
          </button>
        </div>

        {/* Response Message */}
        {response && (
          <p
            className={`text-center mt-4 ${
              response.includes("Error") ? "text-red-500" : "text-green-500"
            }`}
          >
            {response}
          </p>
        )}
      </form>
    </div>
  );
};

export default MessageForm;