import { memo } from "react";
import { Helmet } from 'react-helmet';
import "./mainstyles.css";
import Navbar from "./Hero/Navbar";
import Footer from "./Hero/Footer";
import CoreValues from "./Hero/Values";

// Lazy load images for better performance
import bgImage1 from "./about.png";
import bgImage4 from "./assets/about-us-image-4.png";
import bgImage5 from "./secondAbout.png";

// Constants for better maintainability
const COMPANY_INFO = {
  name: "Vedive",
  foundingYear: "2025",
  description: "Leaders in Marketing Automation Tools"
};

const CONTENT = {
  story: {
    title: "Vedive Story",
    text: "Vedive was founded with a clear vision — to transform the way businesses communicate through whatsapp messages and email. After facing constant challenges with low deliverability, security concerns, and messages landing in spam folders, we knew there had to be a better way. That's when we built Vedive — an AI-powered platform designed to ensure emails are fast, secure, and always delivered. What started as a frustration turned into our mission: to empower businesses with seamless, reliable, and intelligent email infrastructure that scales effortlessly."
  },
  whatWeDo: {
    title: "What We Do",
    text: "At Vedive, we help businesses scale outreach with powerful tools like WhatsApp Bulk Sender, Bulk Email Sender, and a smart Email Scraper. From automated messaging to verified lead generation, our platform ensures fast, reliable, and spam-free communication. Whether you're launching a bulk email campaign, sending thousands of WhatsApp messages, or extracting leads with our email scraping tool, Vedive makes the process seamless. With features like real-time delivery, contact organization, and automation-ready workflows, we help you connect, engage, and convert — faster."
  },
  solution: {
    title: "Our Solution",
    text: "Vedive delivers a unified communication platform built for modern outreach. Our AI-powered Bulk Email Sender ensures top-tier deliverability, keeping your messages out of spam and straight into inboxes. The WhatsApp Bulk Sender lets you engage large audiences instantly, offering high-response, real-time messaging. For lead generation, our Email Scraper and mobile number extractor tools help you collect verified contacts from targeted sources — fueling smarter campaigns. Everything runs on secure, encrypted infrastructure for full data protection and peace of mind. Forget managing multiple tools — Vedive combines bulk messaging, automated outreach, and lead extraction in one scalable platform. Save time, boost engagement, and maximize ROI with smarter communication powered by Vedive."
  }
};

const GRID_STYLES = {
  blueBackground: { 
    backgroundColor: "#1E90FF", 
    color: "white" 
  },
  noPadding: { 
    padding: '0' 
  }
};

// Separate component for better organization
const SEOHead = memo(() => (
  <Helmet>
    <title>About {COMPANY_INFO.name}: {COMPANY_INFO.description}</title>
    <meta 
      name="description" 
      content={`Discover ${COMPANY_INFO.name}, your trusted partner for bulk email sender, email scraper, and WhatsApp marketing tools. Empowering businesses with automation since ${COMPANY_INFO.foundingYear}`}
    />
  </Helmet>
));

SEOHead.displayName = 'SEOHead';

// Separate component for hero section
const HeroSection = memo(() => (
  <div className="top-section">
    <h1>About Us</h1>
    <h2>
      Maximize Your Reach with <span>Free</span> Messaging Services.
    </h2>
  </div>
));

HeroSection.displayName = 'HeroSection';

// Separate component for story section
const StorySection = memo(() => (
  <div className="desktop-view">
    <div
      style={{ background: "transparent", color: "#ffffff" }}
      className="about-us-container about-us-container-1"
    >
      <h2 className="text-primary text-[38px] sm:text-[48px] md:text-[65px] text-center md:text-left font-semibold">{CONTENT.story.title}</h2>
      <p>{CONTENT.story.text}</p>
    </div>
    <div className="about-us-container">
      <img 
        src={bgImage1} 
        alt="Vedive company story illustration" 
        loading="lazy"
      />
    </div>
  </div>
));

StorySection.displayName = 'StorySection';

// Separate component for grid section
const GridSection = memo(() => (
  <>
    <div className="main-heading-text">
      <h2 className="text-primary text-[38px] sm:text-[48px] md:text-[65px] text-center font-semibold">What We Want</h2>
    </div>

    <div className="grid-container">
      <div className="grid-item item1" style={GRID_STYLES.blueBackground}>
        <h3 className="text-[48px] font-medium">{CONTENT.whatWeDo.title}</h3>
        <p>{CONTENT.whatWeDo.text}</p>
      </div>

      <div className="grid-item item2" style={GRID_STYLES.noPadding}>
        <img 
          src={bgImage4} 
          alt="Vedive platform features showcase" 
          loading="lazy"
        />
      </div>

      <div className="grid-item item3" style={GRID_STYLES.noPadding}>
        <img 
          src={bgImage5} 
          alt="Vedive automation tools demonstration" 
          loading="lazy"
        />
      </div>

      <div className="grid-item item4" style={GRID_STYLES.blueBackground}>
        <h3 className="text-[48px] font-medium">{CONTENT.solution.title}</h3>
        <p>{CONTENT.solution.text}</p>
      </div>
    </div>
  </>
));

GridSection.displayName = 'GridSection';

// Main component
const AboutUs = memo(() => {
  return (
    <div className="main-body">
      <SEOHead />
      <Navbar />
      <HeroSection />
      <StorySection />
      <GridSection />
      <CoreValues />
      <Footer />
    </div>
  );
});

AboutUs.displayName = 'AboutUs';

export default AboutUs;