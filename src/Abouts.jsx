import React, { useState, useEffect } from "react";
import { Check, Sparkles, Rocket, Building2, X, Loader, Crown, Phone, ChevronDown, Search } from "lucide-react";

// Country codes data
const countryCodes = [
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" }
];

const Abouts = () => {
  const [apiPlans, setApiPlans] = useState([]);
  const [user, setUser] = useState(null);
  const [showLoader, setShowLoader] = useState(true);
  const [phone, setPhone] = useState("");
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isIndianUser, setIsIndianUser] = useState(true);
  
  // Country code dropdown states
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");

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
        if (data.country_code === 'IN') {
          setSelectedCountryCode("+91");
        } else {
          setSelectedCountryCode("+1");
        }
      } catch (error) {
        console.error("Error detecting location:", error);
        setIsIndianUser(true);
      }
    };
    detectUserLocation();
  }, [isIndianUser]);

  const getCurrencySymbol = () => {
    return isIndianUser ? "₹" : "$";
  };

const getPrice = (plan) => {
  if (!plan || !plan.name) {
    return "0";
  }
  
  const planName = plan.name.toLowerCase();
  
  if (planName.includes('free')) return "0";
  
  // First, try to get price from the API response (database)
  if (plan.prices && Array.isArray(plan.prices)) {
    const targetCurrency = isIndianUser ? "INR" : "USD";
    const priceObj = plan.prices.find(p => p.currency === targetCurrency);
    if (priceObj && priceObj.amount) {
      return priceObj.amount.toString();
    }
  }
  
  // Fallback to hardcoded pricing if API doesn't have prices
  const pricingData = {
    starter: { inr: "99", usd: "4.99" },
    business: { inr: "599", usd: "29.99" },
    enterprise: { inr: "1999", usd: "99" }
  };
  
  for (const [key, prices] of Object.entries(pricingData)) {
    if (planName.includes(key)) {
      return isIndianUser ? prices.inr : prices.usd;
    }
  }
  
  // Final fallback to single price property
  if (plan.price) {
    return plan.price.toString();
  }
  
  return "0";
};

const getPeriod = (plan) => {  // Changed from (planName) to (plan)
  if (!plan || !plan.name) return "/month";
  
  const planName = plan.name.toLowerCase();
  
  if (planName.includes('free')) return "/1-day";
  if (planName.includes('starter')) return "/1-day";
  if (planName.includes('business')) return "/1-week";
  if (planName.includes('enterprise')) return "/1-month";
  return "/month";
};
  // Icon mapping for different plan types
  const getIconForPlan = (planName) => {
    const name = planName?.toLowerCase() || '';
    if (name.includes('free')) return Sparkles;
    if (name.includes('starter') || name.includes('basic')) return Rocket;
    if (name.includes('business') || name.includes('professional')) return Building2;
    if (name.includes('enterprise') || name.includes('premium')) return Building2;
    return Sparkles;
  };

  // Determine if plan should be marked as popular
  const isPlanPopular = (planName, index) => {
    const name = planName?.toLowerCase() || '';
    return name.includes('business') || name.includes('professional') || index === 2;
  };

  // Get features for each plan
  const getPlanFeatures = (planName) => {
    const name = planName?.toLowerCase() || '';
    
    if (name.includes('free')) {
      return [
        { name: "Unlimited Mail Sending", restricted: false },
        { name: "Scrap Unlimited Mails", restricted: true },
        { name: "Unlimited WhatsApp Message Sending", restricted: false },
        { name: "Unlimited Mail & WhatsApp Template", restricted: true },
      ];
    }
    
    // All paid plans have full features
    return [
      { name: "Unlimited Mail Sending", restricted: false },
      { name: "Scrap Unlimited Mails", restricted: false },
      { name: "Unlimited WhatsApp Message Sending", restricted: false },
      { name: "Unlimited Mail & WhatsApp Template", restricted: false },
    ];
  };

  useEffect(() => {
    // Fetch subscription plans
    fetch("https://vedive.com:3000/api/subscription/plans")
      .then((res) => res.json())
      .then((data) => {
        const sortedPlans = data.sort((a, b) => {
          const aOrder = planOrder[a.name.toLowerCase()] ?? 999;
          const bOrder = planOrder[b.name.toLowerCase()] ?? 999;
          return aOrder - bOrder;
        });
        setApiPlans(sortedPlans);
      })
      .catch((err) => console.error("Error fetching plans:", err));

    // Fetch user data
    fetch("https://vedive.com:3000/api/dashboard", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.subscriptionInfo);
      })
      .catch((err) => console.error("Error fetching user:", err))
      .finally(() => setShowLoader(false));
  }, []);

  const handleBuyNowClick = (planId) => {
    setSelectedPlan(planId);
    setShowPhoneModal(true);
    setPhone("");
  };

  const handleSubscribe = async () => {
    // Client-side phone validation with country code
    const fullPhoneNumber = selectedCountryCode + phone;
    const phoneRegex = /^\+\d{10,15}$/;
    
    if (!phone || !phoneRegex.test(fullPhoneNumber)) {
      alert("Please enter a valid phone number");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "https://vedive.com:3000/api/subscription/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ planId: selectedPlan, phone: fullPhoneNumber }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate payment");
      }

      const { payment_session_id } = data;
      if (!payment_session_id) {
        throw new Error("Payment session ID not received");
      }

      setShowPhoneModal(false);

      // Initialize Cashfree SDK
      const cashfree = Cashfree({
        mode: "production"
      });

      // Open checkout page
      const checkoutOptions = {
        paymentSessionId: payment_session_id,
        redirectTarget: "_self",
      };

      cashfree.checkout(checkoutOptions);
    } catch (error) {
      console.error("Payment initiation error:", error);
      const errorMessage = error.message || "Failed to initiate payment";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowPhoneModal(false);
    setSelectedPlan(null);
    setPhone("");
    setCountrySearchTerm("");
    setShowCountryDropdown(false);
  };

  const filteredCountries = countryCodes.filter(country =>
    country.country.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
    country.code.includes(countrySearchTerm)
  );

  const selectedCountry = countryCodes.find(country => country.code === selectedCountryCode);

  const renderButton = (plan) => {
    const isCurrentPlan = user?.currentPlan?.toLowerCase() === plan.name?.toLowerCase();
    const isFree = plan.name?.toLowerCase().includes('free');

    let btnText = "Buy Now";
    let buttonStyle = "border border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50";
    let disabled = false;

    if (isCurrentPlan) {
      btnText = "Current Plan";
      buttonStyle = "bg-green-100 text-green-800 cursor-not-allowed";
      disabled = true;
    } else if (isFree) {
      btnText = "Free Plan";
      buttonStyle = "border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed";
      disabled = true;
    } else if (isPlanPopular(plan.name, 0)) {
      buttonStyle = "bg-blue-600 hover:bg-blue-700 text-white";
    }

    return (
      <button
        onClick={() => {
          if (!disabled && !isFree) {
            handleBuyNowClick(plan._id);
          }
        }}
        disabled={disabled}
        className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all ${buttonStyle}`}
      >
        {btnText}
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
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-500">
            Choose Your Perfect Plan
          </h1>
          <p className="text-gray-600 text-lg mt-4">
            Select the plan that best fits your needs and start growing your business today
          </p>

          {user?.currentPlan && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg inline-block">
              <div className="flex items-center justify-center">
                <Crown className="w-5 h-5 text-yellow-500 mr-2" />
                <p className="text-blue-800">
                  <span className="font-bold">Your Active Plan: {user.currentPlan}</span>
                  {user.subscriptionEndDate && (
                    <span className="ml-2 text-sm">
                      (Valid until {new Date(user.subscriptionEndDate).toLocaleDateString()})
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {apiPlans.map((plan, index) => {
            const isCurrentPlan = user?.currentPlan?.toLowerCase() === plan.name?.toLowerCase();
            const IconComponent = getIconForPlan(plan.name);
            const isPopular = isPlanPopular(plan.name, index);
            const features = getPlanFeatures(plan.name);
            const price = getPrice(plan);        // Pass plan object instead of plan.name
            const period = getPeriod(plan);      // Pass plan object instead of plan.name
            
            return (
              
              <div
                key={plan._id}
                className={`relative rounded-2xl bg-white p-8 border ${
                  isCurrentPlan
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200"
                } shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isPopular ? "transform hover:-translate-y-2" : "hover:-translate-y-1"
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

                {isPopular && !isCurrentPlan && (
                  <div className="absolute -top-5 inset-x-0 flex justify-center">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-center mb-6">
                  <IconComponent className={`w-12 h-12 ${
                    isCurrentPlan ? "text-blue-600" : "text-blue-500"
                  }`} />
                </div>

                <h3 className="text-xl font-semibold text-center mb-2">{plan.name}</h3>

                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">
                    {getCurrencySymbol()}{price}
                  </span>
                  <span className="text-gray-500">{period}</span>
                </div>

                <div className="space-y-4 mb-8">
                  {features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
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
          <button className="inline-flex items-center px-6 py-3 rounded-xl bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-50 transition-all duration-300 font-semibold">
            Contact us
          </button>
        </div>
      </div>

      {/* Enhanced Phone Number Modal with Country Dropdown */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Enter Phone Number</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Please enter your phone number for payment verification and subscription notifications.
            </p>

            {/* Country Code Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country Code
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="mr-2">{selectedCountry?.flag}</span>
                    <span className="font-medium">{selectedCountryCode}</span>
                    <span className="ml-2 text-gray-500">{selectedCountry?.country}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                    showCountryDropdown ? 'rotate-180' : ''
                  }`} />
                </button>

                {showCountryDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-hidden">
                    <div className="p-3 border-b border-gray-200">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search countries..."
                          value={countrySearchTerm}
                          onChange={(e) => setCountrySearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                    <div className="max-h-40 overflow-y-auto">
                      {filteredCountries.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => {
                            setSelectedCountryCode(country.code);
                            setShowCountryDropdown(false);
                            setCountrySearchTerm("");
                          }}
                          className="w-full flex items-center px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                        >
                          <span className="mr-3">{country.flag}</span>
                          <span className="font-medium mr-2">{country.code}</span>
                          <span className="text-gray-600">{country.country}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter phone number (without country code)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ''))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Full number: {selectedCountryCode}{phone}
              </p>
            </div>

            <p className="text-sm text-gray-500 mb-6 text-center">
              Phone number is required for subscription activation
            </p>

            <div className="flex gap-4">
              <button
                onClick={closeModal}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSubscribe}
                disabled={loading || !phone}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin mr-2 inline" size={16} />
                    Processing...
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    
  );
};

export default Abouts;