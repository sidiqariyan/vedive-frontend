import axios from "axios";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: "https://vedive.com:3000/api", // Replace with your backend base URL
});

// Add interceptor to include the Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiry
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized request. Redirecting to login...");
      localStorage.removeItem("token"); // Clear expired token
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

// Subscription Service Functions
export const getSubscriptionStatus = async () => {
  try {
    const response = await apiClient.get("/subscription/status");
    return response.data;
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    throw error;
  }
};

export const createOrder = async (planId) => {
  try {
    const response = await apiClient.post("/payment/create-order", { planId });
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const verifyPayment = async (orderId) => {
  try {
    const response = await apiClient.post("/payment/verify", { orderId });
    return response.data;
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
};

export const switchToFreePlan = async () => {
  try {
    const response = await apiClient.post("/subscription/switch-to-free", {});
    return response.data;
  } catch (error) {
    console.error("Error switching to free plan:", error);
    throw error;
  }
};

export const getSubscriptionHistory = async () => {
  try {
    const response = await apiClient.get("/subscription/history");
    return response.data.subscriptions;
  } catch (error) {
    console.error("Error fetching subscription history:", error);
    throw error;
  }
};

export default apiClient;