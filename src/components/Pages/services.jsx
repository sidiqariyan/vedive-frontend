import React from "react";
import "./mainstyles.css";
import Navbar from "./Hero/Navbar";
import Footer from "./Hero/Footer";

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
        {/* Our Story Section */}
        <div
          style={{ background: "transparent", color: "#ffffff" }}
          className="about-us-container about-us-container-1"
        >
          <h1>Our Story</h1>
          <p>
            Our mission is to provide convenience and quality service to every
            marketing professional, so they can make their marketing efforts
            easier and better. We are always committed to giving our customers
            the best experience, and every day, we aim to exceed their
            expectations in new ways. This will help make marketing even easier
            in the future.
          </p>
        </div>

        {/* Additional Story Content */}
        <div className="about-us-container">2</div>
        <div className="about-us-container">3</div>
        <div className="about-us-container">4</div>
      </div>
      {/* Separate "What We Want" Section */}
      <div className="what-we-want-container">
        <div className="main-heading-text">
          <h1>Benefits Of Working With Us</h1>
        </div>

        {/* Grid Layout for "What We Want" */}
        <div className="grid-container" style={{ marginBottom: "5vw" }}>
          <div className="grid-item"  style={{ backgroundColor: "#1E90FF", color: "white" }}>
            <h2>Our Value:</h2>
            <p>
              Our mission is to provide convenience and quality service to every
              marketing professional, so they can make their marketing efforts
              easier and better. We are always committed to giving our customers
              the best experience, and every day, we aim to exceed their
              expectations in new ways. This will help make marketing even
              easier in the future...
            </p>
          </div>

          <div className="grid-item">
            <h2>Our Vision:</h2>
            <p>
              Our mission is to provide convenience and quality service to every
              marketing professional, so they can make their marketing efforts
              easier and better. We are always committed to giving our customers
              the best experience, and every day, we aim to exceed their
              expectations in new ways. This will help make marketing even
              easier in the future. Our mission is to provide convenience and
              quality service to every marketing professional, so they can make
              their marketing efforts easier and better. We are always committed
              to giving our customers the best experience, and every day, we aim
              to exceed their expectations in new ways. This will help make
              marketing even easier in the future. so they can make their
              marketing efforts easier and better. We are always committed to
              giving our customers the best experience, and every day, we aim to
              exceed their expectations in new ways. This will help make
              marketing even easier in the future.
            </p>
          </div>

          <div className="grid-item">
            <h2>Our Commitment:</h2>
            <p>
              Our mission is to provide convenience and quality service to every
              marketing professional, so they can make their marketing efforts
              easier and better. We are always committed to giving our customers
              the best experience, and every day, we aim to exceed their
              expectations in new ways. This will help make marketing even
              easier in the future. Our mission is to provide convenience and
              quality service to every marketing professional, so they can make
              their marketing efforts easier and better. We are always committed
              to giving our customers the best experience, and every day, we aim
              to exceed their expectations in new ways. This will help make
              marketing even easier in the future. so they can make their
              marketing efforts easier and better. We are always committed to
              giving our customers the best experience, and every day, we aim to
              exceed their expectations in new ways. This will help make
              marketing even easier in the future.
            </p>
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
              expectations in new ways. This will help make marketing even
              easier in the future. Our mission is to provide convenience and
              quality service to every marketing professional, so they can make
              their marketing efforts easier and better. We are always committed
              to giving our customers the best experience, and every day, we aim
              to exceed their expectations in new ways. This will help make
              marketing even easier in the future. so they can make their
              marketing efforts easier and better. We are always committed to
              giving our customers the best experience, and every day, we aim to
              exceed their expectations in new ways. This will help make
              marketing even easier in the future.
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
