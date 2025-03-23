// Example of what your PaymentStatus.jsx might need
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import subscriptionService from "./subscriptionService";
import { toast } from "react-toastify";

const PaymentStatus = () => {
  const [status, setStatus] = useState("processing");
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const orderId = params.get("order_id");
      
      if (!orderId) {
        setStatus("error");
        toast.error("No order ID found");
        return;
      }
      
      try {
        const response = await subscriptionService.verifyPayment(orderId);
        if (response.data.success) {
          setStatus("success");
          toast.success("Payment successful! Subscription activated.");
          localStorage.removeItem("pendingOrder");
          // Redirect after a short delay
          setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 3000);
        } else {
          setStatus("error");
          toast.error("Payment verification failed");
        }
      } catch (error) {
        console.error("Payment Error:", error);
        setStatus("error");
        toast.error(error.response?.data?.error || "Payment verification failed");
      }
    };
    
    verifyPayment();
  }, [location.search, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
        {status === "processing" && (
          <div>
            <p>Processing your payment...</p>
            {/* Add a loading spinner here */}
          </div>
        )}
        {status === "success" && (
          <div>
            <p className="text-green-600">Payment successful!</p>
            <p>Your subscription has been activated.</p>
            <p>Redirecting to dashboard...</p>
          </div>
        )}
        {status === "error" && (
          <div>
            <p className="text-red-600">Payment verification failed</p>
            <button 
              onClick={() => navigate("/plans")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Return to Plans
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;