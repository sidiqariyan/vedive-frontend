import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Send, 
  Plus,
  CheckCircle,
  XCircle,
  Users,
  MessageSquare,
  RefreshCw,
  AlertCircle,
  Loader,
  X,
  Upload,
  HelpCircle
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000';

// Your original API helper function - keeping it exactly as is
const apiCall = async (endpoint, options = {}) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please check your token or log in again.');
      }
      const errorData = await response.json();
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

const MessageForm = () => {
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showQR, setShowQR] = useState(false);

  // Campaign form state
  const [campaignForm, setCampaignForm] = useState({
    campaignName: '',
    message: '',
    users: '',
    mediaFile: null
  });

  // Helper function to check if any account is authenticated
  const isAnyAccountAuthenticated = () => {
    return currentAccount && accounts.some(acc => acc.phoneNumber === currentAccount && acc.isAuthenticated);
  };

  // Fetch QR code and existing accounts
  const fetchQRCode = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiCall('/api/whatsapp/qr');
      setQrCode(data.qrCode);
      setAccounts(data.existingAccounts || []);
      
      // Only update currentAccount if it's not already set or if the API explicitly provides one
      if (!currentAccount || data.currentAccount) {
        setCurrentAccount(data.currentAccount);
      }
      
      if (data.message) {
        setSuccess(data.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Switch WhatsApp account
  const switchAccount = async (phoneNumber) => {
    setLoading(true);
    setError('');
    try {
      const response = await apiCall('/api/whatsapp/switch-account', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber })
      });
      setCurrentAccount(phoneNumber);
      setSuccess(response.message);
      if (response.needsReauth) {
        fetchQRCode();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Send campaign
  const sendCampaign = async () => {
    if (!campaignForm.campaignName || !campaignForm.message || !campaignForm.users) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('campaignName', campaignForm.campaignName);
      formData.append('message', campaignForm.message);
      formData.append('users', campaignForm.users);
      if (campaignForm.mediaFile) {
        formData.append('media', campaignForm.mediaFile);
      }

      const response = await fetch(`${API_BASE_URL}/api/whatsapp/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          // Note: Don't set Content-Type for FormData, let browser set it
        },
        body: formData
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please check your token or log in again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send campaign');
      }

      const data = await response.json();
      setSuccess(`Campaign sent successfully! ${data.totalSent} messages sent, ${data.totalFailed} failed`);
      setCampaignForm({
        campaignName: '',
        message: '',
        users: '',
        mediaFile: null
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle add new account
  const handleAddNewAccount = () => {
    setShowQR(true);
    fetchQRCode();
  };

  // Auto-refresh QR code every 30 seconds when needed
  useEffect(() => {
    if (qrCode && !currentAccount && showQR) {
      const interval = setInterval(fetchQRCode, 30000);
      return () => clearInterval(interval);
    }
  }, [qrCode, currentAccount, showQR]);

  // Load initial data
  useEffect(() => {
    fetchQRCode();
  }, []);

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">WhatsApp Bulk Sender</h1>
              <p className="text-sm text-gray-500 flex items-center space-x-2">
                <span>{currentAccount ? `Connected: ${currentAccount}` : 'No account connected'}</span>
                <div className="flex items-center space-x-1">
                  <HelpCircle className="w-4 h-4 text-blue-500" />
                  <span className="text-blue-500 hover:underline cursor-pointer">Need help? Watch tutorial</span>
                </div>
              </p>
            </div>
          </div>
          <button
            onClick={fetchQRCode}
            disabled={loading}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="max-w-6xl mx-auto mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="max-w-6xl mx-auto mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-green-800">{success}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Account Management */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Phone className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-900">WhatsApp Accounts</h2>
              </div>

              {/* Connected Accounts */}
              <div className="space-y-3 mb-4">
                {accounts.length > 0 ? (
                  accounts.map((account) => (
                    <div
                      key={account.phoneNumber}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        currentAccount === account.phoneNumber
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => switchAccount(account.phoneNumber)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            account.isAuthenticated ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <p className="font-medium text-gray-900 text-sm">{account.phoneNumber}</p>
                        </div>
                        {account.isAuthenticated ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        <p>{account.campaignCount} campaigns sent</p>
                        <p>Last: {new Date(account.lastConnected).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Phone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm">No accounts connected</p>
                  </div>
                )}
              </div>

              <button
                onClick={handleAddNewAccount}
                className="w-full bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Account</span>
              </button>
            </div>
          </div>

          {/* Right Column - Campaign Configuration */}
          <div className="lg:col-span-2">
            {!currentAccount ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">Account Required</h3>
                <p className="text-gray-500 mb-4">Please connect a WhatsApp account first to send campaigns</p>
                <button
                  onClick={handleAddNewAccount}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Connect Account
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Campaign Configuration */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Send className="w-5 h-5 text-blue-500" />
                    <h2 className="text-lg font-semibold text-gray-900">Campaign Configuration</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Campaign Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Campaign Name
                      </label>
                      <input
                        type="text"
                        value={campaignForm.campaignName}
                        onChange={(e) => setCampaignForm(prev => ({ ...prev, campaignName: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                        placeholder="Enter campaign name..."
                      />
                    </div>

                    {/* From Email equivalent - showing connected account */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Account
                      </label>
                      <input
                        type="text"
                        value={currentAccount}
                        disabled
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      value={campaignForm.message}
                      onChange={(e) => setCampaignForm(prev => ({ ...prev, message: e.target.value }))}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder="Enter your message..."
                    />
                  </div>
                </div>

                {/* File Uploads Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Media File */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                      <h3 className="font-medium text-gray-900 mb-2">Media File</h3>
                      <p className="text-sm text-gray-500 mb-4">Upload images, videos, audio, or documents</p>
                      <input
                        type="file"
                        onChange={(e) => setCampaignForm(prev => ({ ...prev, mediaFile: e.target.files[0] }))}
                        className="w-full text-sm"
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                      />
                    </div>
                    {campaignForm.mediaFile && (
                      <p className="text-sm text-green-600 mt-3 text-center">Selected: {campaignForm.mediaFile.name}</p>
                    )}
                  </div>

                  {/* Recipients List */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="text-center">
                      <Users className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                      <h3 className="font-medium text-gray-900 mb-2">Recipients List</h3>
                      <textarea
                        value={campaignForm.users}
                        onChange={(e) => setCampaignForm(prev => ({ ...prev, users: e.target.value }))}
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white text-sm"
                        placeholder="Enter phone numbers, one per line...&#10;+919876543210&#10;+918765432109"
                      />
                    </div>
                  </div>
                </div>

                {/* Reset and Send Buttons */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex justify-between">
                    <button
                      onClick={() => setCampaignForm({
                        campaignName: '',
                        message: '',
                        users: '',
                        mediaFile: null
                      })}
                      className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      onClick={sendCampaign}
                      disabled={loading || !currentAccount}
                      className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {loading ? (
                        <Loader className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                      <span>Send Messages</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

// Replace the QR Code Modal section in your code with this:

{/* QR Code Modal */}
{showQR && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl max-w-md w-full p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Add WhatsApp Account</h3>
        <button
          onClick={() => setShowQR(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="text-center">
        {qrCode ? (
          <div>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              {/* FIXED: Actually display the QR code image */}
              <img 
                src={qrCode} 
                alt="WhatsApp QR Code" 
                className="w-48 h-48 mx-auto bg-white border-2 border-gray-300 rounded-lg"
                onError={(e) => {
                  console.error('QR Code image failed to load:', qrCode);
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback if image fails to load */}
              <div 
                className="w-48 h-48 bg-white border-2 border-dashed border-gray-300 rounded-lg mx-auto items-center justify-center hidden"
                style={{ display: 'none' }}
              >
                <div className="text-center p-4">
                  <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <span className="text-red-500 text-sm">QR Code failed to load</span>
                  <button 
                    onClick={fetchQRCode}
                    className="block mt-2 text-blue-500 text-sm hover:underline"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
            <div className="text-left space-y-2 text-sm text-gray-600">
              <p><strong>1.</strong> Open WhatsApp on your phone</p>
              <p><strong>2.</strong> Go to Settings → Linked Devices</p>
              <p><strong>3.</strong> Tap "Link a Device"</p>
              <p><strong>4.</strong> Scan this QR code</p>
            </div>
          </div>
        ) : (
          <div className="py-8">
            <Loader className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Generating QR code...</p>
          </div>
        )}
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default MessageForm;