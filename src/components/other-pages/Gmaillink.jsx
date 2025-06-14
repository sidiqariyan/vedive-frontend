import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Mail, Eye, EyeOff, TrendingUp, Users, Calendar, Download, RefreshCw, ExternalLink, MousePointer, Clock, Globe, ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';

const LinkTrackingDashboard = () => {
  // Email Analytics States
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  
  // Link Tracking States
  const [linkAnalytics, setLinkAnalytics] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);
  const [linkDetails, setLinkDetails] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  
  // General States
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  // Fetch campaigns on component mount
  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://vedive.com:3000/api/campaigns-with-analytics?toolType=gmail-sender', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch campaigns: ${response.status}`);
      }
      
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      setError('Failed to fetch campaigns');
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaignAnalytics = async (campaignId) => {
    try {
      setLoading(true);
      const response = await fetch(`https://vedive.com:3000/api/analytics/${campaignId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.status}`);
      }
      
      const data = await response.json();
      setAnalytics(data);
      setSelectedCampaign(campaignId);
    } catch (error) {
      setError('Failed to fetch analytics');
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLinkAnalytics = async (campaignId) => {
    try {
      setLoading(true);
      const response = await fetch(`https://vedive.com:3000/api/link-analytics/${campaignId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch link analytics: ${response.status}`);
      }
      
      const data = await response.json();
      setLinkAnalytics(data);
    } catch (error) {
      setError('Could not load link analytics');
      console.error('Error fetching link analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLinkDetails = async (campaignId, originalUrl) => {
    try {
      setLoading(true);
      const response = await fetch(`https://vedive.com:3000/api/link-details/${campaignId}/${encodeURIComponent(originalUrl)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch link details: ${response.status}`);
      }
      
      const data = await response.json();
      setLinkDetails(data);
    } catch (error) {
      setError('Could not load link details');
      console.error('Error fetching link details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignSelect = (campaignId) => {
    setSelectedCampaign(campaignId);
    setAnalytics(null);
    setLinkAnalytics(null);
    setSelectedLink(null);
    setLinkDetails(null);
    setError('');
    
    if (campaignId) {
      fetchCampaignAnalytics(campaignId);
      fetchLinkAnalytics(campaignId);
    }
  };

  const handleLinkClick = (link) => {
    setSelectedLink(link);
    setError('');
    fetchLinkDetails(selectedCampaign, link.originalUrl);
  };

  const toggleRowExpansion = (index) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const downloadCSV = () => {
    if (!analytics) return;

    const csvContent = [
      ['Email', 'Name', 'Opened', 'Open Count', 'Opened At', 'User Agent', 'IP Address'],
      ...analytics.recipients.map(recipient => [
        recipient.email,
        recipient.name || '',
        recipient.opened ? 'Yes' : 'No',
        recipient.openCount,
        recipient.openedAt ? new Date(recipient.openedAt).toLocaleString() : '',
        recipient.userAgent || '',
        recipient.ipAddress || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${analytics.campaign.name}_analytics.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatPercentage = (value) => `${value}%`;
  const formatNumber = (value) => value.toLocaleString();
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const TabButton = ({ tabId, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(tabId)}
      className={`flex items-center space-x-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
        isActive
          ? 'border-blue-500 text-blue-600 bg-blue-50'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Gmail Sender Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {analytics && (
                <button
                  onClick={downloadCSV}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              )}
              <button
                onClick={fetchCampaigns}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => setError('')}
                className="text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Campaign Selection */}
        {!selectedCampaign && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Select a Campaign</h2>
              <p className="text-gray-600 mt-1">Choose a campaign to view detailed analytics and link tracking</p>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading campaigns...</p>
                </div>
              ) : campaigns.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="text-gray-500 mt-2">No campaigns found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {campaigns.map((campaign) => (
                    <div
                      key={campaign._id}
                      onClick={() => handleCampaignSelect(campaign._id)}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-medium text-gray-900 truncate">{campaign.campaignName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          campaign.status === 'completed' ? 'bg-green-100 text-green-800' :
                          campaign.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {campaign.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 truncate">{campaign.emailSubject}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Total Sent</p>
                          <p className="font-medium">{campaign.analytics?.totalEmails || 0}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Open Rate</p>
                          <p className="font-medium text-green-600">{campaign.analytics?.openRate || 0}%</p>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        {selectedCampaign && (analytics || linkAnalytics) && (
          <div className="space-y-6">
            {/* Back Button */}
            <button
              onClick={() => {
                setSelectedCampaign(null);
                setAnalytics(null);
                setLinkAnalytics(null);
                setSelectedLink(null);
                setLinkDetails(null);
              }}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <span>← Back to Campaigns</span>
            </button>

            {/* Campaign Header */}
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <TabButton
                    tabId="overview"
                    label="Overview"
                    icon={BarChart3}
                    isActive={activeTab === 'overview'}
                    onClick={setActiveTab}
                  />
                  <TabButton
                    tabId="email-analytics"
                    label="Email Analytics"
                    icon={Eye}
                    isActive={activeTab === 'email-analytics'}
                    onClick={setActiveTab}
                  />
                  <TabButton
                    tabId="link-tracking"
                    label="Link Tracking"
                    icon={ExternalLink}
                    isActive={activeTab === 'link-tracking'}
                    onClick={setActiveTab}
                  />
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Key Metrics Grid */}
                                {analytics && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{analytics.campaign.name}</h2>
                    <p className="text-gray-600">{analytics.campaign.subject}</p>
                    <p className="text-sm text-gray-500">
                      Sent on {new Date(analytics.campaign.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}


                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {analytics && (
                        <>
                          <div className="text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                              <Mail className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{analytics.analytics.totalEmails}</p>
                            <p className="text-sm text-gray-600">Total Sent</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                              <Eye className="w-6 h-6 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{analytics.analytics.openedEmails}</p>
                            <p className="text-sm text-gray-600">Opened</p>
                          </div>
                        </>
                      )}
                      {linkAnalytics && (
                        <>
                          <div className="text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                              <MousePointer className="w-6 h-6 text-purple-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{linkAnalytics.summary.totalUniqueClicks}</p>
                            <p className="text-sm text-gray-600">Unique Clicks</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-2">
                              <TrendingUp className="w-6 h-6 text-orange-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{linkAnalytics.summary.totalClicks}</p>
                            <p className="text-sm text-gray-600">Total Clicks</p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Combined Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Email Open Status */}
                      {analytics && (
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Open Status</h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Opened', value: analytics.analytics.openedEmails, color: COLORS[0] },
                                  { name: 'Not Opened', value: analytics.analytics.unopenedEmails, color: COLORS[1] }
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {[
                                  { name: 'Opened', value: analytics.analytics.openedEmails, color: COLORS[0] },
                                  { name: 'Not Opened', value: analytics.analytics.unopenedEmails, color: COLORS[1] }
                                ].map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      )}

                      {/* Top Performing Links */}
                      {linkAnalytics && linkAnalytics.mostClickedLinks && linkAnalytics.mostClickedLinks.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Links</h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={linkAnalytics.mostClickedLinks}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                dataKey="linkText" 
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                interval={0}
                              />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="uniqueClicks" fill="#3B82F6" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Email Analytics Tab */}
                {activeTab === 'email-analytics' && analytics && (
                  <div className="space-y-6">
                    {/* Timeline Chart */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Opens Over Time</h3>
                      {analytics.timeline.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={analytics.timeline}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="opens" stroke="#10B981" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-64 text-gray-500">
                          <p>No opens recorded yet</p>
                        </div>
                      )}
                    </div>

                    {/* Recipients Table */}
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Recipients Details</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Recipient
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Opens
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Last Opened
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {analytics.recipients.map((recipient, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">{recipient.email}</div>
                                    {recipient.name && (
                                      <div className="text-sm text-gray-500">{recipient.name}</div>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    recipient.opened 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {recipient.opened ? 'Opened' : 'Not Opened'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {recipient.openCount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {recipient.openedAt 
                                    ? new Date(recipient.openedAt).toLocaleString()
                                    : '-'
                                  }
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Link Tracking Tab */}
                {activeTab === 'link-tracking' && linkAnalytics && (
                  <div className="space-y-6">
                    {/* Link Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <ExternalLink className="h-6 w-6 text-blue-600 mr-2" />
                          <div>
                            <p className="text-sm text-blue-600">Total Links</p>
                            <p className="text-xl font-semibold text-blue-900">
                              {formatNumber(linkAnalytics.summary.totalLinks)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <MousePointer className="h-6 w-6 text-green-600 mr-2" />
                          <div>
                            <p className="text-sm text-green-600">Unique Clicks</p>
                            <p className="text-xl font-semibold text-green-900">
                              {formatNumber(linkAnalytics.summary.totalUniqueClicks)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <TrendingUp className="h-6 w-6 text-purple-600 mr-2" />
                          <div>
                            <p className="text-sm text-purple-600">Total Clicks</p>
                            <p className="text-xl font-semibold text-purple-900">
                              {formatNumber(linkAnalytics.summary.totalClicks)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <Users className="h-6 w-6 text-orange-600 mr-2" />
                          <div>
                            <p className="text-sm text-orange-600">Click Rate</p>
                            <p className="text-xl font-semibold text-orange-900">
                              {formatPercentage(linkAnalytics.summary.overallClickRate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Link Analytics Table */}
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Link Performance Details</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Link
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Unique Clicks
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total Clicks
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Click Rate
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {linkAnalytics.linkAnalytics && linkAnalytics.linkAnalytics.map((link, index) => (
                              <React.Fragment key={index}>
                                <tr className="hover:bg-gray-50">
                                  <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                        {link.linkText}
                                      </div>
                                      <div className="text-sm text-gray-500 truncate max-w-xs">
                                        {link.originalUrl}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatNumber(link.uniqueClicks)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatNumber(link.totalClicks)}
</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatPercentage(link.clickRate)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => handleLinkClick(link)}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                      >
                                        View Details
                                      </button>
                                      <button
                                        onClick={() => toggleRowExpansion(index)}
                                        className="text-gray-400 hover:text-gray-600"
                                      >
                                        {expandedRows.has(index) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                {expandedRows.has(index) && (
                                  <tr>
                                    <td colspan="5" className="px-6 py-4 bg-gray-50">
                                      <div className="space-y-2">
                                        <div className="text-sm">
                                          <span className="font-medium text-gray-700">Original URL:</span>
                                          <span className="ml-2 text-gray-600 break-all">{link.originalUrl}</span>
                                        </div>
                                        <div className="text-sm">
                                          <span className="font-medium text-gray-700">Tracked URL:</span>
                                          <span className="ml-2 text-gray-600 break-all">{link.trackedUrl}</span>
                                        </div>
                                        {link.clicks && link.clicks.length > 0 && (
                                          <div className="mt-3">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Clicks:</h4>
                                            <div className="space-y-1 max-h-32 overflow-y-auto">
                                              {link.clicks.slice(0, 5).map((click, clickIndex) => (
                                                <div key={clickIndex} className="text-xs text-gray-600 flex justify-between">
                                                  <span>{click.email}</span>
                                                  <span>{formatDateTime(click.clickedAt)}</span>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Link Details Modal-like Section */}
                    {selectedLink && linkDetails && (
                      <div className="bg-white rounded-lg shadow-lg border">
                        <div>

                          {/* Click Timeline */}
                          {linkDetails.timeline && linkDetails.timeline.length > 0 && (
                            <div className="mb-6">
                              <h4 className="text-lg font-semibold text-gray-900 mb-4">Clicks Over Time</h4>
                              <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={linkDetails.timeline}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="date" tickFormatter={formatDate} />
                                  <YAxis />
                                  <Tooltip labelFormatter={(value) => formatDate(value)} />
                                  <Line type="monotone" dataKey="clicks" stroke="#3B82F6" strokeWidth={2} />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          )}

                          {/* Click Details Table */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Link Details: {selectedLink.linkText}
                </h3>
                <button
                  onClick={() => {setSelectedLink(null); setLinkDetails(null);}}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              {/* Link Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <MousePointer className="h-6 w-6 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm text-blue-600">Unique Clicks</p>
                      <p className="text-xl font-semibold text-blue-900">
                        {formatNumber(linkDetails.linkInfo.uniqueClicks)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm text-green-600">Total Clicks</p>
                      <p className="text-xl font-semibold text-green-900">
                        {formatNumber(linkDetails.linkInfo.totalClicks)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Users className="h-6 w-6 text-purple-600 mr-2" />
                    <div>
                      <p className="text-sm text-purple-600">Recipients</p>
                      <p className="text-xl font-semibold text-purple-900">
                        {formatNumber(linkDetails.linkInfo.totalRecipients)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Clock className="h-6 w-6 text-orange-600 mr-2" />
                    <div>
                      <p className="text-sm text-orange-600">Repeat Clicks</p>
                      <p className="text-xl font-semibold text-orange-900">
                        {formatNumber(linkDetails.linkInfo.totalClicks - linkDetails.linkInfo.uniqueClicks)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Daily Clicks Chart */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Daily Click Trends</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={linkDetails.dailyStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={formatDate}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => `Date: ${formatDate(value)}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="clicks" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        name="Total Clicks"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="uniqueClicks" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        name="Unique Clicks"
                      />
                      <Legend />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {/* Recent Click Timeline */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Recent Click Activity</h4>
                <div className="space-y-3">
                  {linkDetails.clickTimeline.map((click, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <MousePointer className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{click.recipientName}</p>
                          <p className="text-xs text-gray-500">{click.recipientEmail}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">{formatDateTime(click.clickedAt)}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Globe className="w-3 h-3 mr-1" />
                          {click.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkTrackingDashboard;