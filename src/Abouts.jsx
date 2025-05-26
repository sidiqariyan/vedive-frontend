import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./components/Pages/Mailer/AuthContext.jsx"; // Adjust path as needed
import SubscriptionCard from "./components/SubscriptionRoute.jsx"; // Adjust path as needed
import axios from "axios";
import "tailwindcss/tailwind.css";

// Include Cashfree SDK in your project (e.g., via script tag in index.html)
// 

const Abouts = () => {
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState(null);
  const [showLoader, setShowLoader] = useState(true);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    // Fetch subscription plans
    axios
      .get("https://vedive.com:3000/api/subscription/plans") // Replace with your backend URL
      .then((res) => {
        setPlans(res.data);
      })
      .catch((err) => console.error("Error fetching plans:", err));

    // Fetch user data (assumes a dashboard endpoint)
    axios
      .get("https://vedive.com:3000/api/dashboard", { // Replace with your backend URL
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setUser(res.data.subscriptionInfo);
      })
      .catch((err) => console.error("Error fetching user:", err))
      .finally(() => setShowLoader(false));
  }, []);

  const handleSubscribe = async (planId) => {
    // Client-side phone validation
    if (!phone || !phone.startsWith("+")) {
      alert("Please enter a valid phone number starting with '+' (e.g., +919876543210)");
      return;
    }

    try {
      const token = localStorage.getItem("token");
const response = await axios.post(
  "https://vedive.com:3000/api/subscription/subscribe",
  { planId, phone },
  { headers: { Authorization: `Bearer ${token}` } }
);

      const { payment_session_id } = response.data;
      if (!payment_session_id) {
        throw new Error("Payment session ID not received");
      }

      // Initialize Cashfree SDK
      const cashfree = Cashfree({
        mode: "production" 
      });

      // Open checkout page
      const checkoutOptions = {
        paymentSessionId: payment_session_id,
        redirectTarget: "_self", // Opens in the same tab
      };

      cashfree.checkout(checkoutOptions);
    } catch (error) {
      console.error("Payment initiation error:", error);
      const errorMessage = error.response?.data?.error || "Failed to initiate payment";
      alert(errorMessage); // Show specific error to the user
    }
  };

  return (
   <>
        <div className="container mx-auto p-4 bg-primary">
          <h1 className="text-3xl font-bold text-center mb-6">Subscription Plans</h1>
          {user && (
            <div className="text-center mb-4">
              <p>Current Plan: {user.currentPlan}</p>
              {user.subscriptionEndDate && (
                <p>Expires: {new Date(user.subscriptionEndDate).toLocaleDateString()}</p>
              )}
            </div>
          )}
          {showLoader ? (
            <p>Loading...</p> // Replace with your loader component if available
          ) : (
            <div className="flex flex-wrap justify-center">
              {plans.map((plan) => (
                <SubscriptionCard
                  key={plan._id}
                  plan={plan}
                  onSubscribe={() => handleSubscribe(plan._id)}
                />
              ))}
            </div>
          )}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Enter phone number (e.g., +919876543210)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
     </>
  );
};

export default Abouts;