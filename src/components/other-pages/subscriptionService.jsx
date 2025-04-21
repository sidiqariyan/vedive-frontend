// src/components/other-pages/subscriptionService.jsx
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://vedive.com:3000/api',
  withCredentials: true,
});

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

const createOrder = async ({ planId }) => {
  return api.post('/subscription/createOrder', { planId });
};

const verifyPayment = async (orderId) => {
  return api.get(`/subscription/verifyPayment/${orderId}`);
};

const getSubscriptionStatus = async () => {
  return api.get('/subscription/status');
};

export default {
  createOrder,
  verifyPayment,
  getSubscriptionStatus,
};