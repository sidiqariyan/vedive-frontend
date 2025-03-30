import React from "react";
import "./mainstyles.css";
import Navbar from "./Hero/Navbar";
import Footer from "./Hero/Footer";
import bgImage1 from "./assets/services-image-1.png";
import bgImage2 from "./assets/services-image-2.png";
import bgImage3 from "./assets/services-image-3.png";
import bgImage4 from "./assets/services-image-4.png";
import bgImage5 from "./assets/services-image-5.png";

// Top Section Component
const TopSection = () => (
  <div>
    <Navbar />
    <div className="top-section">
      <h1>Services</h1>
      <h2>
        Maximize Your Reach with <span>Free</span> Messaging Services.
      </h2>
    </div>
  </div>
);

// Service Section Component
const ServiceSection = ({ number, title, description }) => (
  <div className="section">
    <div className="section-number">{number}</div>
    <div className="content">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  </div>
);

// Main Services Page Component
const Services = () => {
  return (
    <div className="main-body">
      {" "}
      {/* Wrap everything inside this div */}
      <TopSection />
      <div className="container">
        <div className="grids">
          <ServiceSection
            number="01"
            title="Mail Scraper"
            description="Reliable Messaging and Scraping Services - Free, Efficient, and Spam-Free Solutions for Your Business"
          />
          <ServiceSection
            number="02"
            title="Mail Scraper"
            description="Reliable Messaging and Scraping Services - Free, Efficient, and Spam-Free Solutions for Your Business"
          />
          <ServiceSection
            number="03"
            title="Mail Scraper"
            description="Reliable Messaging and Scraping Services - Free, Efficient, and Spam-Free Solutions for Your Business"
          />
          <ServiceSection
            number="04"
            title="Mail Scraper"
            description="Reliable Messaging and Scraping Services - Free, Efficient, and Spam-Free Solutions for Your Business"
          />
          <ServiceSection
            number="05"
            title="Mail Scraper"
            description="Reliable Messaging and Scraping Services - Free, Efficient, and Spam-Free Solutions for Your Business"
          />
        </div>
      </div>
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
      {/* Separate "What We Want" Section */}
      <div className="what-we-want-container">
        <div className="main-heading-text">
          <h1>Benefits Of Working With Us</h1>
        </div>

        {/* Grid Layout for "What We Want" */}
      <div className="grid-container">
        <div className="grid-item" style={{ backgroundColor: "#1E90FF", color: "white" }}>
          <h2>Our Value:</h2>
          <p>
            Our mission is to provide convenience and quality service to every
            marketing professional, so they can make their marketing efforts
            easier and better. We are always committed to giving our customers
            the best experience, and every day, we aim to exceed their
            expectations in new ways. This will help make marketing even easier
            in the future. Our mission is to provide convenience and quality
            service to every marketing professional, so they can make their
            marketing efforts easier and better. We are always committed to
            giving our customers the best experience, and every day, we aim to
            exceed their expectations in new ways. This will help make marketing
            even easier in the future. so they can make their marketing efforts
            easier and better. We are always committed to giving our customers
            the best experience, and every day, we aim to exceed their
            expectations in new ways. This will help make marketing even easier
            in the future.
          </p>
        </div>

        <div className="grid-item" style={{  padding: '0'}}>
        <img src={bgImage4} alt="" />
        </div>

        <div className="grid-item" style={{  padding: '0'}}>
        <img src={bgImage5} alt="" />
        </div>

        <div
          className="grid-item"
          style={{ backgroundColor: "#1E90FF", color: "white" }}
        >
          <h2>Our Promise:</h2>
          <p>
            Our mission is to provide convenience and quality service to every
            marketing professional, so they can make their marketing efforts
            easier and better. We are always committed to giving our customers
            the best experience, and every day, we aim to exceed their
            expectations in new ways. This will help make marketing even easier
            in the future. Our mission is to provide convenience and quality
            service to every marketing professional, so they can make their
            marketing efforts easier and better. We are always committed to
            giving our customers the best experience, and every day, we aim to
            exceed their expectations in new ways. This will help make marketing
            even easier in the future. so they can make their marketing efforts
            easier and better. We are always committed to giving our customers
            the best experience, and every day, we aim to exceed their
            expectations in new ways. This will help make marketing even easier
            in the future.
          </p>
        </div>
      </div>
      </div>
      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default Services;
