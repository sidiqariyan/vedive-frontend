import React from 'react';
import { Send, Upload, Users, Loader } from 'lucide-react';

const CampaignForm = ({
  campaignForm,
  setCampaignForm,
  currentAccount,
  loading,
  onSendCampaign,
  onReset
}) => {
  return (
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

          {/* From Account */}
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
            onClick={onReset}
            className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={onSendCampaign}
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
  );
};

export default CampaignForm;