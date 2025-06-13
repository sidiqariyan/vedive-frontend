import React, { useState, useCallback, useMemo, useEffect } from "react";
import { MessageCircle, HelpCircle, Send, AlertCircle, CheckCircle, Loader, Upload, X, RefreshCw } from "lucide-react";

// Fixed QR Code component with real API integration
const QRCodeDisplay = ({ onAuthenticationChange }) => {
  const [qrCode, setQrCode] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pollingInterval, setPollingInterval] = useState(null);

  // Check authentication status
  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await fetch("http://localhost:3000/api/whatsapp/qr", {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.qrCode) {
        setQrCode(data.qrCode);
        setIsAuthenticated(false);
        setError("");
        // Start polling for authentication
        startPolling();
      } else if (data.message && data.message.includes("authenticated")) {
        setIsAuthenticated(true);
        setQrCode(null);
        setError("");
        stopPolling();
        if (onAuthenticationChange) {
          onAuthenticationChange(true);
        }
      } else {
        setError("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setError(`Failed to connect: ${error.message}`);
      setQrCode(null);
      setIsAuthenticated(false);
    }
  }, [onAuthenticationChange]);

  // Start polling to check if user has scanned QR
  const startPolling = useCallback(() => {
    if (pollingInterval) return; // Already polling
    
    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/whatsapp/qr", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.message && data.message.includes("authenticated")) {
          setIsAuthenticated(true);
          setQrCode(null);
          setError("");
          stopPolling();
          if (onAuthenticationChange) {
            onAuthenticationChange(true);
          }
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 3000); // Check every 3 seconds
    
    setPollingInterval(interval);
  }, [pollingInterval, onAuthenticationChange]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  }, [pollingInterval]);

  // Fetch QR code
  const fetchQRCode = async () => {
    setLoading(true);
    setError("");
    await checkAuthStatus();
    setLoading(false);
  };

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">WhatsApp Authentication</h3>
      
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}
      
      {isAuthenticated ? (
        <div className="flex items-center justify-center gap-2 text-green-600">
          <CheckCircle size={20} />
          <span>WhatsApp is connected and ready!</span>
        </div>
      ) : (
        <div className="space-y-3">
          {qrCode ? (
            <div>
              <img src={qrCode} alt="QR Code" className="mx-auto mb-2 max-w-64" />
              <p className="text-sm text-gray-600 mb-2">Scan this QR code with WhatsApp</p>
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <Loader className="animate-spin" size={16} />
                <span className="text-sm">Waiting for scan...</span>
              </div>
              <button
                onClick={fetchQRCode}
                className="mt-2 px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                <RefreshCw size={14} className="inline mr-1" />
                Refresh QR
              </button>
            </div>
          ) : (
            <button
              onClick={fetchQRCode}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2 mx-auto"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={16} />
                  Connecting...
                </>
              ) : (
                <>
                  <MessageCircle size={16} />
                  Connect WhatsApp
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

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
  const [debugInfo, setDebugInfo] = useState("");
  const [isWhatsAppAuthenticated, setIsWhatsAppAuthenticated] = useState(false);

  // Handle WhatsApp authentication state change
  const handleAuthenticationChange = useCallback((authenticated) => {
    setIsWhatsAppAuthenticated(authenticated);
  }, []);

  // Memoized validation function
  const validation = useMemo(() => {
    const errors = {};
    
    if (!formData.users.trim()) {
      errors.users = "Please provide at least one phone number";
    }
    
    if (!formData.message.trim()) {
      errors.message = "Please provide a message";
    }
    
    if (!formData.campaignName.trim()) {
      errors.campaignName = "Please provide a campaign name";
    }
    
    // Validate phone number format (basic validation)
    const phoneNumbers = formData.users.split('\n').filter(num => num.trim());
    const invalidNumbers = phoneNumbers.filter(num => 
      !num.trim().match(/^\+?[\d\s-()]+$/) || num.trim().length < 10
    );
    
    if (phoneNumbers.length > 0 && invalidNumbers.length > 0) {
      errors.users = `Invalid phone number format: ${invalidNumbers[0]}`;
    }
    
    return {
      errors,
      isValid: Object.keys(errors).length === 0 && isWhatsAppAuthenticated
    };
  }, [formData.users, formData.message, formData.campaignName, isWhatsAppAuthenticated]);

  // Optimized input handler using useCallback
  const handleInputChange = useCallback((field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (error) setError("");
    if (debugInfo) setDebugInfo("");
  }, [error, debugInfo]);

  // Optimized media handler
  const handleMediaChange = useCallback((e) => {
    const file = e.target.files[0];
    
    // File validation
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB limit (match backend)
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      
      if (file.size > maxSize) {
        setError("File size must be less than 10MB");
        return;
      }
      
      if (!allowedTypes.includes(file.type)) {
        setError("Unsupported file type. Please use JPEG, PNG, or PDF files only.");
        return;
      }
    }
    
    setMedia(file);
    if (error) setError("");
  }, [error]);

  // Remove media file
  const removeMedia = useCallback(() => {
    setMedia(null);
  }, []);

  // Debug function to log request data
  const debugRequest = useCallback((apiFormData) => {
    const debugData = {
      users: formData.users,
      message: formData.message,
      campaignName: formData.campaignName,
      hasMedia: !!media,
      mediaName: media?.name,
      mediaSize: media?.size,
      mediaType: media?.type,
      phoneCount: formData.users.split('\n').filter(num => num.trim()).length,
      isWhatsAppAuthenticated
    };
    
    setDebugInfo(`Debug Info: ${JSON.stringify(debugData, null, 2)}`);
    console.log('Request Debug Info:', debugData);
    
    // Log FormData contents
    console.log('FormData contents:');
    for (let [key, value] of apiFormData.entries()) {
      console.log(`${key}:`, typeof value === 'object' ? `File: ${value.name}` : value);
    }
  }, [formData, media, isWhatsAppAuthenticated]);

  // API call with better error handling
  const sendMessages = useCallback(async () => {
    // Check authentication first
    if (!isWhatsAppAuthenticated) {
      throw new Error("WhatsApp is not authenticated. Please scan the QR code first.");
    }

    const apiFormData = new FormData();
    
    // Ensure all required fields are properly set
    const formattedRecipients = formData.users
      .split('\n')
      .filter(num => num.trim())
      .map(number => ({ phoneNumber: number.trim() })); // Format as objects

    apiFormData.append("users", JSON.stringify(formattedRecipients));
    apiFormData.append("message", formData.message.trim());
    apiFormData.append("campaignName", formData.campaignName.trim());
    
    if (media) {
      apiFormData.append("media", media);
    }

    // Debug the request
    debugRequest(apiFormData);

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      console.log('Sending request to:', "http://localhost:3000/api/whatsapp/send");
      
      const response = await fetch("http://localhost:3000/api/whatsapp/send", {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: apiFormData
      });

      const result = await response.json();
      
      if (!response.ok) {
        // Handle specific error cases
        if (result.needsQR) {
          setIsWhatsAppAuthenticated(false);
          throw new Error("WhatsApp authentication expired. Please scan QR code again.");
        }
        throw new Error(result.error || `HTTP ${response.status}`);
      }
      
      console.log('Success response:', result);
      setResponse(`✅ ${result.message || "Messages sent successfully!"} 
        Sent: ${result.totalSent || 0}, Failed: ${result.totalFailed || 0}`);
      
      // Reset form on success
      setFormData({ users: "", message: "", campaignName: "" });
      setMedia(null);
      setDebugInfo("");
      
    } catch (error) {
      console.error("Error sending messages:", error);
      
      let errorMessage = "Error sending messages. Please try again.";
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = "❌ Cannot connect to server. Please check if the server is running.";
      } else if (error.message.includes('HTTP 400')) {
        errorMessage = "❌ Bad request. Please check your input data.";
      } else if (error.message.includes('HTTP 401')) {
        errorMessage = "❌ Authentication failed. Please log in again.";
      } else if (error.message.includes('HTTP 500')) {
        errorMessage = "❌ Server error. Please try again later.";
      } else {
        errorMessage = `❌ ${error.message}`;
      }
      
      setError(errorMessage);
      setResponse("");
    }
  }, [formData, media, debugRequest, isWhatsAppAuthenticated]);

  // Main submit handler
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    setError("");
    setResponse("");
    setDebugInfo("");

    // Validate form
    if (!validation.isValid) {
      if (!isWhatsAppAuthenticated) {
        setError("❌ Please authenticate WhatsApp first by scanning the QR code");
      } else {
        setError(`❌ ${Object.values(validation.errors)[0]}`);
      }
      return;
    }

    setIsLoading(true);

    try {
      await sendMessages();
    } finally {
      setIsLoading(false);
    }
  }, [validation, sendMessages, isWhatsAppAuthenticated]);

  // Memoized phone number count
  const phoneNumberCount = useMemo(() => {
    return formData.users.split('\n').filter(num => num.trim()).length;
  }, [formData.users]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md border border-gray-300">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-gray-300">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <MessageCircle className="text-blue-600" size={30} />
            <h1 className="text-3xl font-semibold text-gray-900">
              WhatsApp Sender
            </h1>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <HelpCircle size={16} className="text-blue-600" />
            <span>Need help?</span>
            <a 
              href="https://www.youtube.com/watch?v=4_ryUZFdLfo&ab_channel=Vedive" 
              className="text-blue-600 underline hover:text-blue-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch tutorial
            </a>
          </div>
        </header>

        <main className="p-6 space-y-6">
          {/* QR Code Display Section */}
          <QRCodeDisplay onAuthenticationChange={handleAuthenticationChange} />

          {/* Error/Success Messages */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-300 rounded-lg">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-700 whitespace-pre-wrap">{error}</p>
              </div>
            </div>
          )}

          {response && (
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-300 rounded-lg">
              <div className="w-5 h-5 bg-green-500 rounded-full flex-shrink-0 mt-0.5"></div>
              <div className="flex-1">
                <p className="text-sm text-green-700 whitespace-pre-wrap">{response}</p>
              </div>
            </div>
          )}

          {/* Debug Info */}
          {debugInfo && (
            <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg">
              <details>
                <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                  Debug Information (Click to expand)
                </summary>
                <pre className="text-xs text-gray-600 overflow-x-auto">{debugInfo}</pre>
              </details>
            </div>
          )}

          {/* Form Section */}
          <div className="space-y-6">
            {/* Campaign Name Input */}
            <div>
              <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Name:
              </label>
              <input
                id="campaignName"
                type="text"
                value={formData.campaignName}
                onChange={handleInputChange('campaignName')}
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter campaign name (e.g., 'Product Launch 2024')"
                required
              />
            </div>

            {/* Users and Message Inputs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Phone Numbers Input */}
              <div>
                <label htmlFor="users" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Numbers ({phoneNumberCount} numbers):
                </label>
                <textarea
                  id="users"
                  value={formData.users}
                  onChange={handleInputChange('users')}
                  className="w-full h-48 text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter phone numbers (one per line):&#10;+1234567890&#10;+0987654321&#10;..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter one phone number per line. Include country code (e.g., +91 for India)
                </p>
              </div>

              {/* Message Input */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message:
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleInputChange('message')}
                  className="w-full h-48 text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter your message here..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your message content. URLs will be automatically tracked for analytics.
                </p>
              </div>
            </div>

            {/* Media Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Media Attachment (Optional):
              </label>
              
              {!media ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload an image or PDF file
                  </p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={handleMediaChange}
                    className="hidden"
                    id="media-upload"
                  />
                  <label
                    htmlFor="media-upload"
                    className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
                  >
                    Choose File
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Supported: JPEG, PNG, PDF • Max size: 10MB
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-300 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      {media.type.startsWith('image/') ? '🖼️' : '📄'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{media.name}</p>
                      <p className="text-xs text-gray-500">
                        {(media.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeMedia}
                    className="p-1 hover:bg-gray-200 rounded-full"
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || !validation.isValid}
                className="flex items-center space-x-2 px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>Sending Messages...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Send Messages ({phoneNumberCount})</span>
                  </>
                )}
              </button>
            </div>
            
            {/* WhatsApp Status Indicator */}
            <div className="text-center">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                isWhatsAppAuthenticated 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isWhatsAppAuthenticated ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                WhatsApp {isWhatsAppAuthenticated ? 'Connected' : 'Disconnected'}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">How to use:</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Click "Connect WhatsApp" and scan the QR code with your WhatsApp</li>
              <li>2. Wait for the green "Connected" status</li>
              <li>3. Enter a campaign name for tracking</li>
              <li>4. Add phone numbers (one per line with country code)</li>
              <li>5. Write your message</li>
              <li>6. Optionally attach an image or PDF file</li>
              <li>7. Click "Send Messages" to start the campaign</li>
            </ol>
            <p className="text-xs text-blue-700 mt-2">
              Note: Messages are sent with a 1-second delay between each to avoid rate limiting.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MessageForm;