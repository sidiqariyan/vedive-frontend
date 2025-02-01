import React, { useState, useEffect } from "react";
import bgImage from '../../../assets/mainBackground.png'; // Adjust the path as needed
import "./Hero.css";
import Navbar from "./Navbar";
import SenderBody from "../Mailer/SenderBody";
import EmailScrapper from "../Mailer/EmailScrapper";
import GmailSender from "../Gmail/GmailSender";
import NumberScraper from "../Whatsapp/NumberScraper"; // Import NumberScraper component
import WhatsAppSender from "../Whatsapp/WhatsAppSender";

const Hero = () => {
  const [activeComponent, setActiveComponent] = useState("bulkMailer");

  const handleClick = (component) => {
    setActiveComponent(component);
  };

  return (
    <div
      className="w-full h-screen text-white flex flex-col"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navbar />

      {/* Hero Content */}
      <div className="z-10 text-center px-6">
        <h1 className="font-semibold bg-clip-text text-primary to-gray-400 mt-6">
          Where <span className="text-third">Messages</span>
          <br /> Meet <span className="text-third">Meaning</span>
        </h1>
        <p className=" text-[26px]">
          Trusted for <span className="text-third">99.9%</span> Delivery Success. Spam-Free <br />
          Messaging for Modern Businesses
        </p>
      </div>

      {/* Button Section */}
      <div className="flex gap-4 justify-center mt-4">
        <button
          className={`tool-buttons font-secondary rounded-md text-1xl transition-all ${
            activeComponent === "bulkMailer" ? "bg-third text-white" : "bg-transparent border hover:bg-third"
          }`}
          onClick={() => handleClick("bulkMailer")}
        >
          Bulk Mailer
        </button>
        <button
          className={`tool-buttons rounded-md font-secondary text-lg transition-all ${
            activeComponent === "mailScraper" ? "bg-third text-white" : "bg-transparent border hover:bg-third"
          }`}
          onClick={() => handleClick("mailScraper")}
        >
          Mail Scraper
        </button>
        <button
          className={`tool-buttons rounded-md font-secondary text-lg transition-all ${
            activeComponent === "gmailSender" ? "bg-third text-white" : "bg-transparent border hover:bg-third"
          }`}
          onClick={() => handleClick("gmailSender")}
        >
          Gmail Sender
        </button>
        <button
          className={`tool-buttons rounded-md font-secondary text-lg transition-all ${
            activeComponent === "numberScraper" ? "bg-third text-white" : "bg-transparent border hover:bg-third"
          }`}
          onClick={() => handleClick("numberScraper")}
        >
          Number Scraper
        </button>
        <button
          className={`tool-buttons rounded-md font-secondary text-lg transition-all ${
            activeComponent === "whatsAppSender" ? "bg-third text-white" : "bg-transparent border hover:bg-third"
          }`}
          onClick={() => handleClick("whatsAppSender")}
        >
          WhatsApp Sender
        </button>
      </div>

      {/* Render components conditionally */}
      <div className="flex justify-center">
        {activeComponent === "bulkMailer" && <SenderBody />}
        {activeComponent === "mailScraper" && <EmailScrapper />}
        {activeComponent === "gmailSender" && <GmailSender />}
        {activeComponent === "numberScraper" && <NumberScraper />} {/* Render NumberScraper */}
        {activeComponent === "whatsAppSender" && <WhatsAppSender />} {/* Render NumberScraper */}
      </div>
    </div>
  );
};

export default Hero;
