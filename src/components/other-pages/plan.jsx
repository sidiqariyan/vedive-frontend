import React, { useState, useEffect, useCallback, useMemo } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Check, Sparkles, Rocket, Building2, X, Loader, Crown } from "lucide-react";
import subscriptionService from "./subscriptionService";
import { toast } from "react-toastify";
import { cashfree } from "./file/cashfree";
import { Helmet } from 'react-helmet';

// Constants
const PLAN_ORDER = {
  free: 0,
  starter: 1,
  business: 2,
  enterprise: 3,
};

const PRICING_DATA = {
  starter: { inr: "99", usd: "4.99" },
  business: { inr: "599", usd: "29.99" },
  enterprise: { inr: "1999", usd: "99" }
};

const STALE_ORDER_TIMEOUT = 60 * 60 * 1000; // 1 hour

// Custom hooks
const useUserLocation = () => {
  const [isIndianUser, setIsIndianUser] = useState(true);

  useEffect(() => {
    const detectUserLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setIsIndianUser(data.country_code === 'IN');
      } catch (error) {
        console.error("Error detecting location:", error);
        setIsIndianUser(true); // Default fallback
      }
    };
    
    detectUserLocation();
  }, []);

  return isIndianUser;
};

const useAuthentication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return isAuthenticated;
};

const useStaleOrderCleanup = () => {
  useEffect(() => {
    const pendingOrderData = localStorage.getItem("pendingOrder");
    
    if (pendingOrderData) {
      try {
        const pendingOrder = JSON.parse(pendingOrderData);
        const currentTime = Date.now();
        const orderTime = pendingOrder.timestamp || 0;
        
        if (currentTime - orderTime > STALE_ORDER_TIMEOUT) {
          console.log("Removing stale pending order");
          localStorage.removeItem("pendingOrder");
        }
      } catch (error) {
        console.error("Error parsing pending order:", error);
        localStorage.removeItem("pendingOrder");
      }
    }
  }, []);
};

// Utility functions
const getPriceUtils = (isIndianUser) => ({
  getPrice: (planId) => {
    if (planId === "free") return "0";
    return isIndianUser ? PRICING_DATA[planId].inr : PRICING_DATA[planId].usd;
  },
  getCurrencySymbol: () => isIndianUser ? "₹" : "$"
});

// Components
const PaymentStatusPage = ({ verifyingPayment, navigate, location }) => {
  const params = new URLSearchParams(location.search);
  const orderId = params.get("order_id");
  
  const handleReturnToPlans = useCallback(() => {
    localStorage.removeItem("pendingOrder");
    navigate("/plans", { replace: true });
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-white text-gray-800 py-24 px-4 flex flex-col items-center justify-center">
      <Helmet>
        <title>Payment Status - Vedive</title>
        <meta name="description" content="Payment verification status for Vedive subscription"/>
      </Helmet>
      <div className="w-full max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">Payment Status</h1>
        {verifyingPayment ? (
          <div className="mb-6">
            <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-lg">Verifying your payment...</p>
          </div>
        ) : (
          <p className="text-xl text-red-500 mb-8">Payment verification failed</p>
        )}
        <button
          onClick={handleReturnToPlans}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all"
        >
          Return to Plans
        </button>
      </div>
    </div>
  );
};

const PlanCard = ({ 
  plan, 
  currentSubscription, 
  onPlanSelect, 
  loading, 
  verifyingPayment,
  currencySymbol 
}) => {
  const currentPlanLevel = currentSubscription?.currentPlan ? PLAN_ORDER[currentSubscription.currentPlan] : 0;
  const selectedPlanLevel = PLAN_ORDER[plan.id];
  const isCurrentPlan = currentSubscription?.currentPlan === plan.id;
  const isLocked = currentPlanLevel > 0 && selectedPlanLevel <= currentPlanLevel && !isCurrentPlan;
  const isProcessing = loading || verifyingPayment;
  
  const getButtonText = () => {
    if (isCurrentPlan) return "Current Plan";
    if (isLocked) return "Locked";
    return plan.buttonText;
  };

  const getButtonStyle = () => {
    if (isCurrentPlan) return "bg-green-100 text-green-800 cursor-not-allowed";
    if (isProcessing) return "bg-gray-100 text-gray-500 cursor-wait";
    if (isLocked) return "bg-gray-100 text-gray-500 cursor-not-allowed";
    return plan.buttonStyle;
  };

  const handleClick = useCallback(() => {
    if (!isProcessing && !isLocked && !isCurrentPlan && !plan.disabled) {
      onPlanSelect(plan.id);
    }
  }, [isProcessing, isLocked, isCurrentPlan, plan.disabled, plan.id, onPlanSelect]);

  return (
    <div
      className={`relative rounded-2xl bg-white p-8 border ${
        isCurrentPlan
          ? "border-blue-500 ring-2 ring-blue-200"
          : "border-gray-200"
      } shadow-lg hover:shadow-xl transition-all duration-300 ${
        plan.popular ? "transform hover:-translate-y-2" : "hover:-translate-y-1"
      }`}
    >
      {isCurrentPlan && (
        <div className="absolute -top-5 inset-x-0 flex justify-center">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg flex items-center">
            <Crown className="w-4 h-4 mr-1" />
            Current Plan
          </span>
        </div>
      )}
      
      {plan.popular && !isCurrentPlan && (
        <div className="absolute -top-5 inset-x-0 flex justify-center">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="flex items-center justify-center mb-6">
        {plan.icon && (
          <plan.icon className={`w-12 h-12 ${
            isCurrentPlan ? "text-blue-600" : "text-blue-500"
          }`} />
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-center mb-2">{plan.name}</h3>
      
      <div className="text-center mb-6">
        <span className="text-4xl font-bold">{currencySymbol}{plan.price}</span>
        <span className="text-gray-500">{plan.period}</span>
      </div>
      
      <div className="space-y-4 mb-8">
        {plan.features.map((feature) => (
          <div key={feature.name} className="flex items-center">
            {feature.restricted ? (
              <X className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
            ) : (
              <Check className={`w-5 h-5 ${
                isCurrentPlan ? "text-blue-600" : "text-blue-500"
              } mr-3 flex-shrink-0`} />
            )}
            <span
              className={`text-sm ${
                feature.restricted
                  ? "text-gray-400 line-through"
                  : "text-gray-700"
              }`}
            >
              {feature.name}
            </span>
          </div>
        ))}
      </div>
      
      <button
        onClick={handleClick}
        disabled={isProcessing || isCurrentPlan || isLocked || plan.disabled}
        className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all ${getButtonStyle()}`}
      >
        {isProcessing ? (
          <>
            <Loader className="animate-spin mr-2 inline" size={16} />
            {verifyingPayment ? "Verifying Payment..." : "Processing..."}
          </>
        ) : (
          getButtonText()
        )}
      </button>
    </div>
  );
};

const Plan = () => {
  // State management
  const [loading, setLoading] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [paymentCancelled, setPaymentCancelled] = useState(false);
  
  // Custom hooks
  const isIndianUser = useUserLocation();
  const isAuthenticated = useAuthentication();
  useStaleOrderCleanup();
  
  // Router hooks
  const navigate = useNavigate();
  const location = useLocation();

  // Memoized values
  const { getPrice, getCurrencySymbol } = useMemo(
    () => getPriceUtils(isIndianUser),
    [isIndianUser]
  );

  const plans = useMemo(() => [
    {
      id: "free",
      name: "Free",
      price: "0",
      period: "/1-day",
      icon: Sparkles,
      features: [
        { name: "Unlimited Mail Sending", restricted: false },
        { name: "Scrap Unlimited Mails", restricted: true },
        { name: "Unlimited WhatsApp Message Sending", restricted: false },
        { name: "Unlimited Mail & WhatsApp Template", restricted: true },
      ],
      buttonText: "Free Plan",
      popular: false,
      buttonStyle: "border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed",
      disabled: true
    },
    {
      id: "starter",
      name: "Starter",
      price: getPrice("starter"),
      period: "/1-day",
      icon: Rocket,
      features: [
        { name: "Unlimited Mail Sending", restricted: false },
        { name: "Scrap Unlimited Mails", restricted: false },
        { name: "Unlimited WhatsApp Message Sending", restricted: false },
        { name: "Unlimited Mail & WhatsApp Template", restricted: false },
      ],
      buttonText: "Buy Now",
      popular: false,
      buttonStyle: "border border-gray-300 hover:border-gray-400",
      disabled: false
    },
    {
      id: "business",
      name: "Business",
      price: getPrice("business"),
      period: "/1-week",
      icon: Building2,
      features: [
        { name: "Unlimited Mail Sending", restricted: false },
        { name: "Scrap Unlimited Mails", restricted: false },
        { name: "Unlimited WhatsApp Message Sending", restricted: false },
        { name: "Unlimited Mail & WhatsApp Template", restricted: false },
      ],
      buttonText: "Buy Now",
      popular: true,
      buttonStyle: "bg-blue-600 hover:bg-blue-700 text-white",
      disabled: false
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: getPrice("enterprise"),
      period: "/1-month",
      icon: Building2,
      features: [
        { name: "Unlimited Mail Sending", restricted: false },
        { name: "Scrap Unlimited Mails", restricted: false },
        { name: "Unlimited WhatsApp Message Sending", restricted: false },
        { name: "Unlimited Mail & WhatsApp Template", restricted: false },
      ],
      buttonText: "Buy Now",
      popular: false,
      buttonStyle: "border border-gray-300 hover:border-gray-400",
      disabled: false
    },
  ], [getPrice]);

  // Payment initialization
  const initializePayment = useCallback((paymentSessionId, orderId) => {
    const checkoutOptions = {
      paymentSessionId,
      returnUrl: `https://vedive.com/plans/payment-status?order_id=${orderId}`,
      redirectTarget: "_self",
      theme: {
        navbarColor: "#2563eb",
        primaryColor: "#2563eb",
        buttonColor: "#2563eb",
      },
    };

    cashfree.checkout(checkoutOptions).then(({ error, redirect }) => {
      if (error) {
        console.error("Payment Error:", error);
        toast.error(error.message || "Payment initialization failed");
        localStorage.removeItem("pendingOrder");
        setPaymentCancelled(true);
      }
      if (redirect) {
        console.log("Redirecting to payment gateway...");
      }
    });
  }, []);

  // Payment verification
  const verifyAndProcessPayment = useCallback(async (orderId) => {
    if (!orderId || verifyingPayment || paymentCancelled) return;
    
    try {
      setVerifyingPayment(true);
      toast.info("Verifying your payment...");
      
      if (!isAuthenticated) {
        navigate("/login", {
          state: { redirectTo: `https://vedive.com/plans/payment-status?order_id=${orderId}` },
        });
        return;
      }
      
      const response = await subscriptionService.verifyPayment(orderId);
      
      if (response.data.success) {
        toast.success("Payment successful! Subscription activated.");
        localStorage.removeItem("pendingOrder");
        await fetchSubscriptionStatus();
        navigate("/dashboard", { replace: true });
      } else {
        toast.error(response.data.error || "Payment verification failed");
        localStorage.removeItem("pendingOrder");
        setPaymentCancelled(true);
        navigate("/plans", { replace: true });
      }
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error(error.response?.data?.error || "Payment verification failed");
      localStorage.removeItem("pendingOrder");
      setPaymentCancelled(true);
      navigate("/plans", { replace: true });
    } finally {
      setVerifyingPayment(false);
    }
  }, [verifyingPayment, navigate, paymentCancelled, isAuthenticated]);

  // Subscription status fetching
  const fetchSubscriptionStatus = useCallback(async () => {
    try {
      const response = await subscriptionService.getSubscriptionStatus();
      setCurrentSubscription(response.data);
      if (response.data.hasActiveSubscription) {
        localStorage.removeItem("pendingOrder");
      }
    } catch (error) {
      console.error("Subscription Error:", error);
      toast.error("Failed to load subscription status");
    }
  }, []);

  // Plan selection handler
  const handlePlanSelection = useCallback(async (planId) => {
    if (planId === "free") return;
    
    if (!isAuthenticated) {
      toast.info("Please login to subscribe to a plan");
      navigate("/login", { state: { redirectTo: "/plans" } });
      return;
    }

    const currentPlanLevel = currentSubscription?.currentPlan ? PLAN_ORDER[currentSubscription.currentPlan] : 0;
    const selectedPlanLevel = PLAN_ORDER[planId];
    
    if (currentPlanLevel > 0 && selectedPlanLevel <= currentPlanLevel) {
      toast.info("You can only upgrade to a higher plan");
      return;
    }
    
    try {
      setLoading(true);
      const priceForBackend = isIndianUser ? 
        getPrice(planId) : 
        PRICING_DATA[planId].inr;
        
      const orderResponse = await subscriptionService.createOrder({
        planId,
        amount: priceForBackend,
      });
      
      if (orderResponse?.data?.paymentSessionId) {
        localStorage.setItem(
          "pendingOrder",
          JSON.stringify({
            orderId: orderResponse.data.orderId,
            planId,
            timestamp: Date.now()
          })
        );
        setPaymentCancelled(false);
        initializePayment(orderResponse.data.paymentSessionId, orderResponse.data.orderId);
      }
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error(error.response?.data?.error || "Payment initialization failed");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, currentSubscription, isIndianUser, getPrice, initializePayment, navigate]);

  // Effects
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get("order_id");
    
    if (location.pathname.includes("/payment-status") && orderId) {
      verifyAndProcessPayment(orderId);
    } else if (location.pathname === "/plans") {
      setVerifyingPayment(false);
      setPaymentCancelled(false);
    }
  }, [location.pathname, location.search, verifyAndProcessPayment]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscriptionStatus();
    }
  }, [isAuthenticated, fetchSubscriptionStatus]);

  // Render payment status page
  if (location.pathname.includes("/payment-status")) {
    return (
      <PaymentStatusPage 
        verifyingPayment={verifyingPayment} 
        navigate={navigate} 
        location={location} 
      />
    );
  }

  // Main component render
  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-4 sm:px-6 lg:px-8 relative overflow-auto">
      <Helmet>
        <title>Vedive Pricing: Affordable Email & WhatsApp Tools India</title>
        <meta name="description" content="Discover Vedive's affordable pricing for bulk email sender, email scraper, and WhatsApp bulk sender tools. Start with flexible plans or a free trial!"/>
      </Helmet>
      
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-third">
            Choose Your Perfect Plan
          </h1>
          <p className="text-gray-600 text-lg">
            Select the plan that best fits your needs and start growing your business today
          </p>
          {currentSubscription?.hasActiveSubscription && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg inline-block">
              <div className="flex items-center justify-center">
                <Crown className="w-5 h-5 text-yellow-500 mr-2" />
                <p className="text-blue-800">
                  <span className="font-bold">Your Active Plan: {currentSubscription.currentPlan}</span>
                  {currentSubscription.subscription?.endDate && (
                    <span className="ml-2 text-sm">
                      (Valid until {new Date(currentSubscription.subscription.endDate).toLocaleDateString()})
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              currentSubscription={currentSubscription}
              onPlanSelect={handlePlanSelection}
              loading={loading}
              verifyingPayment={verifyingPayment}
              currencySymbol={getCurrencySymbol()}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center max-w-2xl mx-auto p-8 rounded-2xl bg-gray-50 border border-gray-200 shadow-md">
          <h3 className="text-2xl font-bold mb-4">Need a custom solution?</h3>
          <p className="text-gray-600 mb-6">
            Contact our team to create a tailored plan that perfectly suits your business requirements
          </p>
          <NavLink
            to="/contact"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-50 transition-all duration-300 font-semibold"
          >
            Contact us
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Plan;