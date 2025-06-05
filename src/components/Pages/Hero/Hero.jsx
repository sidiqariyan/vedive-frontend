import React, { useState, useEffect, memo, useCallback, useMemo } from "react";
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

// Memoized components for better performance
const ConsentPopup = memo(({ showPopup, onConsent }) => {
  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900/90 backdrop-blur-xl p-6 rounded-xl max-w-lg mx-4 border border-slate-800/50 shadow-2xl relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-400 flex items-center justify-center">
            <Sparkles className="text-white" size={20} />
          </div>
          <span className="text-sm font-medium text-blue-400">Welcome</span>
        </div>
        
        <h1 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
          Discover Vedive
        </h1>
        
        <p className="text-white/70 mb-6 text-sm">
          By using our service, you're agreeing to our terms and privacy policy.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={() => onConsent("accepted")}
            className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 px-4 py-2 text-white font-medium hover:shadow-lg transition-all duration-300"
          >
            Accept
          </button>
          
          <button
            onClick={() => onConsent("rejected")}
            className="rounded-lg bg-transparent px-4 py-2 text-white font-medium border border-slate-700 hover:border-slate-500 transition-all duration-300"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
});

// Memoized service card component
const ServiceCard = memo(({ service, index, isHovered, onHover, onLeave, onClick }) => (
  <div
    onMouseEnter={() => onHover(index)}
    onMouseLeave={onLeave}
    onClick={() => onClick(service.id)}
    className={`bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 transition-all duration-300 cursor-pointer flex flex-col items-center text-center group hover:shadow-xl transform ${isHovered ? 'scale-105' : 'scale-100'} relative will-change-transform`}
  >
    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${service.color} bg-opacity-20 flex items-center justify-center mb-4 transform transition-all duration-300 group-hover:scale-110 relative`}>
      <div className="text-blue-400 group-hover:text-white transition-colors duration-300 relative z-10">
        {service.icon}
      </div>
    </div>
    <h2 className="text-xl font-bold mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-indigo-300 transition-colors duration-300">
      {service.name}
    </h2>
    <p className="text-white/60 text-sm group-hover:text-white/80 transition-colors duration-300">
      {service.description}
    </p>
    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
      <ArrowRight size={18} className="transition-all duration-300" />
    </div>
  </div>
));

const Hero = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const navigate = useNavigate();

  // Optimized consent check - runs once on mount
  useEffect(() => {
    const consent = localStorage.getItem("userConsent");
    if (consent === "rejected") {
      window.location.href = "https://www.google.com";
    } else if (consent !== "accepted") {
      setShowPopup(true);
    }
  }, []);

  // Minimal background effects - reduced from 30 to 6 orbs
  useEffect(() => {
    const mainElement = document.querySelector("main");
    if (mainElement && !mainElement.hasAttribute('data-orbs-added')) {
      mainElement.setAttribute('data-orbs-added', 'true');
      
      // Reduced number of animated elements for better performance
      for (let i = 0; i < 6; i++) {
        const glowOrb = document.createElement("div");
        glowOrb.classList.add("glow-orb");
        glowOrb.style.left = `${Math.random() * 100}%`;
        glowOrb.style.top = `${Math.random() * 100}%`;
        glowOrb.style.animationDuration = `${Math.random() * 10 + 15}s`;
        glowOrb.style.animationDelay = `${Math.random() * 5}s`;
        glowOrb.style.opacity = `${Math.random() * 0.3 + 0.1}`;
        mainElement.appendChild(glowOrb);
      }
    }
    
    // Optimized scroll handler with throttling
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const glowOrbs = document.querySelectorAll('.glow-orb');
          
          glowOrbs.forEach((orb, index) => {
            const speed = 0.02 + (index % 3 * 0.01);
            orb.style.transform = `translateY(${scrollY * speed}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Memoized event handlers
  const handleConsent = useCallback((consent) => {
    if (consent === "accepted") {
      localStorage.setItem("userConsent", "accepted");
      setShowPopup(false);
    } else {
      localStorage.setItem("userConsent", "rejected");
      window.location.href = "https://www.google.com";
    }
  }, []);

  const navigateToService = useCallback((service) => {
    navigate(`/dashboard?service=${service}`);
  }, [navigate]);

  const handleServiceHover = useCallback((index) => {
    setHoverIndex(index);
  }, []);

  const handleServiceLeave = useCallback(() => {
    setHoverIndex(null);
  }, []);

  const handleNavigateToDashboard = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  const handleNavigateToAbout = useCallback(() => {
    navigate('/about');
  }, [navigate]);

  // Memoized data to prevent re-renders
  const services = useMemo(() => [
    {
      id: "bulkMailer",
      name: "Bulk Email Sender",
      description: "Supercharge Your Business Growth with Reliable Bulk Email Senders for Effective Email Campaigns",
      icon: <Mail size={24} strokeWidth={2} className="text-white" />,
      color: "from-blue-600 to-indigo-400",
    },
    {
      id: "mailScraper",
      name: "Email Scraper",
      description: "Boost Lead Generation Using an Intelligent Email Scraper",
      icon: <Search size={24} strokeWidth={2} className="text-white" />,
      color: "from-indigo-600 to-violet-400",
    },
    {
      id: "whatsAppSender",
      name: "WhatsApp Bulk Sender",
      description: "Connect with Clients Instantly and Effectively",
      icon: <MessageSquare size={24} strokeWidth={2} className="text-white" />,
      color: "from-green-600 to-emerald-400",
    },
    {
      id: "numberScraper",
      name: "Number Scraper",
      description: "Find and collect phone numbers for targeted marketing campaigns",
      icon: <Phone size={24} strokeWidth={2} className="text-white" />,
      color: "from-purple-600 to-fuchsia-400",
    },
  ], []);

  const benefits = useMemo(() => [
    { id: 1, icon: <Zap size={20} strokeWidth={2} />, text: "Lightning Fast Delivery" },
    { id: 2, icon: <ShieldCheck size={20} strokeWidth={2} />, text: "99.9% Deliverability" },
    { id: 3, icon: <TrendingUp size={20} strokeWidth={2} />, text: "High Success Rate" },
    { id: 4, icon: <Globe size={20} strokeWidth={2} />, text: "Global Reach" },
  ], []);

  return (
    <div className="w-full min-h-screen text-white bg-slate-950 flex flex-col relative overflow-hidden">
      <Helmet>
        <title>Grow with Vedive Email, WhatsApp & Scraper Tools</title>
        <meta name="description" content="Use Vedive to send bulk emails, bulk WhatsApp messages, and scrape emails or numbers. 100% free tools. No limits. Start growing your outreach today!" />
        {/* Critical resource hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
      </Helmet>

      {/* Simplified background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950 z-0" />
      
      {/* Reduced grid overlay complexity */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDR2MWgtNHYtMXoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />

      {/* Consent popup */}
      <ConsentPopup showPopup={showPopup} onConsent={handleConsent} />

      {/* Navbar */}
      <div className="relative z-30">
        <Navbar />
      </div>

      {/* Main content */}
      <main className="relative z-20 flex-1 flex flex-col items-center px-4 py-8 max-w-6xl mx-auto w-full">
        <section className="w-full text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-2 leading-tight">
            Where Messages
          </h1>
          
          <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6" style={{ lineHeight: "90px" }}>
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600 bg-clip-text text-transparent">Find Meaning</span>
          </h1>
          
          <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto">
            Trusted for 99.9% Delivery Success—Spam-Free Messaging with WhatsApp Bulk Sender & Email Scraping Solutions.
          </p>
          
          {/* Benefits section */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {benefits.map((benefit) => (
              <div key={benefit.id} className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600/20 to-indigo-600/10 flex items-center justify-center text-blue-400 transition-all duration-300 group-hover:scale-110">
                  {benefit.icon}
                </div>
                <span className="text-white/80 font-medium transition-colors duration-300 group-hover:text-white">{benefit.text}</span>
              </div>
            ))}
          </div>
          
          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={handleNavigateToDashboard}
              className="group rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 px-8 py-4 text-white font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-600/20 hover:from-blue-500 hover:to-indigo-400 will-change-transform"
            >
              <span className="flex items-center gap-2">
                Start Now 
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
            
            <button
              onClick={handleNavigateToAbout}
              className="rounded-lg bg-white/5 backdrop-blur-sm px-8 py-4 text-white font-medium border border-white/10 transition-all duration-300 transform hover:-translate-y-1 hover:bg-white/10 hover:border-white/20 will-change-transform"
            >
              Learn More
            </button>
          </div>
        </section>
        
        {/* Services section */}
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
              <h2 className="text-xl font-bold mb-3 font-raleway group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-indigo-300 transition-colors duration-500">
                {service.name}
              </h2>
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
