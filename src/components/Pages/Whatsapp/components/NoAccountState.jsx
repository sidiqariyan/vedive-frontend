import React from 'react';
import { AlertCircle } from 'lucide-react';

const NoAccountState = ({ onAddAccount }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
      <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-medium text-gray-700 mb-2">Account Required</h3>
      <p className="text-gray-500 mb-4">Please connect a WhatsApp account first to send campaigns</p>
      <button
        onClick={onAddAccount}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Connect Account
      </button>
    </div>
  );
};

export default NoAccountState;