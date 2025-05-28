import React, { memo } from "react";
import { Helmet } from 'react-helmet';
import "./mainstyles.css";
import Navbar from "./Hero/Navbar";
import Footer from "./Hero/Footer";

// Import images
import bgImage1 from "./sixth.png";
import bgImage4 from "./third.png";
import bgImage5 from "./fourth.png";
import service1 from "./assets/service-1.png";
import service2 from "./assets/service-2.png";
import service3 from "./assets/service-3.png";
import service5 from "./assets/service-5.png";

// Constants
const SERVICES_DATA = [
  {
    number: "01",
    title: "Bulk Email Sender",
    description: "Vedive's bulk email sender helps you send high-volume, AI-optimized emails with top inbox delivery and real-time tracking.",
    backgroundImage: service1,
    link: "https://vedive.com/email-sender"
  },
  {
    number: "02",
    title: "WhatsApp Bulk Sender",
    description: "Engage your audience instantly with personalized, rich-media messages on WhatsApp — perfect for promotions, alerts, and updates.",
    backgroundImage: service2,
    link: "https://vedive.com/whatsapp-sender"
  },
  {
    number: "03",
    title: "Email Scraper",
    description: "Extract verified, niche-specific email leads from targeted sources to fuel your outreach and marketing pipelines.",
    backgroundImage: service3,
    link: "https://vedive.com/email-scraper"
  },
  {
    number: "05",
    title: "Real-Time Tracking Dashboard",
    description: "Track opens, clicks, engagement, and delivery metrics across all your campaigns — all in one smart, centralized dashboard.",
    backgroundImage: service5,
    link: "https://vedive.com/dashboard"
  }
];

const WHY_CHOOSE_TEXT = `Vedive.com offers a complete communication and lead generation platform that goes far beyond what other tools provide. While most platforms focus on either email or WhatsApp separately, Vedive combines a powerful Bulk Email Sender, WhatsApp Bulk Sender, and smart Email Scraper in one easy-to-use system. Our AI-driven technology ensures your messages land in the inbox, not the spam folder, while helping you extract verified leads in real time. Unlike other tools, we also offer free services like test credits and basic scraping access to help you get started without upfront costs. With faster delivery, better scalability, and built-in automation, Vedive is the smarter, more efficient solution for modern business outreach.`;

const USE_CASES_TEXT = `Vedive helps businesses across industries streamline communication and boost results. Marketers can launch high-volume bulk email and WhatsApp campaigns with AI-powered deliverability that ensures inbox placement. Sales teams benefit from our email scraper and mobile number extractor to generate qualified leads faster. E-commerce brands send instant customer updates, while service providers use bulk messaging for promotions and reminders. Agencies can manage multiple client campaigns from a single, secure dashboard. From lead generation to performance tracking, Vedive simplifies outreach with smarter, faster, and more targeted communication tools.`;

const WHO_ITS_FOR_TEXT = `Vedive is perfect for any business that needs to engage customers, nurture leads, or run high-volume outreach. Digital marketers love our advanced targeting, analytics, and deliverability tools. SaaS companies use Vedive to onboard users and send transactional emails at scale. Agencies appreciate our white-label-friendly design and real-time campaign tracking, allowing them to serve multiple clients with confidence. E-commerce brands use our WhatsApp bulk sender for fast product drops and customer support, while B2B companies rely on our scrapers to build lead pipelines without the manual grind. Startups benefit from the affordability and ease of use, while enterprises trust us for our security, uptime, and scalability. Whether you're a solo founder, part of a growing team, or managing an enterprise operation, Vedive fits into your workflow — helping you reach more people, in less time, with better results.`;

// Memoized components
const TopSection = memo(() => (
  <div>
    <Navbar />
    <div className="top-section">
      <h1>Services</h1>
      <h2>
        Maximize Your Reach with <span>Free</span> Messaging Services.
      </h2>
    </div>
  </div>
));

const ServiceSection = memo(({ number, title, description, backgroundImage, link }) => {
  const isExternalLink = link !== "#";
  const linkProps = isExternalLink 
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  const sectionStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    cursor: isExternalLink ? 'pointer' : 'default'
  };

  return (
    <a href={link} {...linkProps} className="service-link">
      <h2 className="section" style={sectionStyle}>
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
});

const ServicesGrid = memo(() => (
  <div className="parent-container">
    <div className="desktop-view" style={{ paddingBottom: '6%' }}>
      {SERVICES_DATA.map((service) => (
        <ServiceSection key={service.number} {...service} />
      ))}
    </div>
  </div>
));

const WhyChooseSection = memo(() => (
  <div className="desktop-view">
    <div className="about-us-container about-us-container-1" style={{ background: "transparent" }}>
      <h2 className="text-primary text-[38px] sm:text-[48px] md:text-[65px] text-center md:text-left font-semibold">Why Choose Vedive</h2>
      <p>{WHY_CHOOSE_TEXT}</p>
    </div>
    <div className="about-us-container">
      <img src={bgImage1} alt="Why choose Vedive illustration" />
    </div>
  </div>
));

const GridItem = memo(({ backgroundColor, color, children, padding = null, image = null, alt = "" }) => {
  const style = {
    ...(backgroundColor && { backgroundColor }),
    ...(color && { color }),
    ...(padding !== null && { padding })
  };

  return (
    <div className="grid-item" style={style}>
      {image ? <img src={image} alt={alt} /> : children}
    </div>
  );
});

const WhyChooseUsSection = memo(() => (
  <div className="what-we-want-container">
    <div className="parent-container">
      <div className="main-heading-text">
        <h2 className="text-primary text-[38px] sm:text-[48px] md:text-[65px] text-center font-semibold">Why Choose Us</h2>
      </div>
    </div>

    <div className="grid-container" style={{ marginBottom: "4%" }}>
      <GridItem backgroundColor="#1E90FF" color="white">
        <h2 className="text-primary text-[32px] sm:text-[48px] md:text-[48px] text-center font-medium">Use Cases</h2>
        <p>{USE_CASES_TEXT}</p>
      </GridItem>

      <GridItem padding={0} image={bgImage4} alt="Use cases illustration" />

      <GridItem padding={0} image={bgImage5} alt="Who it's for illustration" />

      <GridItem backgroundColor="#1E90FF" color="white">
        <h3 className="text-primary text-[32px] sm:text-[48px] md:text-[48px] text-center font-medium">Who It's For</h3>
        <p>{WHO_ITS_FOR_TEXT}</p>
      </GridItem>
    </div>
  </div>
));

// Main component
const Services = () => {
  return (
    <div className="main-body">
      <Helmet>
        <title>Vedive Services: Best Bulk Email & WhatsApp Sender Tools</title>
        <meta 
          name="description" 
          content="Explore Vedive's marketing automation tools: bulk email sender, email scraper, and WhatsApp bulk sender. Streamline outreach and boost leads today!"
        />
      </Helmet>

      <TopSection />

      <h2 className="text-primary text-[38px] sm:text-[48px] md:text-[65px] text-center font-semibold">
        Our Services
      </h2>

      <ServicesGrid />

      <WhyChooseSection />

      <WhyChooseUsSection />

      <Footer />
    </div>
  );
};

export default Services;