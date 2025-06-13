import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { ExternalLink, MousePointer, Users, TrendingUp, Eye, Clock, Globe, ChevronDown, ChevronUp } from 'lucide-react';

const LinkTrackingDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [linkAnalytics, setLinkAnalytics] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);
  const [linkDetails, setLinkDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [error, setError] = useState('');

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/campaigns-with-analytics', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch campaigns: ${response.status} ${response.statusText}`);
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

    fetchCampaigns();
  }, []);

  const fetchLinkAnalytics = async (campaignId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/link-analytics/${campaignId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch link analytics: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setLinkAnalytics(data);
    } catch (error) {
      console.error('Error fetching link analytics:', error);
      setError('Could not load link analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchLinkDetails = async (campaignId, originalUrl) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/link-details/${campaignId}/${originalUrl}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch link details: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setLinkDetails(data);
    } catch (error) {
      console.error('Error fetching link details:', error);
      setError('Could not load link details');
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignChange = (campaignId) => {
    setSelectedCampaign(campaignId);
    setLinkAnalytics(null);
    setSelectedLink(null);
    setLinkDetails(null);
    setError(''); // Clear any previous errors
    if (campaignId) {
      fetchLinkAnalytics(campaignId);
    }
  };

  const handleLinkClick = (link) => {
    setSelectedLink(link);
    setError(''); // Clear any previous errors
    fetchLinkDetails(selectedCampaign, encodeURIComponent(link.originalUrl));
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Link Tracking Analytics</h1>
          <p className="text-gray-600">Monitor and analyze link performance across your email campaigns</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setError('')}
                    className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Campaign Selector */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Campaign
          </label>
          <select
            value={selectedCampaign}
            onChange={(e) => handleCampaignChange(e.target.value)}
            className="w-full text-black max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a campaign...</option>
            {campaigns.map((campaign) => (
              <option key={campaign._id} value={campaign._id}>
                {campaign.campaignName} - {new Date(campaign.createdAt).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {linkAnalytics && (
          <>
            {/* Campaign Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{linkAnalytics.campaign.name}</h2>
              <p className="text-gray-600 mb-1">Subject: {linkAnalytics.campaign.subject}</p>
              <p className="text-sm text-gray-500">Created: {new Date(linkAnalytics.campaign.createdAt).toLocaleDateString()}</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ExternalLink className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Links</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatNumber(linkAnalytics.summary.totalLinks)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <MousePointer className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Unique Clicks</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatNumber(linkAnalytics.summary.totalUniqueClicks)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Clicks</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatNumber(linkAnalytics.summary.totalClicks)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Click Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatPercentage(linkAnalytics.summary.overallClickRate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Performing Links Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Links</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
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
            </div>

            {/* Click Distribution Pie Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Click Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={linkAnalytics.linkAnalytics}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({linkText, uniqueClicks}) => `${linkText}: ${uniqueClicks}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="uniqueClicks"
                    >
                      {linkAnalytics.linkAnalytics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detailed Link Analytics Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Link Performance Details</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
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
                    {linkAnalytics.linkAnalytics.map((link, index) => (
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              link.clickRate >= 10 ? 'bg-green-100 text-green-800' :
                              link.clickRate >= 5 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {formatPercentage(link.clickRate)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleLinkClick(link)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              <Eye className="h-4 w-4 inline mr-1" />
                              View Details
                            </button>
                            <button
                              onClick={() => toggleRowExpansion(index)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              {expandedRows.has(index) ? (
                                <ChevronUp className="h-4 w-4 inline" />
                              ) : (
                                <ChevronDown className="h-4 w-4 inline" />
                              )}
                            </button>
                          </td>
                        </tr>
                        {expandedRows.has(index) && (
                          <tr>
                            <td colSpan="5" className="px-6 py-4 bg-gray-50">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-gray-700">Recipients:</span>
                                  <span className="ml-2 text-gray-600">{formatNumber(link.totalRecipients)}</span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Link Index:</span>
                                  <span className="ml-2 text-gray-600">{link.linkIndex}</span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Repeat Clicks:</span>
                                  <span className="ml-2 text-gray-600">{link.totalClicks - link.uniqueClicks}</span>
                                </div>
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

            {/* Link Details Modal/Section */}
            {selectedLink && linkDetails && (
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
            )}
          </>
        )}

        {!selectedCampaign && !loading && (
          <div className="text-center py-12">
            <ExternalLink className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Campaign Selected</h3>
            <p className="text-gray-500">Select a campaign above to view link tracking analytics</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkTrackingDashboard;