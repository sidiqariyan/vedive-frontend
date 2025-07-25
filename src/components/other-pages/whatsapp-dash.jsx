import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  MessageSquare,
  Users,
  TrendingUp,
  Eye,
  RefreshCw,
  Loader,
  AlertCircle,
  CheckCircle,
  Phone,
  Calendar,
  ArrowLeft,
  Activity,
  Target,
  Zap,
  Shield,
  WifiOff
} from 'lucide-react';
import { Link } from 'react-router-dom';


const API_BASE_URL = 'http://localhost:3000';

// API helper function with auth headers
const apiCall = async (endpoint, options = {}) => {
  try {
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Individual Metric Card Component
const MetricCard = ({ title, value, icon: Icon, color, trend, description }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
      {trend !== null && trend !== undefined && (
        <div className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>
  </div>
);

// Campaign Performance Chart Component
const CampaignChart = ({ campaigns }) => {
  const chartData = campaigns.slice(0, 5).map(campaign => ({
    name: campaign.campaignName && campaign.campaignName.length > 15 
      ? campaign.campaignName.substring(0, 15) + '...' 
      : campaign.campaignName || 'Unnamed Campaign',
    messages: campaign.totalMessages || 0,
    deliveryRate: campaign.deliveryRate || 0,
    openRate: campaign.openRate || 0
  }));

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h3>
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No campaign data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h3>
      <div className="space-y-4">
        {chartData.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{item.name}</span>
              <span className="text-sm text-gray-500">{item.messages.toLocaleString()} messages</span>
            </div>
            <div className="flex space-x-2">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Delivery Rate</span>
                  <span>{item.deliveryRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${Math.min(item.deliveryRate, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Open Rate</span>
                  <span>{item.openRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${Math.min(item.openRate, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Account Status Component
const AccountStatus = ({ accounts, currentAccount }) => {
  if (!accounts || accounts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
        <div className="text-center py-8">
          <WifiOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No WhatsApp accounts connected</p>
          <p className="text-sm text-gray-400">Connect a WhatsApp account to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
      <div className="space-y-3">
        {accounts.map((account) => (
          <div
            key={account.phoneNumber}
            className={`p-4 rounded-lg border ${
              currentAccount === account.phoneNumber
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  account.isAuthenticated ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <div>
                  <p className="font-medium text-gray-900">{account.phoneNumber}</p>
                  <p className="text-sm text-gray-500">
                    {account.campaignCount || 0} campaigns
                  </p>
                </div>
              </div>
              {currentAccount === account.phoneNumber && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Authentication Required Component
const AuthenticationRequired = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
        <Shield className="w-8 h-8 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
      <p className="text-gray-600 mb-6">
        You need to authenticate at least one WhatsApp account before accessing the analytics dashboard.
      </p>
      <div className="space-y-3">
      <Link
        to="/whatsapp-sender"
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors block text-center"
      >
        Authenticate WhatsApp Account
      </Link>

      <Link
        to="/dashboard"
        className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors block text-center"
      >
        Go to Dashboard
      </Link>
      </div>
    </div>
  </div>
);

// Main Analytics Dashboard Component
const AnalyticsDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [hasAuthenticatedAccounts, setHasAuthenticatedAccounts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // Fetch analytics data
const fetchAnalytics = async (phoneNumber = null) => {
  setLoading(true);
  setError('');
  try {
    let endpoint;
    
    if (phoneNumber && phoneNumber !== 'all') {
      // Use the account-specific endpoint
      endpoint = `/api/whatsapp/analytics/account/${encodeURIComponent(phoneNumber)}`;
    } else {
      // Use general analytics endpoint
      let queryParams = [];
      if (selectedTimeRange !== 'all') {
        queryParams.push(`timeRange=${selectedTimeRange}`);
      }
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      endpoint = `/api/whatsapp/analytics${queryString}`;
    }

    const data = await apiCall(endpoint);
    
    // Handle different response structures
    if (phoneNumber && phoneNumber !== 'all') {
      // Account-specific response structure
      setCampaigns(data.campaigns || []);
      setCurrentAccount(data.phoneNumber || phoneNumber);
      // You'll need to fetch all accounts separately for the account status
      const allAccountsData = await apiCall('/api/whatsapp/analytics');
      const allAccounts = allAccountsData.whatsappAccounts || [];
      setAccounts(allAccounts);
      
      // FIXED: Check authentication status AFTER setting accounts
      const authenticatedAccounts = allAccounts.filter(acc => acc.isAuthenticated);
      setHasAuthenticatedAccounts(authenticatedAccounts.length > 0);
    } else {
      // General analytics response structure
      const allAccounts = data.whatsappAccounts || [];
      setCampaigns(data.campaigns || []);
      setAccounts(allAccounts);
      setCurrentAccount(data.currentAccount || null);
      
      // FIXED: Check authentication status AFTER setting accounts
      const authenticatedAccounts = allAccounts.filter(acc => acc.isAuthenticated);
      setHasAuthenticatedAccounts(authenticatedAccounts.length > 0);
    }
    
    if (data.message) {
      setSuccess(data.message);
    }
  } catch (error) {
    setError(error.message);
    // FIXED: Only set to false on actual error, not just because of missing data
    console.error('Analytics fetch error:', error);
  } finally {
    setLoading(false);
  }
};

const handlePageChange = (page) => {
  setCurrentPage(page);
};

const handlePreviousPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};

const handleNextPage = () => {
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
  }
};
  // Filter campaigns based on selected filters
  const filteredCampaigns = campaigns.filter(campaign => {
    if (selectedAccount !== 'all' && campaign.senderPhoneNumber !== selectedAccount) {
      return false;
    }
    
    if (!campaign.createdAt) return true;
    
    const campaignDate = new Date(campaign.createdAt);
    const now = new Date();
    const daysDiff = Math.floor((now - campaignDate) / (1000 * 60 * 60 * 24));
    
    switch (selectedTimeRange) {
      case '7d': return daysDiff <= 7;
      case '30d': return daysDiff <= 30;
      case '90d': return daysDiff <= 90;
      default: return true;
    }
  });

  // Calculate metrics dynamically
  const totalMessages = filteredCampaigns.reduce((sum, campaign) => sum + (campaign.totalMessages || 0), 0);
  const averageDeliveryRate = filteredCampaigns.length > 0 
    ? Math.round(filteredCampaigns.reduce((sum, c) => sum + (c.deliveryRate || 0), 0) / filteredCampaigns.length) 
    : 0;
  const averageOpenRate = filteredCampaigns.length > 0 
    ? Math.round(filteredCampaigns.reduce((sum, c) => sum + (c.openRate || 0), 0) / filteredCampaigns.length) 
    : 0;
  const successfulCampaigns = filteredCampaigns.filter(c => c.status === 'completed').length;
  const activeAccounts = accounts.filter(acc => acc.isAuthenticated).length;
const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const paginatedCampaigns = filteredCampaigns.slice(startIndex, endIndex);


  // Load analytics data when component mounts
  useEffect(() => {
    fetchAnalytics();
  }, []);
useEffect(() => {
  fetchAnalytics(selectedAccount === 'all' ? null : selectedAccount);
}, [selectedAccount, selectedTimeRange]); // Add selectedTimeRange as dependency

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

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  // Show authentication required if no authenticated accounts
  if (!hasAuthenticatedAccounts) {
    return <AuthenticationRequired />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Whatsapp Analytics</h1>
                  <p className="text-sm text-gray-500">
                    WhatsApp Campaign Performance & Insights
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => fetchAnalytics()}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

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
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="all">All time</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedAccount}
                  onChange={(e) => {
                    const newAccount = e.target.value;
                    setSelectedAccount(newAccount);
                    setCurrentPage(1); // Reset pagination
                    // Immediately fetch data for the new account
                    fetchAnalytics(newAccount === 'all' ? null : newAccount);
                  }}
                  className="border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >                 
                <option value="all">All Accounts</option>
                  {accounts.filter(acc => acc.isAuthenticated).map(account => (
                    <option key={account.phoneNumber} value={account.phoneNumber}>
                      {account.phoneNumber}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Campaigns"
            value={filteredCampaigns.length}
            icon={Target}
            color="bg-blue-600"
            description="Active campaigns"
          />
          <MetricCard
            title="Messages Sent"
            value={totalMessages.toLocaleString()}
            icon={MessageSquare}
            color="bg-green-600"
            description="Across all campaigns"
          />
          <MetricCard
            title="Avg Delivery Rate"
            value={`${averageDeliveryRate}%`}
            icon={Zap}
            color="bg-purple-600"
            description="Message delivery success"
          />
          <MetricCard
            title="Avg Open Rate"
            value={`${averageOpenRate}%`}
            icon={Eye}
            color="bg-orange-600"
            description="Message engagement"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Successful Campaigns"
            value={successfulCampaigns}
            icon={CheckCircle}
            color="bg-emerald-600"
            description="Completed successfully"
          />
          <MetricCard
            title="Active Accounts"
            value={activeAccounts}
            icon={Users}
            color="bg-indigo-600"
            description="Connected WhatsApp accounts"
          />
          <MetricCard
            title="Success Rate"
            value={`${filteredCampaigns.length > 0 ? Math.round((successfulCampaigns / filteredCampaigns.length) * 100) : 0}%`}
            icon={TrendingUp}
            color="bg-rose-600"
            description="Campaign success rate"
          />
        </div>

        {/* Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <CampaignChart campaigns={filteredCampaigns} />
          </div>
          <div>
            <AccountStatus accounts={accounts} currentAccount={currentAccount} />
          </div>
        </div>

{/* Campaign Details Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Campaign Details</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Activity className="w-4 h-4" />
                <span>{filteredCampaigns.length} campaigns</span>
              </div>
            </div>
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
                {(() => {                  
                  return paginatedCampaigns.length > 0 ? (
                    paginatedCampaigns.map((campaign, index) => (
                    <tr key={campaign.campaignId || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {campaign.campaignName || 'Unnamed Campaign'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            campaign.connectionStatus?.isConnected ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                          <div className="text-sm text-gray-900">
                            {campaign.phoneNumber || campaign.senderPhoneNumber || currentAccount || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {(campaign.totalMessages || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm text-gray-900 font-medium mr-2">
                            {campaign.deliveryRate || 0}%
                          </div>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${Math.min(campaign.deliveryRate || 0, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm text-gray-900 font-medium mr-2">
                            {campaign.openRate || 0}%
                          </div>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${Math.min(campaign.openRate || 0, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          campaign.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : campaign.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : campaign.status === 'running'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {campaign.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                        {campaign.createdAt && (
                          <div className="text-sm text-gray-500">
                            {new Date(campaign.createdAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              hour12: true 
                            })}
                          </div>
                        )}
                      </td>
                    </tr>
                                      ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <BarChart3 className="w-12 h-12 text-gray-400 mb-4" />
                          <p className="text-gray-500 text-lg">No campaigns found</p>
                          <p className="text-gray-400 text-sm">Try adjusting your filters or create a new campaign</p>
                        </div>
                      </td>
                    </tr>
                  );
                })()}
              </tbody>
            </table>
          </div>
          
{/* Pagination Controls */}
{filteredCampaigns.length > itemsPerPage && (
  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredCampaigns.length)} to{' '}
        {Math.min(currentPage * itemsPerPage, filteredCampaigns.length)} of{' '}
        {filteredCampaigns.length} campaigns
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 text-sm rounded-md ${
                currentPage === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        
        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(filteredCampaigns.length / itemsPerPage)}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  </div>
)}
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;