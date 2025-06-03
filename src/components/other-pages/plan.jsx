import React, { useState, useEffect } from "react";
import { Check, Sparkles, Rocket, Building2, X, Loader, Crown, Phone, ChevronDown, Search, Tag, Percent } from "lucide-react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const Plan = () => {
  const [apiPlans, setApiPlans] = useState([]);
  const [user, setUser] = useState(null);
  const [showLoader, setShowLoader] = useState(true);
  const [phone, setPhone] = useState("");
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isIndianUser, setIsIndianUser] = useState(true);
  
  // Coupon related states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

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
    
    // Updated hardcoded pricing to match your requirements
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

  const getPeriod = (plan, index) => {
    if (!plan || !plan.name) return "/month";
    
    const planName = plan.name.toLowerCase();
    
    // Use index-based mapping for better accuracy
    if (index === 0 || planName.includes('free')) return "/1-day";
    if (index === 1 || planName.includes('starter')) return "/1-day";
    if (index === 2 || planName.includes('business')) return "/1-week";
    if (index === 3 || planName.includes('enterprise')) return "/1-month";
    
    // Fallback based on plan name
    if (planName.includes('free')) return "/1-day";
    if (planName.includes('starter')) return "/1-day";
    if (planName.includes('business')) return "/1-week";
    if (planName.includes('enterprise')) return "/1-month";
    return "/month";
  };

  // Get display name for plans
  const getDisplayName = (plan, index) => {
    if (!plan || !plan.name) return "Unknown";
    
    const planName = plan.name.toLowerCase();
    
    if (planName.includes('free')) return "Free";
    
    // Map the plan names to desired display names based on index
    if (index === 1) return "Starter";
    if (index === 2) return "Business"; 
    if (index === 3) return "Enterprise";
    
    // Fallback to original name if no match
    return plan.name;
  };

  // Icon mapping for different plan types
  const getIconForPlan = (planName, index) => {
    const name = planName?.toLowerCase() || '';
    
    // Use index-based mapping for better consistency
    if (index === 0 || name.includes('free')) return Sparkles;
    if (index === 1) return Rocket; // Starter
    if (index === 2) return Building2; // Business
    if (index === 3) return Crown; // Enterprise
    
    // Fallback based on name
    if (name.includes('starter') || name.includes('basic')) return Rocket;
    if (name.includes('business') || name.includes('professional')) return Building2;
    if (name.includes('enterprise') || name.includes('premium')) return Crown;
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
        { name: "Unlimited Gmail Sending", restricted: true },
        { name: "Scrap Unlimited Mails", restricted: true },
        { name: "Unlimited WhatsApp Message Sending", restricted: false },
        { name: "Unlimited Mail & WhatsApp Template", restricted: true },
      ];
    }
    
    // All paid plans have full features
    return [
      { name: "Unlimited Mail Sending", restricted: false },
      { name: "Unlimited Gmail Sending", restricted: false },
      { name: "Scrap Unlimited Mails", restricted: false },
      { name: "Unlimited WhatsApp Message Sending", restricted: false },
      { name: "Unlimited Mail & WhatsApp Template", restricted: false },
    ];
  };

  // Coupon validation function
  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setCouponError('');
    setCouponLoading(true);
    
    try {
      const response = await fetch('http://localhost:3000/api/coupon/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          code: couponCode,
          orderAmount: originalPrice,
          currency: isIndianUser ? 'INR' : 'USD',
          planId: selectedPlan
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setAppliedCoupon(data.coupon);
        setFinalPrice(data.finalAmount);
      } else {
        setCouponError(data.error || 'Invalid coupon code');
      }
    } catch (error) {
      setCouponError('Failed to validate coupon. Please try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  // Remove coupon function
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setFinalPrice(originalPrice);
    setCouponError('');
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
        // Swap 3rd and 4th plans (index 2 and 3)
        if (sortedPlans.length >= 4) {
          [sortedPlans[2], sortedPlans[3]] = [sortedPlans[3], sortedPlans[2]];
        }
        setApiPlans(sortedPlans);
      })
      .catch((err) => {
        console.error("Error fetching plans:", err);
        // Fallback to mock data if API fails
        const mockPlans = [
          { _id: '1', name: 'Free', prices: [{ currency: 'INR', amount: 0 }, { currency: 'USD', amount: 0 }] },
          { _id: '2', name: 'Starter', prices: [{ currency: 'INR', amount: 99 }, { currency: 'USD', amount: 4.99 }] },
          { _id: '3', name: 'Business', prices: [{ currency: 'INR', amount: 599 }, { currency: 'USD', amount: 29.99 }] },
          { _id: '4', name: 'Enterprise', prices: [{ currency: 'INR', amount: 1999 }, { currency: 'USD', amount: 99 }] }
        ];
        setApiPlans(mockPlans);
      });

    // Fetch user data
    fetch("https://vedive.com:3000/api/dashboard", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.subscriptionInfo);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        // Set mock user data for testing
        setUser({ currentPlan: 'Free' });
      })
      .finally(() => setShowLoader(false));
  }, []);

  const handleBuyNowClick = (planId, plan) => {
    setSelectedPlan(planId);
    const price = parseFloat(getPrice(plan));
    setOriginalPrice(price);
    setFinalPrice(price);
    setShowPhoneModal(true);
    setPhone("");
    // Reset coupon state when opening modal
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handleSubscribe = async () => {
    // Validate phone using react-phone-number-input validation
    if (!phone || phone.length < 10) {
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
          body: JSON.stringify({ 
            planId: selectedPlan, 
            phone: phone,
            couponCode: appliedCoupon?.code || null,
            finalAmount: finalPrice
          }),
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
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
    setOriginalPrice(0);
    setFinalPrice(0);
  };

  const renderButton = (plan, index) => {
    const isCurrentPlan = user?.currentPlan?.toLowerCase() === plan.name?.toLowerCase();
    const isFree = plan.name?.toLowerCase().includes('free');
    const isPopular = isPlanPopular(plan.name, index);

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
    } else if (isPopular) {
      buttonStyle = "bg-blue-600 hover:bg-blue-700 text-white";
    }

    return (
      <button
        onClick={() => {
          if (!disabled && !isFree) {
            handleBuyNowClick(plan._id, plan);
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
            const IconComponent = getIconForPlan(plan.name, index);
            const isPopular = isPlanPopular(plan.name, index);
            const features = getPlanFeatures(plan.name);
            const price = getPrice(plan);
            const period = getPeriod(plan, index);
            const displayName = getDisplayName(plan, index);
            
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

                <h3 className="text-xl font-semibold text-center mb-2">{displayName}</h3>

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

                {renderButton(plan, index)}
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

      {/* Phone Number Modal with Coupon Component */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 min-h-screen flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-auto shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Complete Your Purchase</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Phone Input Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <PhoneInput
                placeholder="Enter phone number"
                value={phone}
                onChange={setPhone}
                defaultCountry={isIndianUser ? "IN" : "US"}
                className="phone-input-custom"
                style={{
                  '--PhoneInputCountryFlag-height': '1em',
                  '--PhoneInput-color--focus': '#3b82f6'
                }}
              />
              <p className="text-sm text-gray-500 mt-2">
                Phone number is required for subscription activation
              </p>
            </div>

            {/* Coupon Section */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center mb-3">
                <Tag className="w-5 h-5 text-blue-500 mr-2" />
                <h4 className="text-lg font-semibold text-gray-800">Apply Coupon</h4>
              </div>
              
              {!appliedCoupon ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={couponLoading}
                    />
                    <button
                      onClick={validateCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                    >
                      {couponLoading ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        'Apply'
                      )}
                    </button>
                  </div>
                  
                  {couponError && (
                    <p className="text-red-500 text-sm flex items-center">
                      <X className="w-4 h-4 mr-1" />
                      {couponError}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Percent className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-green-800 font-medium text-sm">{appliedCoupon.code}</span>
                      </div>
                      <p className="text-sm text-green-600 mt-1">{appliedCoupon.description}</p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-500 hover:text-red-700 text-sm font-medium ml-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Price Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Original Price:</span>
                  <span className="font-medium">{getCurrencySymbol()}{originalPrice}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount:</span>
                    <span className="font-medium">-{getCurrencySymbol()}{(originalPrice - finalPrice).toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-3">
                  <span className="text-gray-800">Final Price:</span>
                  <span className="text-blue-600">{getCurrencySymbol()}{finalPrice}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
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
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin mr-2" size={16} />
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

      <style jsx>{`
        .phone-input-custom {
          width: 100%;
        }
        .phone-input-custom .PhoneInputInput {
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 0.75rem;
          font-size: 1rem;
          width: 100%;
          outline: none;
          transition: border-color 0.2s;
        }
        .phone-input-custom .PhoneInputInput:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .phone-input-custom .PhoneInputCountrySelect {
          border: 1px solid #d1d5db;
          border-radius: 0.5rem 0 0 0.5rem;
          padding: 0.75rem 0.5rem;
          background: white;
        }
      `}</style>
    </div>
  );
};

export default Plan;