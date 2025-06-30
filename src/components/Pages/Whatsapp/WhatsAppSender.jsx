import React from 'react';
import { useMessageForm } from './hooks/useMessageForm';
import Header from './components/Header';
import Notification from './components/Notification';
import AccountManagement from './components/AccountManagement';
import CampaignForm from './components/CampaignForm';
import NoAccountState from './components/NoAccountState';
import QRModal from './components/QRModal';

const MessageForm = () => {
  const {
    // State
    accounts,
    currentAccount,
    qrCode,
    loading,
    error,
    success,
    showQR,
    campaignForm,
    
    // Setters
    setShowQR,
    setCampaignForm,
    
    // Actions
    fetchQRCode,
    switchAccount,
    sendCampaign,
    handleAddNewAccount,
    resetCampaignForm,
  } = useMessageForm();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <Header 
        currentAccount={currentAccount}
        loading={loading}
        onRefresh={fetchQRCode}
      />

      {/* Notifications */}
      <Notification type="error" message={error} />
      <Notification type="success" message={success} />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Account Management */}
          <div className="lg:col-span-1">
            <AccountManagement
              accounts={accounts}
              currentAccount={currentAccount}
              onSwitchAccount={switchAccount}
              onAddNewAccount={handleAddNewAccount}
            />
          </div>

          {/* Right Column - Campaign Configuration */}
          <div className="lg:col-span-2">
            {!currentAccount ? (
              <NoAccountState onAddAccount={handleAddNewAccount} />
            ) : (
              <CampaignForm
                campaignForm={campaignForm}
                setCampaignForm={setCampaignForm}
                currentAccount={currentAccount}
                loading={loading}
                onSendCampaign={sendCampaign}
                onReset={resetCampaignForm}
              />
            )}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <QRModal
        showQR={showQR}
        qrCode={qrCode}
        onClose={() => setShowQR(false)}
        onRetry={fetchQRCode}
      />
    </div>
  );
};

export default MessageForm;