import React, { memo, useState, useEffect, useCallback, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { Helmet } from 'react-helmet';
import "./mainstyles.css"; 
import Navbar from "./Hero/Navbar";
import Footer from "./Hero/Footer";
import CoreValues from "./Hero/Values";
import bgImage1 from "./assets/pricing-image-1.jpg";

// Constants for better maintainability
const COMPANY_INFO = {
  name: "Vedive"
};

const GEOLOCATION_API = 'https://ipapi.co/json/';

const CONTENT = {
  hero: {
    title: "Pricing",
    subtitle: "Free, Reliable Messaging and Scraping Services."
  },
  benefits: {
    title: "What's Included & Benefits",
    description: "Every Vedive plan comes packed with powerful features designed to help you scale faster and communicate smarter. Enjoy AI-powered email deliverability, bulk WhatsApp messaging, and real-time tracking — all from one intuitive dashboard. Whether you're on a starter or premium plan, you'll benefit from enterprise-grade security, responsive customer support, and access to our email and mobile scraping tools. No hidden fees, no confusing limits — just reliable, high-performance tools built for growth. From marketers to large-scale teams, Vedive gives you everything you need to run successful campaigns and drive real results."
  }
};

// Features configuration
const FEATURES_CONFIG = [
  { name: "Unlimited Mail Sending", id: "mail_sending" },
  { name: "Scrap Unlimited Mails", id: "mail_scraping" },
  { name: "Unlimited WhatsApp Message Sending", id: "whatsapp_sending" },
  { name: "Unlimited Mail & WhatsApp Template", id: "templates" }
];

// Plans configuration factory
const createPricingPlans = (isIndia) => [
  {
    id: "free",
    title: "Free",
    price: 0,
    currency: isIndia ? "₹" : "$",
    duration: "1-day",
    features: {
      mail_sending: true,
      mail_scraping: false,
      whatsapp_sending: true,
      templates: false
    }
  },
  {
    id: "starter", 
    title: "Starter",
    price: isIndia ? 99 : 4.99,
    currency: isIndia ? "₹" : "$",
    duration: "1-day",
    features: {
      mail_sending: true,
      mail_scraping: true,
      whatsapp_sending: true,
      templates: true
    }
  },
  {
    id: "business",
    title: "Business", 
    price: isIndia ? 599 : 29.99,
    currency: isIndia ? "₹" : "$",
    duration: "1-week",
    highlight: true,
    recommended: true,
    features: {
      mail_sending: true,
      mail_scraping: true,
      whatsapp_sending: true,
      templates: true
    }
  },
  {
    id: "enterprise",
    title: "Enterprise",
    price: isIndia ? 1999 : 99,
    currency: isIndia ? "₹" : "$", 
    duration: "1-month",
    features: {
      mail_sending: true,
      mail_scraping: true,
      whatsapp_sending: true,
      templates: true
    }
  }
];

// CSS styles as a constant
const PRICING_STYLES = `
.card-wrapper {
  position: relative;
  margin-top: 15px;
}

.recommended-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #1E90FF;
  color: white;
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: transform 0.3s ease;
}

.pricing-card:hover + .recommended-badge,
.card-wrapper:hover .recommended-badge {
  transform: translateX(-50%) translateY(-5px);
}
`;

// Custom hook for location detection
const useLocationDetection = () => {
  const [isIndia, setIsIndia] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const detectLocation = useCallback(async () => {
    try {
      const response = await fetch(GEOLOCATION_API);
      const data = await response.json();
      setIsIndia(data.country_code === 'IN');
    } catch (error) {
      console.error('Error detecting location:', error);
      // Default to Indian pricing if there's an error
      setIsIndia(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  return { isIndia, isLoading };
};

// SEO Head component
const SEOHead = memo(({ isIndia }) => (
  <Helmet>
    <title>{COMPANY_INFO.name} Pricing: Affordable Email & WhatsApp Tools {isIndia ? 'India' : 'Global'}</title>
    <meta 
      name="description" 
      content={`Discover ${COMPANY_INFO.name}'s affordable pricing for bulk email sender, email scraper, and WhatsApp bulk sender tools. Start with flexible plans or a free trial!`}
    />
  </Helmet>
));

SEOHead.displayName = 'SEOHead';

// Hero Section component
const HeroSection = memo(() => (
  <div className="top-section">
    <h1>{CONTENT.hero.title}</h1>
    <h2>
      Free, Reliable <span>Messaging</span> and <span>Scraping</span> Services.
    </h2>
  </div>
));

HeroSection.displayName = 'HeroSection';

// Pricing Card component
const PricingCard = memo(({ plan }) => {
  const { title, price, currency, duration, highlight, recommended, features } = plan;
  
  const buttonStyle = useMemo(() => 
    highlight ? { backgroundColor: "#1E90FF" } : {}, 
    [highlight]
  );

  return (
    <div className="card-wrapper">
      <div className="pricing-card">
        <div className="card-header">
          <h3>{title}</h3>
          <div className="price">
            <span>{currency}</span>{price}
            <span className="span1">/{duration}</span>
          </div>
          <p className="para1">Simple & Powerful</p>
          <NavLink
            to="/plans"
            className="btn"
            style={buttonStyle}
          >
            Start for free now
          </NavLink>
        </div>
        <ul className="features">
          {FEATURES_CONFIG.map((feature) => (
            <li 
              key={feature.id} 
              className={features[feature.id] ? "tick" : "cross"}
            >
              <span className="feature-text">{feature.name}</span>
            </li>
          ))}
        </ul>
      </div>
      {recommended && <div className="recommended-badge">Recommended</div>}
    </div>
  );
});

PricingCard.displayName = 'PricingCard';

// Pricing Grid component
const PricingGrid = memo(({ plans }) => (
  <div className="pricing-container">
    <h2 className="pricing-grid text-[64px] font-semibold">
      {plans.map((plan) => (
        <PricingCard key={plan.id} plan={plan} />
      ))}
    </h2>
  </div>
));

PricingGrid.displayName = 'PricingGrid';

// Benefits Section component
const BenefitsSection = memo(() => (
  <div className="desktop-view">
    <div
      style={{ background: "transparent" }}
      className="about-us-container about-us-container-1"
    >
      <h2 className="text-primary text-[38px] sm:text-[48px] md:text-[65px] text-center md:text-left font-semibold">
        {CONTENT.benefits.title}</h2>
      <p>{CONTENT.benefits.description}</p>
    </div>
    <div className="about-us-container">
      <img 
        src={bgImage1} 
        alt="Vedive pricing benefits and features illustration" 
        loading="lazy"
      />
    </div>
  </div>
));

BenefitsSection.displayName = 'BenefitsSection';

// Loading component
const LoadingSpinner = memo(() => (
  <div className="loading-container" style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '200px' 
  }}>
    <div>Loading pricing...</div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

// Main Pricing component
const Pricing = memo(() => {
  const { isIndia, isLoading } = useLocationDetection();
  
  const pricingPlans = useMemo(() => 
    createPricingPlans(isIndia), 
    [isIndia]
  );

  if (isLoading) {
    return (
      <div>
        <SEOHead isIndia={isIndia} />
        <Navbar />
        <div className="main-body">
          <HeroSection />
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <style>{PRICING_STYLES}</style>
      <SEOHead isIndia={isIndia} />
      <Navbar />
      
      <div className="main-body">
        <HeroSection />
        <PricingGrid plans={pricingPlans} />
        <BenefitsSection />
        <CoreValues />
      </div>

      <Footer />
    </div>
  );
});

Pricing.displayName = 'Pricing';

export default Pricing;