import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MessageForm = () => {
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [media, setMedia] = useState(null);
  const [response, setResponse] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token")); // Check if user is logged in
  const navigate = useNavigate();

  // Update isLoggedIn state when the component mounts
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  // Fetch QR Code
  const fetchQrCode = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login page if not logged in
      return;
    }
    try {
      const response = await axios.get("http://localhost:3000/api/whatsapp/qr", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.qrCode) {
        setQrCode(response.data.qrCode);
      } else {
        alert(response.data.message || "No QR code available.");
      }
    } catch (error) {
      console.error("Error fetching QR code:", error);
      alert("Failed to fetch QR code.");
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login page if not logged in
      return;
    }
    const formData = new FormData();
    formData.append("users", users);
    formData.append("message", message);
    if (media) formData.append("media", media);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/whatsapp/send",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
      {/* QR Code Section */}
      <div className="mb-6 text-center">
        <button
          type="button"
          onClick={fetchQrCode}
          className="mt-2 py-1 px-4 bg-third text-white rounded-md shadow-md"
        >
          Get QR Code
        </button>
        {qrCode && (
          <div className="mt-4">
            <img src={qrCode} alt="QR Code" className="mx-auto" />
          </div>
        )}
      </div>

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
        <div className="flex">
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