import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Mail, 
  Search, 
  Phone, 
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  Globe,
  MessageSquare
} from "lucide-react";
import "./Hero.css";
import Navbar from "./Navbar";
import { Helmet } from 'react-helmet';

      <Helmet>
        <title>Home | My React App</title>
        <meta name="description" content="Welcome to the homepage of My React App." />
      </Helmet>


const Hero = () => {
  const [showPopup, setShowPopup] = useState(true);
  const [hoverIndex, setHoverIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const consent = localStorage.getItem("userConsent");
    if (consent === "accepted") {
      setShowPopup(false);
    } else if (consent === "rejected") {
      window.location.href = "https://www.google.com";
    }
    
    // Adding animated background elements
    const mainElement = document.querySelector("main");
    if (mainElement) {
      for (let i = 0; i < 30; i++) {
        const glowOrb = document.createElement("div");
        glowOrb.classList.add("glow-orb");
        glowOrb.style.left = `${Math.random() * 100}%`;
        glowOrb.style.top = `${Math.random() * 100}%`;
        glowOrb.style.animationDuration = `${Math.random() * 15 + 20}s`;
        glowOrb.style.animationDelay = `${Math.random() * 8}s`;
        glowOrb.style.opacity = `${Math.random() * 0.5 + 0.1}`;
        mainElement.appendChild(glowOrb);
      }
    }
    
    // Enhanced parallax effect on scroll
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const glowOrbs = document.querySelectorAll('.glow-orb');
      
      glowOrbs.forEach((orb, index) => {
        const speed = 0.03 + (index % 5 * 0.01);
        orb.style.transform = `translateY(${scrollY * speed}px) translateX(${Math.sin(scrollY / 1000 + index) * 10}px)`;
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const navigateToService = (service) => {
    navigate(`/dashboard?service=${service}`);
  };

  // Services data with improved descriptions and Lucide icons
  const services = [
    {
      id: "bulkMailer",
      name: "Email Sender",
      description: "Scale Your Business With Reliable Email Communication",
      icon: <Mail size={24} strokeWidth={2} className="text-white" />,
      color: "from-blue-600 to-indigo-400",
      hoverColor: "from-blue-500 to-indigo-300",
    },
    {
      id: "mailScraper",
      name: "Email Scraper",
      description: "Extract and organize email contacts from various sources seamlessly",
      icon: <Search size={24} strokeWidth={2} className="text-white" />,
      color: "from-indigo-600 to-violet-400",
      hoverColor: "from-indigo-500 to-violet-300",
    },
    {
      id: "whatsAppSender",
      name: "WhatsApp Bulk Sender",
      description: "Automated WhatsApp messaging for efficient customer outreach",
      icon: <MessageSquare size={24} strokeWidth={2} className="text-white" />,
      color: "from-green-600 to-emerald-400",
      hoverColor: "from-green-500 to-emerald-300",
    },
    {
      id: "numberScraper",
      name: "Number Scraper",
      description: "Find and collect phone numbers for targeted marketing campaigns",
      icon: <Phone size={24} strokeWidth={2} className="text-white" />,
      color: "from-purple-600 to-fuchsia-400",
      hoverColor: "from-purple-500 to-fuchsia-300",
    },
  ];

  const benefits = [
    { id: 1, icon: <Zap size={20} strokeWidth={2} />, text: "Lightning Fast Delivery" },
    { id: 2, icon: <ShieldCheck size={20} strokeWidth={2} />, text: "99.9% Deliverability" },
    { id: 3, icon: <TrendingUp size={20} strokeWidth={2} />, text: "High Success Rate" },
    { id: 4, icon: <Globe size={20} strokeWidth={2} />, text: "Global Reach" },
  ];

  return (
    <div className="w-full min-h-screen text-white bg-slate-950 flex flex-col relative overflow-hidden">
      
      <Helmet>
      <title>Grow with Vedive Email, WhatsApp & Scraper Tools</title>
      <meta name="description" content="Use Vedive to send bulk emails, bulk WhatsApp messages, and scrape emails or numbers. 100% free tools. No limits. Start growing your outreach today!"/>
      </Helmet>
      {/* Enhanced background with deeper gradients and noise texture */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950 z-0"
      />
      
      {/* Improved grid overlay with animation */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yfDR2MWgtNHYtMXptMC0yaDR2MWgtNHYtMXptMC0yaDR2MWgtNHYtMXptMC0yaDR2MWgtNHYtMXptMC0yaDR2MWgtNHYtMXpNMzQgMzRoMXYxaC0xdi0xem0wLTJoMXYxaC0xdi0xem0wLTJoMXYxaC0xdi0xem0wLTJoMXYxaC0xdi0xem0wLTJoMXYxaC0xdi0xek0zMiAzNGgxdjFoLTF2LTF6bTAtMmgxdjFoLTF2LTF6bTAtMmgxdjFoLTF2LTF6bTAtMmgxdjFoLTF2LTF6bTAtMmgxdjFoLTF2LTF6bTAtMmgxdjFoLTF2LTF6bTAtMmgxdjFoLTF2LTF6TTMwIDM0aDF2MWgtMXYtMXptMC0yaDF2MWgtMXYtMXptMC0yaDF2MWgtMXYtMXptMC0yaDF2MWgtMXYtMXptMC0yaDF2MWgtMXYtMXptMC0yaDF2MWgtMXYtMXpNMjggMzRoMXYxaC0xdi0xem0wLTJoMXYxaC0xdi0xem0wLTJoMXYxaC0xdi0xem0wLTJoMXYxaC0xdi0xem0wLTJoMXYxaC0xdi0xem0wLTJoMXYxaC0xdi0xek0yNiAzNGgxdjFoLTF2LTF6bTAtMmgxdjFoLTF2LTF6bTAtMmgxdjFoLTF2LTF6bTAtMmgxdjFoLTF2LTF6bTAtMmgxdjFoLTF2LTF6bTAtMmgxdjFoLTF2LTF6TTI0IDM0aDF2MWgtMXYtMXptMC0yaDF2MWgtMXYtMXptMC0yaDF2MWgtMXYtMXptMC0yaDF2MWgtMXYtMXptMC0yaDF2MWgtMXYtMXptMC0yaDF2MWgtMXYtMXoiLz48L2c+PC9nPjwvc3ZnPg==')]" />
      
      {/* Animated noise texture overlay for grain effect */}
      <div className="absolute inset-0 opacity-20 mix-blend-soft-light z-10 noise-texture"></div>
      
      {/* Animated glow orbs with enhanced effects */}
      <div className="absolute top-0 w-full h-screen overflow-hidden pointer-events-none">
        <div className="glow-orb glow-orb-1"></div>
        <div className="glow-orb glow-orb-2"></div>
        <div className="glow-orb glow-orb-3"></div>
        <div className="glow-orb glow-orb-4"></div>
        <div className="glow-orb glow-orb-5"></div>
        <div className="glow-orb glow-orb-6"></div>
      </div>

      {/* Improved consent popup with glass morphism and animations */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900/90 backdrop-blur-xl p-8 rounded-xl max-w-2xl mx-4 border border-slate-800/50 shadow-2xl animate-scaleIn relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-blue-600/20 blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-indigo-600/20 blur-3xl"></div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 transition-shadow duration-300">
                <Sparkles className="text-white animate-pulse-slow" size={24} />
              </div>
              <span className="text-sm font-medium text-blue-400">Welcome</span>
            </div>
            
            <h1 className="text-3xl font-bold mb-3 font-raleway bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Discover the power of Vedive
            </h1>
            
            <div className="h-1 w-24 mb-6 bg-gradient-to-r from-blue-600 to-indigo-400 rounded-full animate-widthPulse"></div>
            
            <p className="text-white/70 mb-8">
              By using our service, you're agreeing to our terms and privacy policy.
              We use cookies to enhance your experience and improve our services.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleConsent("accepted")}
                className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 px-6 py-3.5 text-white font-medium hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300 transform hover:-translate-y-1 hover:from-blue-500 hover:to-indigo-400 group relative overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-white/20 to-blue-500/0 -translate-x-full group-hover:animate-shimmer"></span>
                <span className="flex items-center justify-center gap-2 relative z-10">
                  Accept All
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>
              
              <button
                onClick={() => handleConsent("rejected")}
                className="rounded-lg bg-transparent px-6 py-3.5 text-white font-medium border border-slate-700 hover:border-slate-500 hover:bg-slate-800/50 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-slate-500/0 via-slate-500/10 to-slate-500/0 -translate-x-full group-hover:animate-shimmer"></span>
                <span className="relative z-10">Reject All</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <div className="relative z-30">
        <Navbar />
      </div>

      {/* Main content area with adjusted padding to fit within the screen */}
      <main className="relative z-20 flex-1 flex flex-col items-center px-4 py-8 max-w-6xl mx-auto w-full">
        <section className="w-full text-center">
          <div className="overflow-hidden mb-2">
            <h1 className="text-6xl md:text-7xl font-bold mb-2 leading-tight font-raleway animate-slideUpFade relative inline-block">
              Where Messages
            </h1>
          </div>
          
          <div className="overflow-hidden mb-6">
            <h1 className="text-6xl md:text-7xl font-bold leading-tight font-raleway animate-slideUpFadeDelay relative inline-block" style={{ lineHeight: "90px" }}>
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600 bg-clip-text text-transparent">Find Meaning</span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600/0 via-indigo-400 to-blue-600/0 transform animate-scaleWidthDelay2"></div>
            </h1>
          </div>
          
          <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto animate-fadeInDelay font-secondary">
            Trusted for 99.9% Delivery Success. Spam-Free Messaging for Modern Businesses
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 mb-8 animate-fadeInDelay2">
            {benefits.map((benefit, idx) => (
              <div key={benefit.id} className="flex items-center gap-2 group font-secondary" style={{ animationDelay: `${0.6 + idx * 0.1}s` }}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600/20 to-indigo-600/10 flex items-center justify-center text-blue-400 transition-all duration-500 ease-in-out group-hover:bg-gradient-to-br group-hover:from-blue-500/30 group-hover:to-indigo-500/20 group-hover:text-blue-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-md group-hover:shadow-blue-500/20  font-secondary">
                  {benefit.icon}
                </div>
                <span className="text-white/80 font-medium transition-colors duration-300 group-hover:text-white font-secondary">{benefit.text}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8 animate-fadeInDelay3">
            <button
              onClick={() => navigate('/dashboard')}
              className="group rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 px-8 py-4 text-white font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-600/20 hover:from-blue-500 hover:to-indigo-400 relative overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-white/20 to-blue-500/0 -translate-x-full group-hover:animate-shimmer"></span>
              <span className="flex items-center gap-2 relative z-10">
                Start Now 
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
            
            <button
              onClick={() => navigate('/about')}
              className="rounded-lg bg-white/5 backdrop-blur-sm px-8 py-4 text-white font-medium border border-white/10 transition-all duration-300 transform hover:-translate-y-1 hover:bg-white/10 hover:border-white/20 group relative overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:animate-shimmer"></span>
              <span className="relative z-10">Learn More</span>
            </button>
          </div>
        </section>
        
        <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <div
              key={service.id}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              onClick={() => navigateToService(service.id)}
              className={`bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 transition-all duration-500 cursor-pointer flex flex-col items-center text-center group hover:shadow-xl hover:shadow-${service.color.split('-')[1]}-500/10 transform ${hoverIndex === index ? 'scale-105' : 'scale-100'} overflow-hidden relative`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 group-hover:animate-gradientPulse`}></div>
              <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-white/10 group-hover:shadow-inner group-hover:shadow-white/5 transition-all duration-500"></div>
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${service.color} bg-opacity-20 flex items-center justify-center mb-5 transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-${service.color.split('-')[1]}-500/30 group-hover:rotate-6 relative`}>
                <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 blur-sm transform scale-110 transition-opacity duration-500"></div>
                <div className="text-blue-400 group-hover:text-white transition-colors duration-500 relative z-10 animate-float">
                  {service.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 font-raleway group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-indigo-300 transition-colors duration-500">
                {service.name}
              </h3>
              <p className="font-secondary text-white/60 text-sm group-hover:text-white/80 transition-colors duration-500">
                {service.description}
              </p>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 relative">
                <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-lg scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                <ArrowRight size={18} className={`text-gradient-to-r ${service.color} transition-all duration-500`} />
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Hero;
