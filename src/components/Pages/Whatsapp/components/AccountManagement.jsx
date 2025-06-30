import React from 'react';
import { Phone, Plus, CheckCircle, XCircle } from 'lucide-react';

const AccountManagement = ({
  accounts = [],
  currentAccount,
  onSwitchAccount,
  onAddNewAccount
}) => {
  // Add safety check
  const safeAccounts = accounts || [];

  // Function to determine if account is authenticated (regardless of being current)
  const isAccountAuthenticated = (account) => {
    // Check if account is authenticated OR if message indicates reconnection
    return account.isAuthenticated || 
           (account.message && account.message.includes('Reconnected to WhatsApp account'));
  };

  // Function to determine if account is currently selected
  const isCurrentAccount = (account) => {
    return currentAccount === account.phoneNumber;
  };

  // Handle account click with logging
  const handleAccountClick = (account) => {
    // Check if account is authenticated OR if message indicates reconnection
    const isAuthenticated = isAccountAuthenticated(account);
    const isCurrent = isCurrentAccount(account);
    
    // Log authentication status to console
    console.log(`Account clicked: ${account.phoneNumber}`);
    console.log(`Is authenticated: ${isAuthenticated}`);
    console.log(`Is current account: ${isCurrent}`);
    console.log(`Account details:`, account.message);
    
    // Call the original switch account function
    onSwitchAccount(account.phoneNumber);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Phone className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-900">WhatsApp Accounts</h2>
      </div>

      <div className="space-y-3 mb-4">
        {safeAccounts.length > 0 ? (
          safeAccounts.map((account) => {
            const isAuthenticated = isAccountAuthenticated(account);
            const isCurrent = isCurrentAccount(account);
            
            return (
              <div
                key={account.phoneNumber}
                onClick={() => handleAccountClick(account)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isCurrent
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {/* Green circle if account is authenticated, red otherwise */}
                    <div
                      className={`w-3 h-3 rounded-full ${
                        isAuthenticated ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <p className="font-medium text-gray-900 text-sm">
                      {account.phoneNumber}
                    </p>
                    {isCurrent && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </div>

                  {/* Green checkmark if authenticated, red X if not */}
                  {isAuthenticated ? (
                    <CheckCircle className="w-5 h-5 text-green-600 stroke-2" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 stroke-2" />
                  )}
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <p className="flex items-center justify-between">
                    <span>Campaigns: {account.campaignCount || 0}</span>
                    <span className={`font-medium ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                      {isAuthenticated ? 'Connected' : ''}
                    </span>
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Phone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm">No accounts connected</p>
            <p className="text-xs mt-1">Click "Add New Account" to get started</p>
          </div>
        )}
      </div>

      <button
        onClick={onAddNewAccount}
        className="w-full bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        <span>Add New Account</span>
      </button>
    </div>
  );
};

export default AccountManagement;