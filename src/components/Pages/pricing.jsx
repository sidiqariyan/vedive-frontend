import React from "react";
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

const PricingCard = ({ title, price, duration, features, highlight, recommended }) => {
  return (
    <div className="card-wrapper">
      <div className="pricing-card">
        <div className="card-header">
          <h3>{title}</h3>
          <div className="price">
            <span>₹</span>{price}
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
  const pricingPlans = [
    {
      title: "Free",
      price: 0,
      duration: "1-day",
      features: [
        { name: "Unlimited Mail Sending", available: true },
        { name: "Scrap Unlimited Mails", available: false },
        { name: "Unlimited WhatsApp Message Sending", available: true },
        // { name: "Scrap Unlimited Numbers", available: false },
        { name: "Unlimited Mail & WhatsApp Template", available: false },
      ],
    },
    {
      title: "Starter",
      price: 49,
      duration: "1-day",
      features: [
        { name: "Unlimited Mail Sending", available: true },
        { name: "Scrap Unlimited Mails", available: true },
        { name: "Unlimited WhatsApp Message Sending", available: true },
        // { name: "Scrap Unlimited Numbers", available: true },
        { name: "Unlimited Mail & WhatsApp Template", available: true },
      ],
    },
    {
      title: "Business",
      price: 199,
      duration: "1-week",
      highlight: true,
      recommended: true,
      features: [
        { name: "Unlimited Mail Sending", available: true },
        { name: "Scrap Unlimited Mails", available: true },
        { name: "Unlimited WhatsApp Message Sending", available: true },
        // { name: "Scrap Unlimited Numbers", available: true },
        { name: "Unlimited Mail & WhatsApp Template", available: true },
      ],
    },
    {
      title: "Enterprise",
      price: 699,
      duration: "1-month",
      features: [
        { name: "Unlimited Mail Sending", available: true },
        { name: "Scrap Unlimited Mails", available: true },
        { name: "Unlimited WhatsApp Message Sending", available: true },
        // { name: "Scrap Unlimited Numbers", available: true },
        { name: "Unlimited Mail & WhatsApp Template", available: true },
      ],
    },
  ];

  return (
    <div>
      {/* This adds the CSS to the page - you can alternatively copy this to your CSS file */}
      <style>{cssToAdd}</style>
      <Helmet>
      <title>Vedive Pricing: Affordable Email & WhatsApp Tools India</title>
      <meta name="description" content="Discover Vedive’s affordable pricing for bulk email sender, email scraper, and WhatsApp bulk sender tools. Start with flexible plans or a free trial!"/>
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
          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
        </div>

        {/* About Us Sections */}
        <div className="desktop-view">
          <div
            style={{ background: "transparent" }}
            className="about-us-container about-us-container-1"
          >
            <h1>What's Included & Benefits</h1>
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