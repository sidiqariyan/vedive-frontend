import React from 'react';
import { MessageSquare, RefreshCw, Loader, HelpCircle } from 'lucide-react';

const Header = ({ currentAccount, loading, onRefresh }) => {
  return (
    <div className="max-w-6xl mx-auto mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500 p-2 rounded-lg">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">WhatsApp Bulk Sender</h1>
            <p className="text-sm text-gray-500 flex items-center space-x-2">
              <span>{currentAccount ? `Connected: ${currentAccount}` : 'No account connected'}</span>
              <div className="flex items-center space-x-1">
                <HelpCircle className="w-4 h-4 text-blue-500" />
                <span className="text-blue-500 hover:underline cursor-pointer">Need help? Watch tutorial</span>
              </div>
            </p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
        >
          {loading ? <Loader className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
};

export default Header;