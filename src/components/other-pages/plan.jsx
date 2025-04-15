import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Check, Sparkles, Rocket, Building2, X, Loader, Crown } from "lucide-react";
import subscriptionService from "./subscriptionService";
import { toast } from "react-toastify";
import { cashfree } from "./file/cashfree";

const Plan = () => {
  const [loading, setLoading] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [paymentCancelled, setPaymentCancelled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Define the plan order to determine upgrade/downgrade
  const planOrder = {
    free: 0,
    starter: 1,
    business: 2,
    enterprise: 3,
  };

  const plans = [
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
        // { name: "Scrap Unlimited Numbers", restricted: true },
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
      price: "49",
      period: "/1-day",
      icon: Rocket,
      features: [
        { name: "Unlimited Mail Sending", restricted: false },
        { name: "Scrap Unlimited Mails", restricted: false },
        { name: "Unlimited WhatsApp Message Sending", restricted: false },
        // { name: "Scrap Unlimited Numbers", restricted: false },
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
      price: "199",
      period: "/1-week",
      icon: Building2,
      features: [
        { name: "Unlimited Mail Sending", restricted: false },
        { name: "Scrap Unlimited Mails", restricted: false },
        { name: "Unlimited WhatsApp Message Sending", restricted: false },
        // { name: "Scrap Unlimited Numbers", restricted: false },
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
      price: "699",
      period: "/1-month",
      icon: Building2,
      features: [
        { name: "Unlimited Mail Sending", restricted: false },
        { name: "Scrap Unlimited Mails", restricted: false },
        { name: "Unlimited WhatsApp Message Sending", restricted: false },
        // { name: "Scrap Unlimited Numbers", restricted: false },
        { name: "Unlimited Mail & WhatsApp Template", restricted: false },
      ],
      buttonText: "Buy Now",
      popular: false,
      buttonStyle: "border border-gray-300 hover:border-gray-400",
      disabled: false
    },
  ];

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

  const verifyAndProcessPayment = useCallback(async (orderId) => {
    if (!orderId || verifyingPayment || paymentCancelled) return;
    
    try {
      setVerifyingPayment(true);
      toast.info("Verifying your payment...");
      
      if (!localStorage.getItem("token")) {
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
  }, [verifyingPayment, navigate, paymentCancelled]);

  // Handle URL parameters for payment verification
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

  const handlePlanSelection = async (planId) => {
    // Get the selected plan details
    const selectedPlan = plans.find((plan) => plan.id === planId);

    // If free plan or no upgrade available, return early
    if (planId === "free") return;
    
    // If user is not authenticated, prompt to login
    if (!isAuthenticated) {
      toast.info("Please login to subscribe to a plan");
      navigate("/login", { state: { redirectTo: "/plans" } });
      return;
    }

    // If user already has an active plan that is equal or higher, do not allow purchase
    const currentPlanLevel = currentSubscription?.currentPlan ? planOrder[currentSubscription.currentPlan] : 0;
    const selectedPlanLevel = planOrder[selectedPlan.id];
    if (currentPlanLevel > 0 && selectedPlanLevel <= currentPlanLevel) {
      toast.info("You can only upgrade to a higher plan");
      return;
    }
    
    try {
      setLoading(true);
      // Pass both planId and the plan price as amount
      const orderResponse = await subscriptionService.createOrder({
        planId,
        amount: selectedPlan.price,
      });
      console.log("Order Response:", orderResponse.data);
      
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
  };

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

  // Clear stale pending orders
  useEffect(() => {
    const pendingOrderData = localStorage.getItem("pendingOrder");
    
    if (pendingOrderData) {
      const pendingOrder = JSON.parse(pendingOrderData);
      const currentTime = Date.now();
      const orderTime = pendingOrder.timestamp || 0;
      const oneHourInMs = 60 * 60 * 1000;
      
      if (currentTime - orderTime > oneHourInMs) {
        console.log("Removing stale pending order");
        localStorage.removeItem("pendingOrder");
      }
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    if (token) fetchSubscriptionStatus();
  }, [fetchSubscriptionStatus]);

  const renderButton = (plan) => {
    const currentPlanLevel = currentSubscription?.currentPlan ? planOrder[currentSubscription.currentPlan] : 0;
    const selectedPlanLevel = planOrder[plan.id];
    const isCurrentPlan = currentSubscription?.currentPlan === plan.id;
    // If user has an active subscription (non-free), lock buttons for plans that are lower or equal to their current plan.
    const isLocked = currentPlanLevel > 0 && selectedPlanLevel <= currentPlanLevel && !isCurrentPlan;
    const isProcessing = loading || verifyingPayment;
    
    // Set button text: if current plan then "Current Plan", if locked then "Locked", otherwise use plan.buttonText.
    let btnText = plan.buttonText;
    if (isCurrentPlan) {
      btnText = "Current Plan";
    } else if (isLocked) {
      btnText = "Locked";
    }

    return (
      <button
        onClick={() => {
          if (!isProcessing && !isLocked && !isCurrentPlan) {
            handlePlanSelection(plan.id);
          }
        }}
        disabled={isProcessing || isCurrentPlan || isLocked || plan.disabled}
        className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
          isCurrentPlan
            ? "bg-green-100 text-green-800 cursor-not-allowed"
            : isProcessing
            ? "bg-gray-100 text-gray-500 cursor-wait"
            : isLocked
            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
            : plan.buttonStyle
        }`}
      >
        {isProcessing ? (
          <>
            <Loader className="animate-spin mr-2 inline" size={16} />
            {verifyingPayment ? "Verifying Payment..." : "Processing..."}
          </>
        ) : (
          btnText
        )}
      </button>
    );
  };

  const PaymentStatusPage = () => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get("order_id");
    
    return (
      <div className="min-h-screen bg-white text-gray-800 py-24 px-4 flex flex-col items-center justify-center">
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
            onClick={() => {
              localStorage.removeItem("pendingOrder");
              navigate("/plans", { replace: true });
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all"
          >
            Return to Plans
          </button>
        </div>
      </div>
    );
  };

  if (location.pathname.includes("/payment-status")) {
    return <PaymentStatusPage />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-4 sm:px-6 lg:px-8 relative overflow-auto">
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
            <div
              key={plan.id}
              className={`relative rounded-2xl bg-white p-8 border ${
                currentSubscription?.currentPlan === plan.id
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200"
              } shadow-lg hover:shadow-xl transition-all duration-300 ${
                plan.popular ? "transform hover:-translate-y-2" : "hover:-translate-y-1"
              }`}
            >
              {currentSubscription?.currentPlan === plan.id && (
                <div className="absolute -top-5 inset-x-0 flex justify-center">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg flex items-center">
                    <Crown className="w-4 h-4 mr-1" />
                    Current Plan
                  </span>
                </div>
              )}
              
              {plan.popular && currentSubscription?.currentPlan !== plan.id && (
                <div className="absolute -top-5 inset-x-0 flex justify-center">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-center mb-6">
                {plan.icon && (
                  <plan.icon className={`w-12 h-12 ${
                    currentSubscription?.currentPlan === plan.id ? "text-blue-600" : "text-blue-500"
                  }`} />
                )}
              </div>
              
              <h3 className="text-xl font-semibold text-center mb-2">{plan.name}</h3>
              
              <div className="text-center mb-6">
                <span className="text-4xl font-bold">₹{plan.price}</span>
                <span className="text-gray-500">{plan.period}</span>
              </div>
              
              <div className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <div key={feature.name} className="flex items-center">
                    {feature.restricted ? (
                      <X className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                    ) : (
                      <Check className={`w-5 h-5 ${
                        currentSubscription?.currentPlan === plan.id ? "text-blue-600" : "text-blue-500"
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
              
              {renderButton(plan)}
            </div>
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
