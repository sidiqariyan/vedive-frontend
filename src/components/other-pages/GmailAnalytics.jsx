import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Mail, Eye, EyeOff, TrendingUp, Users, Calendar, Download, RefreshCw } from 'lucide-react';

const EmailAnalytics = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

 

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://vedive.com:3000/api/campaigns-with-analytics?toolType=gmail-sender', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCampaigns(response.data);
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
      const response = await axios.get(`https://vedive.com:3000/api/analytics/${campaignId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setAnalytics(response.data);
      setSelectedCampaign(campaignId);
    } catch (error) {
      setError('Failed to fetch analytics');
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
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

  const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6'];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="text-blue-600" size={30} />
              <h1 className="text-3xl font-bold text-gray-900">Email Analytics</h1>
            </div>
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

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Campaigns List */}
        {!selectedCampaign && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Your Email Campaigns</h2>
              <p className="text-gray-600 mt-1">Click on a campaign to view detailed analytics</p>
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
                      onClick={() => fetchCampaignAnalytics(campaign._id)}
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

        {/* Detailed Analytics */}
        {selectedCampaign && analytics && (
          <div className="space-y-6">
            {/* Back Button */}
            <button
              onClick={() => {
                setSelectedCampaign(null);
                setAnalytics(null);
              }}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <span>← Back to Campaigns</span>
            </button>

            {/* Campaign Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{analytics.campaign.name}</h2>
                  <p className="text-gray-600">{analytics.campaign.subject}</p>
                  <p className="text-sm text-gray-500">
                    Sent on {new Date(analytics.campaign.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={downloadCSV}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mx-auto mb-2">
                    <EyeOff className="w-6 h-6 text-red-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{analytics.analytics.unopenedEmails}</p>
                  <p className="text-sm text-gray-600">Not Opened</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{analytics.analytics.openRate}%</p>
                  <p className="text-sm text-gray-600">Open Rate</p>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Open Rate Pie Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
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

              {/* Timeline Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
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
                  <div className="flex items-center justify-center h-300 text-gray-500">
                    <p>No opens recorded yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recipients Table */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Recipients Details</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
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
      </div>
    </div>
  );
};

export default EmailAnalytics;