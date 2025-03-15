import React, { useEffect, useState } from 'react';
import { Loader, Calendar, Check, X, AlertCircle } from 'lucide-react';
import subscriptionService from './subscriptionService';
import { toast } from 'react-toastify';

const SubscriptionHistory = () => {
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statusResponse = await subscriptionService.getSubscriptionStatus();
        const historyResponse = await subscriptionService.getSubscriptionHistory();
        
        setCurrentSubscription(statusResponse);
        setSubscriptions(historyResponse.subscriptions || []);
      } catch (error) {
        console.error('Error fetching subscription data:', error);
        toast.error('Failed to load subscription information');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="flex items-center px-3 py-1 text-xs rounded-full bg-green-100 text-green-800">
            <Check size={12} className="mr-1" /> Active
          </span>
        );
      case 'expired':
        return (
          <span className="flex items-center px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            <X size={12} className="mr-1" /> Expired
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
            <AlertCircle size={12} className="mr-1" /> Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center px-3 py-1 text-xs rounded-full bg-red-100 text-red-800">
            <X size={12} className="mr-1" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="flex items-center px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <Loader className="h-8 w-8 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading subscription information...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Your Subscription</h2>
      
      {/* Current plan */}
      <div className="mb-8 p-6 border rounded-lg bg-blue-50 border-blue-200">
        <h3 className="text-xl font-semibold mb-4">Current Plan</h3>
        <div className="flex flex-wrap justify-between items-start">
          <div>
            <p className="text-3xl font-bold text-blue-700">{currentSubscription?.currentPlan || 'Free'}</p>
            {currentSubscription?.subscription && (
              <div className="flex items-center mt-2 text-gray-600">
                <Calendar size={16} className="mr-2" />
                {currentSubscription.subscription.endDate ? (
                  <span>
                    Expires on {formatDate(currentSubscription.subscription.endDate)}
                  </span>
                ) : (
                  <span>No expiration date</span>
                )}
              </div>
            )}
          </div>
          <div className="mt-4 md:mt-0">
            {currentSubscription?.hasActiveSubscription ? (
              getStatusBadge('active')
            ) : (
              <button 
                onClick={() => window.location.href = '/plans'} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upgrade Now
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Subscription history */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Subscription History</h3>
        {subscriptions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No subscription history found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Plan</th>
                  <th className="py-3 px-4 text-left">Amount</th>
                  <th className="py-3 px-4 text-left">Start Date</th>
                  <th className="py-3 px-4 text-left">End Date</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {subscriptions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{sub.planName}</td>
                    <td className="py-3 px-4">₹{sub.amount}</td>
                    <td className="py-3 px-4">{formatDate(sub.startDate)}</td>
                    <td className="py-3 px-4">{formatDate(sub.endDate)}</td>
                    <td className="py-3 px-4">{getStatusBadge(sub.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionHistory;