import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./mainstyles.css"; 
import Navbar from "./Hero/Navbar";
import Footer from "./Hero/Footer";
import CoreValues from "./Hero/Values";
import bgImage1 from "./assets/pricing-image-1.png";
import bgImage2 from "./assets/pricing-image-2.png";
import bgImage3 from "./assets/pricing-image-3.png";


const PricingCard = ({ title, price, duration, features, highlight }) => {
  return (
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
        { name: "Scrap Unlimited Numbers", available: false },
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
        { name: "Scrap Unlimited Numbers", available: true },
        { name: "Unlimited Mail & WhatsApp Template", available: true },
      ],
    },
    {
      title: "Business",
      price: 199,
      duration: "1-week",
      highlight: true,
      features: [
        { name: "Unlimited Mail Sending", available: true },
        { name: "Scrap Unlimited Mails", available: true },
        { name: "Unlimited WhatsApp Message Sending", available: true },
        { name: "Scrap Unlimited Numbers", available: true },
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
        { name: "Scrap Unlimited Numbers", available: true },
        { name: "Unlimited Mail & WhatsApp Template", available: true },
      ],
    },
  ];

  return (
    <div>
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
            <h1>Our Story</h1>
            <p>
            At Vedive, our goal is to simplify marketing by providing seamless messaging and data scraping services for professionals. Our platform is designed to help businesses reach their audience easily while maintaining efficiency and affordability.

            </p>
          </div>
        <div className="about-us-container"><img src={bgImage1} alt="" /></div>
        <div className="about-us-container"><img src={bgImage2} alt="" /></div>
        <div className="about-us-container"><img src={bgImage3} alt="" /></div>
        </div>

        <div className="mobile-tablet-view">
          <div
            style={{ background: "#04081D" }}
            className="about-us-container about-us-container-1"
          >
            <h1>Our Story</h1>
            <p>
              Our mission is to provide convenience and quality service to every
              marketing professional, so they can make their marketing efforts
              easier and better. We are always committed to giving our customers
              the best experience, and every day, we aim to exceed their
              expectations in new ways. This will help make marketing even
              easier in the future.
            </p>
          </div>
          <div className="scroll-row">
        <div className="about-us-container"><img src={bgImage1} alt="" /></div>
        <div className="about-us-container"><img src={bgImage2} alt="" /></div>
        <div className="about-us-container"><img src={bgImage3} alt="" /></div>
          </div>
        </div>

        <CoreValues />
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;
