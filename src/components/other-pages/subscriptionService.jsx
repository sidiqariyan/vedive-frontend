// src/services/subscriptionService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const subscriptionService = {
  // Create a new subscription order
  createOrder: async (planId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/create-order`,
        { planId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error.response?.data || error.message);
      throw error;
    }
  },

  // Verify payment status after payment completion
  verifyPayment: async (orderId, orderToken) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/verify-payment`,
        { orderId, orderToken },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get current subscription status
  getSubscriptionStatus: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/subscription-status`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription status:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get subscription history
  getSubscriptionHistory: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/subscription-history`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription history:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default subscriptionService;