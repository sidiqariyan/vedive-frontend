// file: subscriptionService.js
/**
 * Subscription Service
 * This module handles API calls related to subscriptions
 */

import axios from 'axios';

// Use an environment variable (and fallback to localhost for dev)
const BASE_URL = 'https://vedive.com:3000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,     // ← this is correct
});

// Include auth token if you’re using Bearer tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const subscriptionService = {
  /**
   * Get current subscription status
   * GET /api/subscription/status
   */
  getSubscriptionStatus: () => {
    return api.get('/api/subscription/status');
  },

  /**
   * Create a payment order
   * POST /api/subscription/create
   * Body: { planId, amount }
   */
  createOrder: (data) => {
    return api.post('/api/subscription/create', data);
  },

  /**
   * Verify payment after checkout
   * GET /api/subscription/verify/:orderid
   */
  verifyPayment: (orderId) => {
    return api.get(`/api/subscription/verify/${orderId}`);
  },

  /**
   * (Optional) Cancel subscription
   * — you’ll need to add this route server-side if you want it
   */
  cancelSubscription: () => {
    return api.post('/api/subscription/cancel');
  },

  /**
   * (Optional) Get payment history
   * — add this route to your back end if you need it
   */
  getPaymentHistory: () => {
    return api.get('/api/subscription/history');
  },
};

export default subscriptionService;
