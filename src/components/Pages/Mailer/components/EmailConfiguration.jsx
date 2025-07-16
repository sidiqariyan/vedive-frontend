import React from 'react';
import { Mail } from 'lucide-react';

const EmailConfiguration = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-4 p-4 sm:p-6 border border-gray-300 rounded-lg shadow-sm">
      <div className="flex items-center space-x-2">
        <Mail className="text-blue-600" size={20} />
        <h2 className="text-lg font-medium text-gray-900">Email Configuration</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
          <input
            type="email"
            id="fromEmail"
            value={formData.fromEmail}
            placeholder="sender@company.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={onInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Subject</label>
          <input
            type="text"
            id="emailSubject"
            value={formData.emailSubject}
            placeholder="Enter email subject"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={onInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default EmailConfiguration;