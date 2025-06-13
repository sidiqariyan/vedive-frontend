import React, { useState, useEffect } from 'react';
import { 
BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  Mail, 
  MousePointer, 
  Eye, 
  Users, 
  TrendingUp, 
  Calendar,
  Activity,
  Target,
  BarChart3,
  Clock,
  ExternalLink,
  Download,
  Filter,
  Search,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';


const API_BASE_URL = 'https://vedive.com:3000/api';

const MailDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [detailedAnalytics, setDetailedAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // API helper function
  const apiRequest = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        ...options,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  };

  // Fetch analytics summary - FIXED ENDPOINT
const fetchAnalyticsSummary = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics/summary`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    setAnalyticsData(response.data);
  } catch (error) {
    setError('Failed to fetch analytics summary');
    console.error('Analytics summary error:', error);
  }
};

// Fetch all campaigns
const fetchCampaigns = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/campaigns`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    setCampaigns(response.data);
  } catch (error) {
    setError('Failed to fetch campaigns');
    console.error('Campaigns fetch error:', error);
  }
};

// Fetch detailed campaign analytics
const fetchCampaignDetails = async (campaignId) => {
  try {
    setLoading(true);
    const response = await axios.get(`${API_BASE_URL}/campaigns/${campaignId}/analytics`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    setDetailedAnalytics(response.data);
  } catch (error) {
    setError('Failed to fetch campaign details');
    console.error('Campaign details error:', error);
  } finally {
    setLoading(false);
  }
};

// Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        await Promise.all([
          fetchAnalyticsSummary(),
          fetchCampaigns()
        ]);
      } catch (error) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Refresh data
  const refreshData = async () => {
    setError(null);
    await Promise.all([
      fetchAnalyticsSummary(),
      fetchCampaigns()
    ]);
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue', trend }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600 mt-1`}>{value}</p>
          {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {Math.abs(trend)}% vs last week
            </div>
          )}
        </div>
        <div className={`bg-${color}-100 p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const CampaignCard = ({ campaign, onClick }) => (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer"
      onClick={() => onClick(campaign)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-gray-900 text-lg">{campaign.campaignName}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          campaign.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {campaign.status}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Recipients</p>
          <p className="text-xl font-bold text-gray-900">{campaign.analytics?.totalRecipients?.toLocaleString() || campaign.totalRecipients?.toLocaleString() || 0}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Open Rate</p>
          <p className="text-xl font-bold text-blue-600">{campaign.analytics?.openRate || campaign.openRate || 0}%</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Clicks</p>
          <p className="text-lg font-semibold text-green-600">{campaign.analytics?.uniqueClicks || campaign.uniqueClicks || 0}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Click Rate</p>
          <p className="text-lg font-semibold text-green-600">{campaign.analytics?.clickRate || campaign.clickRate || 0}%</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Created {new Date(campaign.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );

const RecipientStatusTable = ({ recipients, searchTerm, filterStatus }) => {
  if (!recipients || recipients.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No recipient data available</p>
      </div>
    );
  }

  const filteredRecipients = recipients.filter(recipient => {
    // Safe check for email and name fields
    const email = recipient.email || '';
    const name = recipient.name || '';
    
    const matchesSearch = email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || recipient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'clicked': return 'bg-green-100 text-green-800';
      case 'opened': return 'bg-blue-100 text-blue-800';
      case 'not_opened': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Recipient Activity</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search recipients..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="clicked">Clicked</option>
              <option value="opened">Opened</option>
              <option value="not_opened">Not Opened</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opens</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clicks</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRecipients.map((recipient, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{recipient.name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{recipient.email || 'N/A'}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(recipient.status)}`}>
                    {recipient.status?.replace('_', ' ') || 'unknown'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{recipient.openCount || 0}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{recipient.clickCount || 0}</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {recipient.lastClicked ? new Date(recipient.lastClicked).toLocaleDateString() : 
                   recipient.lastOpened ? new Date(recipient.lastOpened).toLocaleDateString() : 
                   'No activity'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

  const ErrorMessage = ({ message, onRetry }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
        <p className="text-red-800">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-auto px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );

  if (loading && !analyticsData && !campaigns.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mail Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Track and analyze your email campaign performance</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </button>
              <button 
                onClick={refreshData}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'campaigns', name: 'Campaigns', icon: Mail },
                { id: 'recipients', name: 'Recipients', icon: Users },
                { id: 'analytics', name: 'Analytics', icon: Activity }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <ErrorMessage message={error} onRetry={refreshData} />}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {analyticsData?.summary ? (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard
                    title="Total Campaigns"
                    value={analyticsData.summary.totalCampaigns}
                    icon={Mail}
                    color="blue"
                  />
                  <StatCard
                    title="Total Recipients"
                    value={analyticsData.summary.totalRecipients.toLocaleString()}
                    icon={Users}
                    color="green"
                  />
                  <StatCard
                    title="Overall Open Rate"
                    value={`${analyticsData.summary.overallOpenRate}%`}
                    subtitle={`${analyticsData.summary.totalUniqueOpens.toLocaleString()} opens`}
                    icon={Eye}
                    color="purple"
                  />
                  <StatCard
                    title="Overall Click Rate"
                    value={`${analyticsData.summary.overallClickRate}%`}
                    subtitle={`${analyticsData.summary.totalUniqueClicks.toLocaleString()} clicks`}
                    icon={MousePointer}
                    color="orange"
                  />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Performance Overview */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Opened', value: analyticsData.summary.overallOpenRate, fill: '#3B82F6' },
                            { name: 'Not Opened', value: analyticsData.summary.overallNotOpenRate, fill: '#E5E7EB' }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                        />
                        <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Top Performing Campaigns */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold mb-4">Top Performing Campaigns</h3>
                    <div className="space-y-3">
                      {analyticsData.topPerformers?.byOpenRate?.slice(0, 5).map((campaign, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{campaign.campaignName}</p>
                            <p className="text-sm text-gray-500">{campaign.totalRecipients} recipients</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-blue-600">{campaign.openRate}%</p>
                            <p className="text-xs text-gray-500">open rate</p>
                          </div>
                        </div>
                      )) || <p className="text-gray-500 text-center py-4">No campaign data available</p>}
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Recent Activity (Last 7 Days)</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      Updated just now
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{analyticsData.recentActivity?.recentCampaigns || 0}</p>
                      <p className="text-gray-600">New Campaigns</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{analyticsData.recentActivity?.recentOpenEvents || 0}</p>
                      <p className="text-gray-600">Email Opens</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">{analyticsData.recentActivity?.recentClickEvents || 0}</p>
                      <p className="text-gray-600">Link Clicks</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No analytics data available</p>
              </div>
            )}
          </>
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">All Campaigns</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <select className="px-4 py-2 border border-gray-200 rounded-lg">
                  <option>All Status</option>
                  <option>Completed</option>
                  <option>Pending</option>
                </select>
              </div>
            </div>
            
            {campaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign._id}
                    campaign={campaign}
                    onClick={(campaign) => {
                      setSelectedCampaign(campaign);
                      fetchCampaignDetails(campaign._id);
                      setActiveTab('analytics');
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No campaigns found</p>
              </div>
            )}
          </div>
        )}

        {/* Recipients Tab */}
        {activeTab === 'recipients' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Recipient Analysis</h2>
            {detailedAnalytics?.detailedAnalytics?.recipientStatus ? (
              <RecipientStatusTable
                recipients={detailedAnalytics.detailedAnalytics.recipientStatus}
                searchTerm={searchTerm}
                filterStatus={filterStatus}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a campaign to view recipient details</p>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Campaign Analytics</h2>
                <p className="text-gray-600">{selectedCampaign?.campaignName || 'Select a campaign'}</p>
              </div>
              <button
                onClick={() => setActiveTab('campaigns')}
                className="px-4 py-2 text-blue-600 hover:text-blue-800"
              >
                ← Back to Campaigns
              </button>
            </div>

            {detailedAnalytics ? (
              <>
                {/* Campaign Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <StatCard
                    title="Total Recipients"
                    value={detailedAnalytics.campaign?.analytics?.totalRecipients || 0}
                    icon={Users}
                    color="blue"
                  />
                  <StatCard
                    title="Unique Opens"
                    value={detailedAnalytics.campaign?.analytics?.uniqueOpens || 0}
                    subtitle={`${detailedAnalytics.campaign?.analytics?.openRate || 0}%`}
                    icon={Eye}
                    color="green"
                  />
                  <StatCard
                    title="Unique Clicks"
                    value={detailedAnalytics.campaign?.analytics?.uniqueClicks || 0}
                    subtitle={`${detailedAnalytics.campaign?.analytics?.clickRate || 0}%`}
                    icon={MousePointer}
                    color="purple"
                  />
                  <StatCard
                    title="Click-to-Open Rate"
                    value={`${detailedAnalytics.campaign?.analytics?.clickToOpenRate || 0}%`}
                    icon={Target}
                    color="orange"
                  />
                </div>

                {/* Hourly Activity Chart */}
                {detailedAnalytics.detailedAnalytics?.hourlyData && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold mb-4">24-Hour Activity</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={detailedAnalytics.detailedAnalytics.hourlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="opens" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="clicks" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Recipient Status Table */}
                <RecipientStatusTable
                  recipients={detailedAnalytics.detailedAnalytics?.recipientStatus || []}
                  searchTerm={searchTerm}
                  filterStatus={filterStatus}
                />
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a campaign from the Campaigns tab to view detailed analytics</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MailDashboard;