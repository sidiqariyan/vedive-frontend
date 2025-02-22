import React, { useState, useEffect } from "react";
import bgImage from "../../../assets/mainBackground.png"; // Adjust the path as needed
import "./Hero.css";
import Navbar from "./Navbar";
import SenderBody from "../Mailer/SenderBody";
import EmailScrapper from "../Mailer/EmailScrapper";
import GmailSender from "../Gmail/GmailSender";
import NumberScraper from "../Whatsapp/NumberScraper";
import WhatsAppSender from "../Whatsapp/WhatsAppSender";

const Hero = () => {
  const [activeComponent, setActiveComponent] = useState("bulkmailsender");
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem("userConsent");
    if (consent === "accepted") {
      setShowPopup(false);
    } else if (consent === "rejected") {
      window.location.href = "https://www.google.com";
    }
  }, []);

  const handleConsent = (consent) => {
    if (consent === "accepted") {
      localStorage.setItem("userConsent", "accepted");
      setShowPopup(false);
    } else {
      localStorage.setItem("userConsent", "rejected");
      window.location.href = "https://www.google.com";
    }
  };

  return (
    <div
      className={`w-full h-screen text-white flex flex-col relative ${
        showPopup ? "backdrop-blur-md" : ""
      }`}
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-3xl z-50">
          <div className="p-8 rounded-lg text-center">
            <h1 className="text-[80px] text-primary font-bold">Welcome to Vedive</h1>
            <h2 className="text-[64px] text-primary">One Click For Bulk Reaching.</h2>
            <p className="text-white mt-2">
              By accepting our cookies, you directly help us to expand our pledge to the planet.
              This year alone, WeTransfer has committed to planting over 175,000 trees, and we’re
              just getting started. You’ll have a positive impact by simply experiencing our
              award-winning ads. We use cookies and other technologies that are essential to enable
              our site to function and to improve our services. Learn more in our Privacy Notice.
              By clicking "Accept all" you also agree to allow us and our 61 vendors to store
              and/or access information on your device and use your personal data, such as IP
              address, to deliver personalised advertising and content on and off our websites and
              apps, to measure the effectiveness of the advertising and content, to conduct
              audience research and develop services. You may decline consent by clicking "Reject
              all". To learn more about these purposes and our partners or to exercise your
              preferences click on the "Manage Preferences" button below. These choices will be
              communicated to our partners and will not affect your browsing experience. You may
              withdraw your consent at any time by visiting the Privacy Hub.
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => handleConsent("accepted")}
              >
                Accept All
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => handleConsent("rejected")}
              >
                Reject All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <Navbar />

      {/* Hero Content */}
      <div className="z-10 text-center px-2">
        <h1 className="font-primary mb-4 font-semibold text-[48px] leading-[59.31px] text-center tracking-[0%] text-primary mt-6  
        md:text-[80px] md:leading-[93.92px] lg:text-[60px] lg:leading-[75px] 2xl:text-[80px] 2xl:leading-[93.92px]">
          Where <span className="text-third font-primary">Messages</span>
          <br /> Meet <span className="text-third font-primary">Meaning</span>
        </h1>
        <p className="text-[26px] text-center  
      max-sm:text-[14px] max-sm:leading-[19.07px] max-sm:font-[400] max-sm:font-openSans 
      lg:text-[22px] 2xl:text-[26px]">
          Trusted for <span className="text-third">99.9%</span> Delivery Success. Spam-Free <br />
          Messaging for Modern Businesses
        </p>
      </div>

      {/* Button Section */}
      <div className="w-full max-w-[900px] mx-auto grid md:grid-cols-5 grid-cols-3 gap-4 justify-center mt-4 max-sm:grid-cols-2 max-sm:w-[95%]">
      <button
    className={`tool-buttons font-secondary rounded-md text-lg px-4 py-2 transition-all ${
      activeComponent === "bulkMailer" ? "bg-third text-white" : "bg-transparent border hover:bg-third"
    }`}
    onClick={() => setActiveComponent("bulkMailer")}
  >
    Bulk Mailer
  </button>
  <button
    className={`tool-buttons rounded-md font-secondary text-lg px-4 py-2 transition-all ${
      activeComponent === "mailScraper" ? "bg-third text-white" : "bg-transparent border hover:bg-third"
    }`}
    onClick={() => setActiveComponent("mailScraper")}
  >
    Mail Scraper
  </button>
  <button
    className={`tool-buttons rounded-md font-secondary text-lg px-4 py-2 transition-all ${
      activeComponent === "gmailSender" ? "bg-third text-white" : "bg-transparent border hover:bg-third"
    }`}
    onClick={() => setActiveComponent("gmailSender")}
  >
    Gmail Sender
  </button>
  <button
    className={`tool-buttons rounded-md font-secondary text-lg px-4 py-2 transition-all ${
      activeComponent === "numberScraper" ? "bg-third text-white" : "bg-transparent border hover:bg-third"
    }`}
    onClick={() => setActiveComponent("numberScraper")}
  >
    Number Scraper
  </button>
  <button
    className={`tool-buttons rounded-md font-secondary text-lg px-4 py-2 transition-all ${
      activeComponent === "whatsAppSender" ? "bg-third text-white" : "bg-transparent border hover:bg-third"
    }`}
    onClick={() => setActiveComponent("whatsAppSender")}
  >
    WhatsApp Sender
  </button>
</div>

      {/* Render components conditionally */}
      <div className="flex justify-center mt-8">
        {activeComponent === "bulkMailer" && <SenderBody />}
        {activeComponent === "mailScraper" && <EmailScrapper />}
        {activeComponent === "gmailSender" && <GmailSender />}
        {activeComponent === "numberScraper" && <NumberScraper />}
        {activeComponent === "whatsAppSender" && <WhatsAppSender />}
      </div>
    </div>
  );
};

export default Hero;  