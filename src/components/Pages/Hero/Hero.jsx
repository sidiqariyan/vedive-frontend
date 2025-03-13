import React, { useState, useEffect } from "react";
import { Mail, Users, MessageSquare, ArrowRight } from "lucide-react";
import bgImage from "../../../assets/mainBackground.png";
import "./Hero.css";
import Navbar from "./Navbar";

const Hero = () => {
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
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50 bg-black bg-opacity-50">
          <div className="bg-gray-800 p-8 rounded-lg text-center w-3/4 md:w-1/2">
            <h1 className="text-4xl font-bold text-primary">Welcome to Vedive</h1>
            <h2 className="text-2xl text-primary mt-2">One Click For Bulk Reaching.</h2>
            <p className="text-white mt-4 text-sm">
              We use cookies and other technologies that are essential to enable our site to function.
              Learn more in our Privacy Notice. Click "Accept all" to agree or "Reject all" to decline.
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
      <div className=" pt-12 min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-[80px] font-semibold font-primary text-center">
        Where Messages {' '}
        <br />
          <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
          Find Meaning
          </span>
        </h1>
        
        <p className="text-zinc-200 text-center max-w-2xl text-lg font-secondary">
        Trusted for 99.9% Delivery Success. Spam-Free 
        Messaging for Modern Businesses
        </p>

        <div className="mt-10 flex gap-4">
          <a href="http://localhost:3000/login">
          <button className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2">
            Start Now <ArrowRight className="w-4 h-4" />
          </button></a>
          <button className="border border-zinc-700 px-6 py-3 rounded-lg font-medium hover:bg-zinc-900 transition-colors">
            Learn More
          </button>
        </div>

        {/* Features */}
        <div className="flex justify-center h-screen ">
  <div className="mt-[-80px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto place-items-center">
    <div className="bg-zinc-900 p-3 rounded-xl text-center w-64">
      <Mail className="w-8 h-8 text-blue-500 mx-auto" />
      <h3 className="text-xl font-semibold mt-4">Email Sender</h3>
      <p className="mt-2 text-zinc-400">Advanced email handling with powerful filtering and organization tools.</p>
    </div>
    <div className="bg-zinc-900 p-3 rounded-xl text-center w-64">
      <Mail className="w-8 h-8 text-blue-500 mx-auto" />
      <h3 className="text-xl font-semibold mt-4">Email Scraper</h3>
      <p className="mt-2 text-zinc-400">Advanced email handling with powerful filtering and organization tools.</p>
    </div>
    <div className="bg-zinc-900 p-3 rounded-xl text-center w-64">
      <Users className="w-8 h-8 text-blue-500 mx-auto" />
      <h3 className="text-xl font-semibold mt-4">Whatsapp Bulk <br />Sender</h3>
      <p className="mt-2 text-zinc-400">Efficiently organize and manage your professional contacts.</p>
    </div>
    <div className="bg-zinc-900 p-3 rounded-xl text-center w-64">
      <MessageSquare className="w-8 h-8 text-blue-500 mx-auto" />
      <h3 className="text-xl font-semibold mt-4">Number Scraper</h3>
      <p className="mt-2 text-zinc-400">Create and manage professional email templates for quick responses.</p>
    </div>
  </div>
</div>

      </div>
    </div>
  );
};

export default Hero;
