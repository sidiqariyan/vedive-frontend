import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Check, Sparkles, Rocket, Building2, X, Loader, Crown, Phone } from "lucide-react";
import { useAuth } from "./components/Pages/Mailer/AuthContext.jsx";
import { toast } from "react-toastify";
import { Helmet } from 'react-helmet';
import axios from "axios";
import "tailwindcss/tailwind.css";

const Abouts = () => {
  const [apiPlans, setApiPlans] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [showLoader, setShowLoader] = useState(true);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [isIndianUser, setIsIndianUser] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const planOrder = {
    free: 0,
    starter: 1,
    business: 2,
    enterprise: 3,
  };

  // Detect user location
  useEffect(() => {
    const detectUserLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setIsIndianUser(data.country_code === 'IN');
      } catch (error) {
        console.error("Error detecting location:", error);
        setIsIndianUser(true);
      }
    };
    detectUserLocation();
  }, []);

  // Sync token to localStorage if it changes
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
  }, [token]);

  const getCurrencySymbol = () => {
    return isIndianUser ? "₹" : "$";
  };

  const getPrice = (planId) => {
    if (planId === "free") return "0";
    const pricingData = {
      starter: { inr: "99", usd: "4.99" },
      business: { inr: "599", usd: "29.99" },
      enterprise: { inr: "1999", usd: "99" }
    };
    return isIndianUser ? pricingData[planId]?.inr || "0" : pricingData[planId]?.usd || "0";
  };

  // Fixed plan structure that matches your design
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
  ];

  useEffect(() => {
    // Fetch subscription plans from API (for potential mapping)
    axios
      .get("https://vedive.com:3000/api/subscription/plans")
      .then((res) => {
        console.log("API Plans fetched:", res.data);
        setApiPlans(res.data);
      })
      .catch((err) => {
        console.error("Error fetching plans:", err);
        toast.error("Failed to load subscription plans");
      });

    // Fetch user subscription info if authenticated
    if (!token) {
      setShowLoader(false);
      return;
    }

    axios
      .get("https://vedive.com:3000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("User info fetched:", res.data);
        setUserInfo(res.data.subscriptionInfo);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        toast.error("Failed to load user subscription info");
      })
      .finally(() => setShowLoader(false));
  }, [token]);

  const findApiPlanId = (planName) => {
    // Try to match API plan with our fixed plans
    const apiPlan = apiPlans.find(plan => 
      plan.name.toLowerCase().includes(planName.toLowerCase()) ||
      planName.toLowerCase().includes(plan.name.toLowerCase())
    );
    return apiPlan?._id || null;
  };

  const handleSubscribe = async (planId) => {
    if (planId === "free") return;

    if (!phone.startsWith("+")) {
      toast.error("Enter a valid phone number starting with '+'.");
      return;
    }
    
    if (!token) {
      toast.info("You must be logged in to subscribe.");
      navigate("/login", { state: { redirectTo: "/abouts" } });
      return;
    }

    // Find corresponding API plan ID
    const apiPlanId = findApiPlanId(planId);
    if (!apiPlanId) {
      toast.error("Plan not found. Please try again.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        "https://vedive.com:3000/api/subscription/subscribe",
        { planId: apiPlanId, phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { payment_session_id } = data;
      if (!payment_session_id) throw new Error("Payment session ID missing");

      // Initialize Cashfree payment
      if (typeof Cashfree !== 'undefined') {
        const cashfree = Cashfree({ mode: "production" });
        cashfree.checkout({ 
          paymentSessionId: payment_session_id, 
          redirectTarget: "_self" 
        });
      } else {
        throw new Error("Cashfree SDK not loaded");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error(error.response?.data?.error || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  const renderButton = (plan) => {
    const isCurrentPlan = userInfo?.currentPlan?.toLowerCase() === plan.name.toLowerCase();
    const isProcessing = loading;

    let btnText = plan.buttonText;
    if (isCurrentPlan) {
      btnText = "Current Plan";
    }

    const buttonStyle = isCurrentPlan
      ? "bg-green-100 text-green-800 cursor-not-allowed"
      : isProcessing
      ? "bg-gray-100 text-gray-500 cursor-wait"
      : plan.buttonStyle;

    return (
      <button
        onClick={() => {
          if (!isProcessing && !isCurrentPlan && !plan.disabled) {
            handleSubscribe(plan.id);
          }
        }}
        disabled={isProcessing || isCurrentPlan || plan.disabled}
        className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all ${buttonStyle}`}
      >
        {isProcessing ? (
          <>
            <Loader className="animate-spin mr-2 inline" size={16} />
            Processing...
          </>
        ) : (
          btnText
        )}
      </button>
    );
  };

  if (showLoader) {
    return (
      <div className="min-h-screen bg-white text-gray-800 py-24 px-4 flex flex-col items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
        <p className="text-lg">Loading subscription plans...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-4 sm:px-6 lg:px-8 relative overflow-auto">
      <Helmet>
        <title>Vedive Subscription Plans: Affordable Email & WhatsApp Tools</title>
        <meta name="description" content="Choose from Vedive's flexible subscription plans for bulk email sender, email scraper, and WhatsApp bulk sender tools. Find the perfect plan for your business needs!" />
      </Helmet>
      
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-500">
            Choose Your Perfect Plan
          </h1>
          <p className="text-gray-600 text-lg mt-4">
            Select the plan that best fits your needs and start growing your business today
          </p>
          
          {userInfo?.currentPlan && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg inline-block">
              <div className="flex items-center justify-center">
                <Crown className="w-5 h-5 text-yellow-500 mr-2" />
                <p className="text-blue-800">
                  <span className="font-bold">Your Active Plan: {userInfo.currentPlan}</span>
                  {userInfo.subscriptionEndDate && (
                    <span className="ml-2 text-sm">
                      (Valid until {new Date(userInfo.subscriptionEndDate).toLocaleDateString()})
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        {token && (
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter phone number (e.g., +919876543210)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Phone number is required for subscription activation
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => {
            const isCurrentPlan = userInfo?.currentPlan?.toLowerCase() === plan.name.toLowerCase();

            return (
              <div
                key={plan.id}
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
                  <plan.icon className={`w-12 h-12 ${
                    isCurrentPlan ? "text-blue-600" : "text-blue-500"
                  }`} />
                </div>

                <h3 className="text-xl font-semibold text-center mb-2">{plan.name}</h3>
                
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">
                    {getCurrencySymbol()}{plan.price}
                  </span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
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

                {renderButton(plan)}
              </div>
            );
          })}
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

export default Abouts;