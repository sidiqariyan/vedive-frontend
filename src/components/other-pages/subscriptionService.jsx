// frontend/subscriptionService.js
import axios from "axios";

const API_BASE = "http://ec2-51-21-1-175.eu-north-1.compute.amazonaws.com:3000/api";

const subscriptionService = {
  createOrder: (planId) => axios.post(
    `${API_BASE}/subscription/createOrder`,
    { planId },
    { headers: { Authorization: localStorage.getItem("token") } }
  ),

  verifyPayment: (orderId) => axios.get(
    `${API_BASE}/subscription/verifyPayment/${orderId}`,
    { headers: { Authorization: localStorage.getItem("token") } }
  ),

  getSubscriptionStatus: () => axios.get(
    `${API_BASE}/subscription/status`,
    { headers: { Authorization: localStorage.getItem("token") } }
  )
};

export default subscriptionService;
