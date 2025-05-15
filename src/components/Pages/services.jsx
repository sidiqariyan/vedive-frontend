import React from "react";
import "./mainstyles.css";
import Navbar from "./Hero/Navbar";
import Footer from "./Hero/Footer";
import bgImage1 from "./sixth.png";
import bgImage2 from "./assets/services-image-2.png";
import bgImage3 from "./assets/services-image-3.png";
import bgImage4 from "./third.png";
import bgImage5 from "./fourth.png";
import service1 from "./assets/service-1.png";
import service2 from "./assets/service-2.png";
import service3 from "./assets/service-3.png";
import service4 from "./assets/service-4.png";
import service5 from "./assets/service-5.png";
import { Helmet } from 'react-helmet';

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
const ServiceSection = ({ number, title, description, backgroundImage, link }) => (
  <a 
    href={link} 
    target={link !== "#" ? "_blank" : undefined} 
    rel={link !== "#" ? "noopener noreferrer" : undefined}
    className="service-link"
  >
    <h2
      className="section" 
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        cursor: link !== "#" ? 'pointer' : 'default'
      }}
    >
      <div className="section-content">
        <div className="section-number">{number}</div>
        <div className="content">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
    </h2>
  </a>
);

// Main Services Page Component
const Services = () => {
  return (
    <div className="main-body">
      <Helmet>
        <title>Vedive Services: Best Bulk Email & WhatsApp Sender Tools</title>
        <meta name="description" content="Explore Vedive’s marketing automation tools: bulk email sender, email scraper, and WhatsApp bulk sender. Streamline outreach and boost leads today!"/>
      </Helmet>

      <TopSection />

      <h2 className="text-primary text-[38px] sm:text-[48px] md:text-[65px] text-center font-semibold">
        Our Services
      </h2>

      <div className="parent-container">
        <div className="desktop-view" style={{ paddingBottom: '6%' }}>
          <ServiceSection
            number="01"
            title="Bulk Email Sender"
            description="Vedive’s bulk email sender helps you send high-volume, AI-optimized emails with top inbox delivery and real-time tracking."
            backgroundImage={service1}
            link="https://vedive.com/email-sender"
          />
          <ServiceSection
            number="02"
            title="WhatsApp Bulk Sender"
            description="Engage your audience instantly with personalized, rich-media messages on WhatsApp — perfect for promotions, alerts, and updates."
            backgroundImage={service2}
            link="https://vedive.com/whatsapp-sender"
          />
          <ServiceSection
            number="03"
            title="Email Scraper"
            description="Extract verified, niche-specific email leads from targeted sources to fuel your outreach and marketing pipelines."
            backgroundImage={service3}
            link="https://vedive.com/email-scraper"
          />
          {/* <ServiceSection
            number="04"
            title="Mobile Number Scraper ( Coming Soon ... )"
            description="Effortlessly gather clean, accurate mobile numbers to power SMS marketing, WhatsApp campaigns, or tele-sales strategies."
            backgroundImage={service4}
            link="#" // Coming soon
          /> */}
          <ServiceSection
            number="05"
            title="Real-Time Tracking Dashboard"
            description="Track opens, clicks, engagement, and delivery metrics across all your campaigns — all in one smart, centralized dashboard."
            backgroundImage={service5}
            link="https://vedive.com/dashboard"
          />
        </div>
      </div>

      <div className="desktop-view">
        <div className="about-us-container about-us-container-1" style={{ background: "transparent" }}>
          <h2 className="text-[64px] font-semibold">Why Choose Vedive</h2>
          <p>
Vedive.com offers a complete communication and lead generation platform
that goes far beyond what other tools provide. While most platforms focus on
either email or WhatsApp separately, Vedive combines a powerful Bulk Email
Sender, WhatsApp Bulk Sender, and smart Email Scraper in one easy-to-use
system. Our AI-driven technology ensures your messages land in the inbox,
not the spam folder, while helping you extract verified leads in real time.
Unlike other tools, we also offer free services like test credits and basic
scraping access to help you get started without upfront costs. With faster
delivery, better scalability, and built-in automation, Vedive is the smarter, more
efficient solution for modern business outreach.
          </p>
        </div>
        <div className="about-us-container"><img src={bgImage1} alt="" /></div>
      </div>

      {/* Separate "What We Want" Section */}
      <div className="what-we-want-container">
        <div className="parent-container">
          <div className="main-heading-text">
            <h2 className="text-[64px] font-semibold">Why Choose Us</h2>
          </div>
        </div>

        {/* Grid Layout for "What We Want" */}
        <div className="grid-container" style={{ marginBottom: "4%" }}>
          <div className="grid-item" style={{ backgroundColor: "#1E90FF", color: "white" }}>
            <h2 className="text-[48px] font-medium">Use Cases</h2>
            <p>
Vedive helps businesses across industries streamline communication and
boost results. Marketers can launch high-volume bulk email and WhatsApp
campaigns with AI-powered deliverability that ensures inbox placement.
Sales teams benefit from our email scraper and mobile number extractor to
generate qualified leads faster. E-commerce brands send instant customer
updates, while service providers use bulk messaging for promotions and
reminders. Agencies can manage multiple client campaigns from a single,
secure dashboard. From lead generation to performance tracking, Vedive
simplifies outreach with smarter, faster, and more targeted communication
tools.            </p>
          </div>

          <div className="grid-item" style={{ padding: 0 }}>
            <img src={bgImage4} alt="" />
          </div>

          <div className="grid-item" style={{ padding: 0 }}>
            <img src={bgImage5} alt="" />
          </div>

          <div className="grid-item" style={{ backgroundColor: "#1E90FF", color: "white" }}>
            <h3 className="text-[48px] font-medium">Who It’s For</h3>
            <p>
            Vedive is perfect for any business that needs to engage customers, nurture leads, or run high-volume outreach. Digital marketers love our advanced targeting, analytics, and deliverability tools. SaaS companies use Vedive to onboard users and send transactional emails at scale. Agencies appreciate our white-label-friendly design and real-time campaign tracking, allowing them to serve multiple clients with confidence. E-commerce brands use our WhatsApp bulk sender for fast product drops and customer support, while B2B companies rely on our scrapers to build lead pipelines without the manual grind. Startups benefit from the affordability and ease of use, while enterprises trust us for our security, uptime, and scalability. Whether you’re a solo founder, part of a growing team, or managing an enterprise operation, Vedive fits into your workflow — helping you reach more people, in less time, with better results.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Services;
