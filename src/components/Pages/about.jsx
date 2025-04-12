import "./mainstyles.css";
import Navbar from "./Hero/Navbar";
import Footer from "./Hero/Footer";
import CoreValues from "./Hero/Values";
import bgImage1 from "./about.png";
import bgImage2 from "./assets/about-us-image-2.jpg";
import bgImage3 from "./assets/about-us-image-3.jpg";
import bgImage4 from "./assets/about-us-image-4.png";
import bgImage5 from "./secondAbout.png";

const AboutUs = () => {
  return (
    <div className="main-body">
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
          <h1>Vedive Story</h1>
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
        <h1>What We Want</h1>
      </div>

      {/* Grid Container */}
      <div className="grid-container">
        <div className="grid-item item1" style={{ backgroundColor: "#1E90FF", color: "white" }}>
          <h2>What We Do</h2>
          <p>
          At Vedive, we help businesses streamline and amplify their communication efforts through a unified platform that integrates advanced messaging and lead generation tools. Our mission is to eliminate the friction between businesses and their customers by offering solutions that are fast, intelligent, and scalable. Whether you're launching an email campaign, running bulk WhatsApp messages, or collecting verified leads, Vedive gives you the ability to reach your audience efficiently and effectively. We understand the importance of real-time engagement and deliverability, which is why our platform is designed with performance and reliability in mind. From startups to enterprise clients, businesses choose Vedive because we simplify outreach and make communication more strategic. With powerful tracking tools, secure infrastructure, and automation-ready workflows, we ensure you stay connected to your audience without compromising speed or quality. Vedive empowers you to grow, connect, and convert — all from one powerful communication hub.
          </p>
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
          <h2>Our Solution</h2>
          <p>
          Vedive offers a comprehensive suite of services tailored to modern business needs. Our AI-powered email sending solution guarantees unmatched deliverability by keeping your messages out of spam folders and directly in your audience’s inbox. WhatsApp bulk messaging enables businesses to engage instantly with large user bases, offering a high-response alternative to traditional channels. For lead generation, our intelligent email and mobile number scraping tools allow you to collect high-quality contact data from targeted sources, giving you a strategic edge in outreach. All of this runs on a secure, encrypted infrastructure that protects your communication and customer data end to end. Businesses no longer need to juggle multiple tools or worry about scalability — Vedive handles it all in one platform. We make it easy to launch, monitor, and optimize your outreach while saving time and maximizing ROI. With Vedive, your communication is smarter, your reach is wider, and your results are better.
          </p>
        </div>
      </div>

      <CoreValues />
      <Footer />
    </div>
  );
};

export default AboutUs;
