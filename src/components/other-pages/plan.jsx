import React from 'react';
import { NavLink } from "react-router-dom";
import { Check, Sparkles, Rocket, Building2, Building as Buildings, X } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '0',
    period: '/1-day',
    icon: Sparkles,
    features: [
      { name: 'Unlimited Mail Sending', restricted: false },
      { name: 'Scrap Unlimited Mails', restricted: true },
      { name: 'Unlimited WhatsApp Message Sending', restricted: false },
      { name: 'Scrap Unlimited Numbers', restricted: true },
      { name: 'Unlimited Mail & WhatsApp Template', restricted: true }
    ],
    buttonText: 'Start for free now',
    popular: false,
    buttonStyle: 'border border-gray-300 hover:border-gray-400'
  },
  {
    name: 'Starter',
    price: '49',
    period: '/1-day',
    icon: Rocket,
    features: [
      { name: 'Unlimited Mail Sending', restricted: false },
      { name: 'Scrap Unlimited Mails', restricted: false },
      { name: 'Unlimited WhatsApp Message Sending', restricted: false },
      { name: 'Scrap Unlimited Numbers', restricted: false },
      { name: 'Unlimited Mail & WhatsApp Template', restricted: false }
    ],
    buttonText: 'Buy Now',
    popular: false,
    buttonStyle: 'border border-gray-300 hover:border-gray-400'
  },
  {
    name: 'Business',
    price: '199',
    period: '/1-week',
    icon: Building2,
    features: [
      { name: 'Unlimited Mail Sending', restricted: false },
      { name: 'Scrap Unlimited Mails', restricted: false },
      { name: 'Unlimited WhatsApp Message Sending', restricted: false },
      { name: 'Scrap Unlimited Numbers', restricted: false },
      { name: 'Unlimited Mail & WhatsApp Template', restricted: false }
    ],
    buttonText: 'Buy Now',
    popular: true,
    buttonStyle: 'bg-blue-600 hover:bg-blue-700 text-white'
  },
  {
    name: 'Enterprise',
    price: '699',
    period: '/1-month',
    icon: Buildings,
    features: [
      { name: 'Unlimited Mail Sending', restricted: false },
      { name: 'Scrap Unlimited Mails', restricted: false },
      { name: 'Unlimited WhatsApp Message Sending', restricted: false },
      { name: 'Scrap Unlimited Numbers', restricted: false },
      { name: 'Unlimited Mail & WhatsApp Template', restricted: false }
    ],
    buttonText: 'Buy Now',
    popular: false,
    buttonStyle: 'border border-gray-300 hover:border-gray-400'
  }
];

const Plan = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-4 sm:px-6 lg:px-4 relative overflow-auto">
      <div className="w-full mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-third">
            Choose Your Perfect Plan
          </h1>
          <p className="text-gray-600 text-lg">
            Select the plan that best fits your needs and start growing your business today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-8 md:gap-8 lg:gap-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl bg-white p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 ${
                plan.popular ? 'transform hover:-translate-y-2' : 'hover:-translate-y-1'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 inset-x-0 flex justify-center">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-center justify-center mb-6">
                <plan.icon className="w-12 h-12 text-blue-500" />
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
                      <Check className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${feature.restricted ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${plan.buttonStyle}`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center max-w-2xl mx-auto p-8 rounded-2xl bg-gray-50 border border-gray-200 shadow-md">
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
