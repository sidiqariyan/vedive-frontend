import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import subscriptionService from './subscriptionService';
import { toast } from 'react-toastify';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'failed'
  const [subscription, setSubscription] = useState(null);
  const [localPlanId, setLocalPlanId] = useState('starter');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const orderId = searchParams.get('order_id');
        const orderToken = searchParams.get('order_token'); // if provided by your gateway
        const pendingOrderData = localStorage.getItem('pendingOrder');
        const pendingOrder = pendingOrderData ? JSON.parse(pendingOrderData) : null;
        const pendingOrderId = pendingOrder?.orderId;
        // Retrieve planId from pending order (fallback to 'starter' if missing)
        const planId = pendingOrder?.planId || 'starter';
        setLocalPlanId(planId);
        // Retrieve userId from localStorage (adjust as needed from your auth context)
        const userId = localStorage.getItem('userId') || 'user123';

        if (!orderId) {
          setStatus('failed');
          toast.error('Payment verification failed: Missing order_id parameter');
          localStorage.removeItem('pendingOrder');
          return;
        }

        if (pendingOrderId !== orderId) {
          console.warn('Order ID mismatch', { pendingOrderId, orderId });
        }

        // Call the backend API to verify payment; pass orderToken, userId, and planId.
        const response = await subscriptionService.verifyPayment(orderId, orderToken, userId, planId);

        if (response.data && response.data.success) {
          setStatus('success');
          setSubscription(response.data.subscription);
          toast.success('Payment successful! Your subscription is now active');
          localStorage.removeItem('pendingOrder');
        } else {
          setStatus('failed');
          toast.error(`Payment failed: ${response.data?.message || 'Please try again'}`);
          localStorage.removeItem('pendingOrder');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
        toast.error('Payment verification failed. Please contact support if payment was deducted.');
        localStorage.removeItem('pendingOrder');
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  const redirectToDashboard = () => {
    navigate('/dashboard');
  };

  const tryAgain = () => {
    navigate('/plans');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        {status === 'processing' && (
          <div className="text-center">
            <Loader className="mx-auto h-16 w-16 text-blue-500 animate-spin mb-6" />
            <h2 className="text-2xl font-bold mb-2">Verifying your payment</h2>
            <p className="text-gray-600 mb-6">Please wait while we confirm your payment status...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your subscription to the {subscription?.planName || localPlanId} plan is now active.
              {subscription?.endDate && (
                <span className="block mt-2">
                  Valid until: {new Date(subscription.endDate).toLocaleDateString()}
                </span>
              )}
            </p>
            <button
              onClick={redirectToDashboard}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors duration-300"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {status === 'failed' && (
          <div className="text-center">
            <XCircle className="mx-auto h-16 w-16 text-red-500 mb-6" />
            <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">
              We couldn't verify your payment. If you believe this is an error or your payment was deducted, please contact our support team.
            </p>
            <button
              onClick={tryAgain}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;
