import "./mainstyles.css";
import Navbar from "./Hero/Navbar";
import Footer from "./Hero/Footer";
import CoreValues from "./Hero/Values";
import bgImage1 from "./about.png";
import bgImage2 from "./assets/about-us-image-2.jpg";
import bgImage3 from "./assets/about-us-image-3.jpg";
import bgImage4 from "./assets/about-us-image-4.png";
import bgImage5 from "./secondAbout.png";
import { Helmet } from 'react-helmet';

const AboutUs = () => {
  return (
    <div className="main-body">
        <Helmet>
      <title>About Vedive: Leaders in Marketing Automation Tools</title>
      <meta name="description" content="Discover Vedive, your trusted partner for bulk email sender, email scraper, and WhatsApp marketing tools. Empowering businesses with automation since 2025"/>
      </Helmet>
      <Navbar />
      <div className="top-section">
        <h1>About Us</h1>
        <h2>
          Maximize Your Reach with <span>Free</span> Messaging Services.
        </h2>
      </div>

      {/* Desktop View */}
      <div className="desktop-view">
        <div
          style={{ background: "transparent", color: "#ffffff" }}
          className="about-us-container about-us-container-1"
        >
          <h2 className="text-[64px] font-semibold">Vedive Story</h2>
          <p>Vedive was founded with a clear vision — to transform the way businesses communicate through whatsapp messages and email. After facing constant challenges with low deliverability, security concerns, and messages landing in spam folders, we knew there had to be a better way. That’s when we built Vedive — an AI-powered platform designed to ensure emails are fast, secure, and always delivered. What started as a frustration turned into our mission: to empower businesses with seamless, reliable, and intelligent email infrastructure that scales effortlessly.
          </p>
        </div>
        <div className="about-us-container"><img src={bgImage1} alt="" /></div>
        {/* <div className="about-us-container"><img src={bgImage2} alt="" /></div>
        <div className="about-us-container"><img src={bgImage3} alt="" /></div> */}
      </div>

      {/* Mobile/Tablet View */}
      {/* Main Heading Text */}
      <div className="main-heading-text">
        <h2 className="text-[64px] font-semibold">What We Want</h2>
      </div>

      {/* Grid Container */}
      <div className="grid-container">
        <div className="grid-item item1" style={{ backgroundColor: "#1E90FF", color: "white" }}>
          <h3 className="text-[48px] font-medium">What We Do</h3>
          <p>
At Vedive, we help businesses scale outreach with powerful tools like
WhatsApp Bulk Sender, Bulk Email Sender, and a smart Email Scraper.
From automated messaging to verified lead generation, our platform
ensures fast, reliable, and spam-free communication.
Whether you're launching a bulk email campaign, sending thousands of
WhatsApp messages, or extracting leads with our email scraping tool,
Vedive makes the process seamless. With features like real-time delivery,
contact organization, and automation-ready workflows, we help you
connect, engage, and convert — faster.          </p>
        </div>

        <div className="grid-item item2" style={{  padding: '0'}}>
        <img src={bgImage4} alt="" />
        </div>

        <div className="grid-item item3" style={{  padding: '0'}}>
        <img src={bgImage5} alt="" />
        </div>

        <div
          className="grid-item item4"
          style={{ backgroundColor: "#1E90FF", color: "white" }}
        >
          <h3 className="text-[48px] font-medium">Our Solution</h3>
          <p>
Vedive delivers a unified communication platform built for modern outreach.
Our AI-powered Bulk Email Sender ensures top-tier deliverability, keeping
your messages out of spam and straight into inboxes. The WhatsApp Bulk
Sender lets you engage large audiences instantly, offering high-response,
real-time messaging.
For lead generation, our Email Scraper and mobile number extractor tools
help you collect verified contacts from targeted sources — fueling smarter
campaigns. Everything runs on secure, encrypted infrastructure for full data
protection and peace of mind.
Forget managing multiple tools — Vedive combines bulk messaging,
automated outreach, and lead extraction in one scalable platform. Save
time, boost engagement, and maximize ROI with smarter communication
powered by Vedive
          </p>
        </div>
      </div>

      <CoreValues />
      <Footer />
    </div>
  );
};

export default AboutUs;
