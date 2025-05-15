import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./mainstyles.css"; 
import Navbar from "./Hero/Navbar";
import Footer from "./Hero/Footer";
import CoreValues from "./Hero/Values";
import bgImage1 from "./assets/pricing-image-1.jpg";
import { Helmet } from 'react-helmet';

// Add this CSS to your mainstyles.css file
const cssToAdd = `
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

const PricingCard = ({ title, price, currency, duration, features, highlight, recommended }) => {
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
            style={highlight ? { backgroundColor: "#1E90FF" } : {}}
          >
            Start for free now
          </NavLink>
        </div>
        <ul className="features">
          {features.map((feature, index) => (
            <li key={index} className={feature.available ? "tick" : "cross"}>
              <span className="feature-text">{feature.name}</span>
            </li>
          ))}
        </ul>
      </div>
      {recommended && <div className="recommended-badge">Recommended</div>}
    </div>
  );
};

const Pricing = () => {
  const [isIndia, setIsIndia] = useState(true);
  
  useEffect(() => {
    // Detect if user is in India
    const detectLocation = async () => {
      try {
        // Using a free geolocation API
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setIsIndia(data.country_code === 'IN');
      } catch (error) {
        console.error('Error detecting location:', error);
        // Default to Indian pricing if there's an error
        setIsIndia(true);
      }
    };
    
    detectLocation();
  }, []);

  // Define pricing plans based on location
  const pricingPlans = [
    {
      title: "Free",
      price: 0,
      currency: isIndia ? "₹" : "$",
      duration: "1-day",
      features: [
        { name: "Unlimited Mail Sending", available: true },
        { name: "Scrap Unlimited Mails", available: false },
        { name: "Unlimited WhatsApp Message Sending", available: true },
        { name: "Unlimited Mail & WhatsApp Template", available: false },
      ],
    },
    {
      title: "Starter",
      price: isIndia ? 99 : 4.99,
      currency: isIndia ? "₹" : "$",
      duration: "1-day",
      features: [
        { name: "Unlimited Mail Sending", available: true },
        { name: "Scrap Unlimited Mails", available: true },
        { name: "Unlimited WhatsApp Message Sending", available: true },
        { name: "Unlimited Mail & WhatsApp Template", available: true },
      ],
    },
    {
      title: "Business",
      price: isIndia ? 599 : 29.99,
      currency: isIndia ? "₹" : "$",
      duration: "1-week",
      highlight: true,
      recommended: true,
      features: [
        { name: "Unlimited Mail Sending", available: true },
        { name: "Scrap Unlimited Mails", available: true },
        { name: "Unlimited WhatsApp Message Sending", available: true },
        { name: "Unlimited Mail & WhatsApp Template", available: true },
      ],
    },
    {
      title: "Enterprise",
      price: isIndia ? 1999 : 99,
      currency: isIndia ? "₹" : "$",
      duration: "1-month",
      features: [
        { name: "Unlimited Mail Sending", available: true },
        { name: "Scrap Unlimited Mails", available: true },
        { name: "Unlimited WhatsApp Message Sending", available: true },
        { name: "Unlimited Mail & WhatsApp Template", available: true },
      ],
    },
  ];

  return (
    <div>
      {/* This adds the CSS to the page - you can alternatively copy this to your CSS file */}
      <style>{cssToAdd}</style>
      <Helmet>
        <title>Vedive Pricing: Affordable Email & WhatsApp Tools {isIndia ? 'India' : 'Global'}</title>
        <meta name="description" content="Discover Vedive's affordable pricing for bulk email sender, email scraper, and WhatsApp bulk sender tools. Start with flexible plans or a free trial!"/>
      </Helmet>
      {/* Top Section */}
      <Navbar />

      {/* Main Body Section */}
      <div className="main-body">
        <div className="top-section">
          <h1>Pricing</h1>
          <h2>
            Free, Reliable <span>Messaging</span> and <span>Scraping</span>{" "}
            Services.
          </h2>
        </div>
        
        {/* Pricing Cards Section */}
        <div className="pricing-container">
          <h2 className="pricing-grid text-[64px] font-semibold">
            {pricingPlans.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </h2>
        </div>

        {/* About Us Sections */}
        <div className="desktop-view">
          <div
            style={{ background: "transparent" }}
            className="about-us-container about-us-container-1"
          >
            <h2 className="text-[64px] font-semibold">What's Included & Benefits</h2>
            <p>
            Every Vedive plan comes packed with powerful features designed to help you scale faster and communicate smarter. Enjoy AI-powered email deliverability, bulk WhatsApp messaging, and real-time tracking — all from one intuitive dashboard. Whether you're on a starter or premium plan, you'll benefit from enterprise-grade security, responsive customer support, and access to our email and mobile scraping tools. No hidden fees, no confusing limits — just reliable, high-performance tools built for growth. From marketers to large-scale teams, Vedive gives you everything you need to run successful campaigns and drive real results.
            </p>
          </div>
        <div className="about-us-container"><img src={bgImage1} alt="" /></div>
        </div>

        <CoreValues />
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;