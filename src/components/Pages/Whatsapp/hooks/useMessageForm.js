import { useState, useEffect, useCallback } from 'react';
import { apiCall, sendCampaignWithMedia } from '../utils/api';

export const useMessageForm = () => {
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showQR, setShowQR] = useState(false);

  // Campaign form state
  const [campaignForm, setCampaignForm] = useState({
    campaignName: '',
    message: '',
    users: '',
    mediaFile: null
  });

  // Fetch all account statuses from backend
  const fetchAccountStatuses = useCallback(async () => {
    try {
      const data = await apiCall('/api/whatsapp/status');
      setAccounts(data.accounts || []);
      if (!currentAccount && data.accounts?.length) {
        setCurrentAccount(data.accounts[0].phoneNumber);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load account statuses');
    }
  }, [currentAccount]);

  // Initial load & periodic polling every 5s
  useEffect(() => {
    fetchAccountStatuses();
    const interval = setInterval(fetchAccountStatuses, 5000);
    return () => clearInterval(interval);
  }, [fetchAccountStatuses]);

  // Helper: any authenticated
  const isAnyAccountAuthenticated = () =>
    !!currentAccount &&
    accounts.some(
      (acc) =>
        acc.phoneNumber === currentAccount &&
        acc.isAuthenticated &&
        acc.isActive
    );

  // Fetch QR and existing accounts
  const fetchQRCode = async () => {
    setLoading(true);
    setError('');
    try {
      const { qrCode: qr, existingAccounts } =
        await apiCall('/api/whatsapp/qr');
      setQrCode(qr);
      setAccounts(existingAccounts || []);
      setShowQR(true);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch QR code');
    } finally {
      setLoading(false);
    }
  };

  // Switch WhatsApp account
  const switchAccount = async (phoneNumber) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiCall('/api/whatsapp/switch-account', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber })
      });
      setCurrentAccount(phoneNumber);
      setSuccess(res.message);
      if (res.needsReauth) fetchQRCode();
    } catch (err) {
      console.error(err);
      setError('Failed to switch account');
    } finally {
      setLoading(false);
    }
  };

  // Send campaign (with optional media)
  const sendCampaign = async () => {
    if (!campaignForm.campaignName || !campaignForm.message || !campaignForm.users) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      Object.entries(campaignForm).forEach(([k, v]) => {
        if (v != null) formData.append(k, v);
      });
      const result = await sendCampaignWithMedia(formData);
      setSuccess(
        `Sent: ${result.totalSent}, Failed: ${result.totalFailed}`
      );
      setCampaignForm({
        campaignName: '',
        message: '',
        users: '',
        mediaFile: null
      });
    } catch (err) {
      console.error(err);
      setError('Failed to send campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewAccount = () => {
    setShowQR(true);
    fetchQRCode();
  };

  const resetCampaignForm = () =>
    setCampaignForm({ campaignName: '', message: '', users: '', mediaFile: null });

  // Retry QR every 30s if showing
  useEffect(() => {
    if (showQR && !currentAccount) {
      const iv = setInterval(fetchQRCode, 30000);
      return () => clearInterval(iv);
    }
  }, [showQR, currentAccount]);

  // Clear alerts after 5s
  useEffect(() => {
    if (error || success) {
      const t = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [error, success]);

  return {
    accounts,
    currentAccount,
    qrCode,
    loading,
    error,
    success,
    showQR,
    campaignForm,
    setShowQR,
    setCampaignForm,
    fetchQRCode,
    switchAccount,
    sendCampaign,
    handleAddNewAccount,
    resetCampaignForm,
    isAnyAccountAuthenticated
  };
};