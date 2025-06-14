import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Send, 
  BarChart3, 
  Settings, 
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  MessageSquare,
  Eye,
  TrendingUp,
  Smartphone,
  Upload,
  Download,
  RefreshCw,
  AlertCircle,
  Loader
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000';

const MessageForm = () => {
  const [activeTab, setActiveTab] = useState('accounts');
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Campaign form state
  const [campaignForm, setCampaignForm] = useState({
    campaignName: '',
    message: '',
    users: '',
    mediaFile: null
  });

  // API helper function
  const apiCall = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  // Fetch QR code and existing accounts
  const fetchQRCode = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiCall('/api/whatsapp/qr');
      setQrCode(data.qrCode);
      setAccounts(data.existingAccounts || []);
      setCurrentAccount(data.currentAccount);
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
  const sendCampaign = async (e) => {
    e.preventDefault();
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
        body: formData
      });
      
      if (!response.ok) {
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
      fetchAnalytics(); // Refresh analytics
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch analytics
  const fetchAnalytics = async (phoneNumber = null) => {
    setLoading(true);
    try {
      const queryParam = phoneNumber ? `?phoneNumber=${phoneNumber}` : '';
      const data = await apiCall(`/api/whatsapp/analytics${queryParam}`);
      setCampaigns(data.campaigns || []);
      setAccounts(data.whatsappAccounts || []);
      setCurrentAccount(data.currentAccount);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh QR code every 30 seconds when needed
  useEffect(() => {
    if (activeTab === 'accounts' && qrCode && !currentAccount) {
      const interval = setInterval(fetchQRCode, 30000);
      return () => clearInterval(interval);
    }
  }, [activeTab, qrCode, currentAccount]);

  // Load initial data
  useEffect(() => {
    if (activeTab === 'accounts') {
      fetchQRCode();
    } else if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab]);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">WhatsApp Bulk Sender</h1>
                <p className="text-sm text-gray-500">
                  {currentAccount ? `Connected: ${currentAccount}` : 'No account connected'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'accounts', label: 'Accounts', icon: Phone },
              { id: 'send', label: 'Send Campaign', icon: Send },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Notifications */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-green-800">{success}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'accounts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">WhatsApp Accounts</h2>
              <button
                onClick={fetchQRCode}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                <span>Refresh</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* QR Code Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Add New Account</h3>
                {qrCode ? (
                  <div className="text-center">
                    <img src={qrCode} alt="QR Code" className="mx-auto mb-4 border rounded-lg" />
                    <p className="text-sm text-gray-600">Scan this QR code with WhatsApp</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    {currentAccount ? (
                      <div>
                        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                        <p className="text-green-700 font-medium">{currentAccount} is connected!</p>
                      </div>
                    ) : (
                      <div>
                        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Click refresh to generate QR code</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Accounts List */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Connected Accounts</h3>
                <div className="space-y-3">
                  {accounts.length > 0 ? (
                    accounts.map((account) => (
                      <div
                        key={account.phoneNumber}
                        className={`p-4 rounded-lg border ${
                          currentAccount === account.phoneNumber
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } cursor-pointer transition-colors`}
                        onClick={() => switchAccount(account.phoneNumber)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              account.isAuthenticated ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                            <div>
                              <p className="font-medium text-gray-900">{account.phoneNumber}</p>
                              <p className="text-sm text-gray-500">
                                {account.campaignCount} campaigns sent
                              </p>
                            </div>
                          </div>
                          {account.isAuthenticated ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Last connected: {new Date(account.lastConnected).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No accounts connected</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'send' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Campaign</h2>
            
            {!currentAccount ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
                  <span className="text-yellow-800">Please connect a WhatsApp account first</span>
                </div>
              </div>
            ) : (
              <form onSubmit={sendCampaign} className="bg-white rounded-lg shadow p-6 space-y-6">  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Name *
                  </label>
                  <input
                    type="text"
                    value={campaignForm.campaignName}
                    onChange={(e) => setCampaignForm(prev => ({ ...prev, campaignName: e.target.value }))}
                    className="w-full text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter campaign name..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={campaignForm.message}
                    onChange={(e) => setCampaignForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                    className="w-full text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your message..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Numbers * (one per line)
                  </label>
                  <textarea
                    value={campaignForm.users}
                    onChange={(e) => setCampaignForm(prev => ({ ...prev, users: e.target.value }))}
                    rows={6}
                    className="w-full text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter phone numbers, one per line...&#10;+919876543210&#10;+918765432109"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Media File (optional)
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setCampaignForm(prev => ({ ...prev, mediaFile: e.target.files[0] }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !currentAccount}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Campaign</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Campaign Analytics</h2>
              <button
                onClick={() => fetchAnalytics()}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                <span>Refresh</span>
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                    <p className="text-2xl font-semibold text-gray-900">{campaigns.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Messages</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {campaigns.reduce((sum, campaign) => sum + campaign.totalMessages, 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Delivery Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {campaigns.length > 0 
                        ? Math.round(campaigns.reduce((sum, c) => sum + c.deliveryRate, 0) / campaigns.length) 
                        : 0}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Eye className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Open Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {campaigns.length > 0 
                        ? Math.round(campaigns.reduce((sum, c) => sum + c.openRate, 0) / campaigns.length) 
                        : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Campaigns Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Campaign History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Campaign
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sender
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Messages
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivery Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Open Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {campaigns.length > 0 ? (
                      campaigns.map((campaign) => (
                        <tr key={campaign.campaignId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {campaign.campaignName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                campaign.connectionStatus?.isConnected ? 'bg-green-500' : 'bg-gray-400'
                              }`} />
                              <div className="text-sm text-gray-900">
                                {campaign.senderPhoneNumber}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {campaign.totalMessages}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {campaign.deliveryRate}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {campaign.openRate}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              campaign.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : campaign.status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {campaign.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(campaign.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                          No campaigns found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MessageForm;