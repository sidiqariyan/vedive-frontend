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
    <div 
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
    </div>
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
            title="Mail Sender"
            description="Send high-volume, AI-optimized email campaigns with unmatched deliverability and inbox placement — all with real-time analytics."
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
          <h1>Why Choose Vedive</h1>
          <p>
            Vedive offers a seamless blend of speed, reliability, and intelligence — designed to help businesses communicate better. Our AI-driven email and messaging solutions ensure your content reaches inboxes, not spam folders. With enterprise-grade security, you can trust your data is always protected. Whether you’re sending bulk emails, WhatsApp messages, or generating leads, Vedive delivers with precision. Real-time tracking, high deliverability, and user-friendly tools make us the go-to choice for modern marketers and growth teams. Choose Vedive for communication that’s faster, safer, and smarter — all from one powerful platform.
          </p>
        </div>
        <div className="about-us-container"><img src={bgImage1} alt="" /></div>
      </div>

      {/* Separate "What We Want" Section */}
      <div className="what-we-want-container">
        <div className="parent-container">
          <div className="main-heading-text">
            <h1>Why Choose Us</h1>
          </div>
        </div>

        {/* Grid Layout for "What We Want" */}
        <div className="grid-container" style={{ marginBottom: "4%" }}>
          <div className="grid-item" style={{ backgroundColor: "#1E90FF", color: "white" }}>
            <h2>Use Cases</h2>
            <p>
            Vedive is built to solve real-world communication challenges across multiple industries. Whether you're running email marketing campaigns, handling customer support, or scaling outreach, our tools make it seamless and effective. Marketers can launch high-volume email and WhatsApp campaigns that actually land in inboxes — not spam folders — thanks to our AI-driven deliverability engine. Sales teams can generate fresh, qualified leads through our email and mobile number scraping tools, enabling faster outreach and higher conversion rates. E-commerce businesses benefit from instant customer updates via WhatsApp, while service providers can use bulk messaging to send promotions, appointment reminders, or alerts. Even agencies managing multiple clients can centralize campaigns and monitor analytics from one secure dashboard. With Vedive, time-consuming processes like scraping leads, managing lists, and tracking performance are streamlined into one powerful platform. It’s not just about sending messages — it’s about sending smarter, faster, and more targeted communication at scale.
            </p>
          </div>

          <div className="grid-item" style={{ padding: 0 }}>
            <img src={bgImage4} alt="" />
          </div>

          <div className="grid-item" style={{ padding: 0 }}>
            <img src={bgImage5} alt="" />
          </div>

          <div className="grid-item" style={{ backgroundColor: "#1E90FF", color: "white" }}>
            <h2>Who It’s For</h2>
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
