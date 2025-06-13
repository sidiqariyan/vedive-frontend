import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AnalyticsDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use environment variable or default to localhost
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/whatsapp';
  
  // Get auth token from localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) {
      setError('No authentication token found. Please login first.');
      return null;
    }
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  // Fetch all campaigns
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const authHeaders = getAuthHeaders();
      if (!authHeaders) return;

      const response = await fetch(`${API_URL}/analytics`, authHeaders);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCampaigns(data.campaigns || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError(`Failed to fetch campaign data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch campaign details
  const fetchCampaignDetails = async (campaignId) => {
    try {
      setLoading(true);
      const authHeaders = getAuthHeaders();
      if (!authHeaders) return;

      const response = await fetch(`${API_URL}/analytics/${campaignId}`, authHeaders);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSelectedCampaign(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching campaign details:', err);
      setError(`Failed to fetch campaign details: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#27ae60';
      case 'in-progress': return '#f39c12';
      case 'failed': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  // Prepare chart data
  const getChartData = () => {
    if (!selectedCampaign) return [];
    
    const { summary } = selectedCampaign;
    return [
      { name: 'Delivered', value: summary.deliveredMessages, color: '#27ae60' },
      { name: 'Read', value: summary.readMessages, color: '#3498db' },
      { name: 'Failed', value: summary.failedMessages, color: '#e74c3c' }
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
          <div className="text-red-500 text-center">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchCampaigns}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">WhatsApp Campaign Analytics</h1>
        
        {/* Campaign List */}
        {!selectedCampaign && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-700">Campaigns</h2>
              <button 
                onClick={fetchCampaigns}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Refresh
              </button>
            </div>
            
            {campaigns.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No campaigns found</h3>
                <p className="text-gray-500">Create your first WhatsApp campaign to see analytics here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map(campaign => (
                  <div 
                    key={campaign.campaignId}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4"
                    style={{ borderLeftColor: getStatusColor(campaign.status) }}
                    onClick={() => fetchCampaignDetails(campaign.campaignId)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{campaign.campaignName}</h3>
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: getStatusColor(campaign.status) + '20',
                          color: getStatusColor(campaign.status)
                        }}
                      >
                        {campaign.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-4">Created: {formatDate(campaign.createdAt)}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Messages:</span>
                        <span className="font-medium">{campaign.totalMessages || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Delivery Rate:</span>
                        <span className="font-medium text-green-600">{campaign.deliveryRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Open Rate:</span>
                        <span className="font-medium text-blue-600">{campaign.openRate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Campaign Details */}
        {selectedCampaign && (
          <div>
            <button 
              className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              onClick={() => setSelectedCampaign(null)}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Back to Campaigns
            </button>
            
            {/* Summary Cards */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{selectedCampaign.summary.campaignName}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Total Messages</h4>
                  <p className="text-3xl font-bold text-gray-800">{selectedCampaign.summary.totalMessages}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Delivery Rate</h4>
                  <p className="text-3xl font-bold text-green-600">{selectedCampaign.summary.deliveryRate}%</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Open Rate</h4>
                  <p className="text-3xl font-bold text-blue-600">{selectedCampaign.summary.openRate}%</p>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Message Status Chart */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Message Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={getChartData()}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {getChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Additional Metrics */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
                    <span className="font-medium">Delivered Messages</span>
                    <span className="text-2xl font-bold text-green-600">{selectedCampaign.summary.deliveredMessages}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
                    <span className="font-medium">Read Messages</span>
                    <span className="text-2xl font-bold text-blue-600">{selectedCampaign.summary.readMessages}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
                    <span className="font-medium">Failed Messages</span>
                    <span className="text-2xl font-bold text-red-600">{selectedCampaign.summary.failedMessages}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Status Details */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Campaign Summary</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Campaign Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Campaign Name:</span>
                        <span className="font-medium">{selectedCampaign.summary.campaignName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Messages:</span>
                        <span className="font-medium">{selectedCampaign.summary.totalMessages}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span 
                          className="px-2 py-1 rounded text-sm font-medium"
                          style={{ 
                            backgroundColor: getStatusColor(selectedCampaign.summary.status || 'completed') + '20',
                            color: getStatusColor(selectedCampaign.summary.status || 'completed')
                          }}
                        >
                          {selectedCampaign.summary.status || 'completed'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Performance Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Rate:</span>
                        <span className="font-medium text-green-600">{selectedCampaign.summary.deliveryRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Open Rate:</span>
                        <span className="font-medium text-blue-600">{selectedCampaign.summary.openRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Failed Rate:</span>
                        <span className="font-medium text-red-600">
                          {((selectedCampaign.summary.failedMessages / selectedCampaign.summary.totalMessages) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;