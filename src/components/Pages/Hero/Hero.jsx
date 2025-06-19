import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {Mail,Search,Phone,ArrowRight,Sparkles,Zap,TrendingUp,ShieldCheck,Globe,MessageSquare,ChevronLeft,ChevronRight,Star} 
from "lucide-react";
import "./Hero.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Helmet } from 'react-helmet';
import bg from "./assets/home_bg.png";
import bg2 from "./assets/services_bg.png";
import mask1 from "./assets/left.png";
import mask2 from "./assets/right.png";
import about_img  from "./assets/abou_bg.svg";
import data  from "./assets/data.svg";
import indicator  from "./assets/Vector 24.png";
import testimonials_bg from "./assets/testimonials_bg.png"; 
import icon1 from "./assets/icons/icon1.svg"; 
import icon2 from "./assets/icons/icon2.svg"; 
import icon3 from "./assets/icons/icon3.svg"; 
import icon4 from "./assets/icons/icon4.svg"; 
import icon5 from "./assets/icons/icon5.svg"; 
import company1 from "./assets/company/1.png";
import company2 from "./assets/company/2.png";
import company3 from "./assets/company/3.png";
import company4 from "./assets/company/4.png";
import company5 from "./assets/company/5.png";
import "./hero.css"; 
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const Hero = () => {
  const [showPopup, setShowPopup] = useState(true);
  const [hoverIndex, setHoverIndex] = useState(null);
  const navigate = useNavigate();
  const swiperRef = useRef(null);

  useEffect(() => {
    const consent = localStorage.getItem("userConsent");
    if (consent === "accepted") {
      setShowPopup(false);
    } else if (consent === "rejected") {
      window.location.href = "https://www.google.com";
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
      name: "Bulk Email Sender",
      description: "Supercharge Your Business Growth with Reliable Bulk Email Senders for Effective Email Campaigns",
      icon: <Mail size={24} strokeWidth={2} className="text-white" />,
      color: "from-blue-600 to-indigo-400",
      hoverColor: "from-blue-500 to-indigo-300",
    },
    {
      id: "mailScraper",
      name: "Lead Collection",
      description: "Trusted for 99.9% Delivery Success. Spam-Free Messaging for Modern Businesses",
      icon: <Search size={24} strokeWidth={2} className="text-white" />,
      color: "from-orange-900 to-yellow-400",
      hoverColor: "from-indigo-500 to-violet-300",
    },
    {
      id: "whatsAppSender",
      name: "WhatsApp Automation",
      description: "Trusted for 99.9% Delivery Success. Spam-Free Messaging for Modern Businesses",
      icon: <MessageSquare size={24} strokeWidth={2} className="text-white" />,
      color: "from-green-600 to-emerald-400",
      hoverColor: "from-green-500 to-emerald-300",
    },
    {
      id: "numberScraper",
      name: "Real Time Analyst",
      description: "Trusted for 99.9% Delivery Success. Spam-Free Messaging for Modern Businesses",
  icon: <img src={data} alt="Data Analytics" className="w-6 h-6 text-white" />, // Using SVG as image
      color: "from-purple-600 to-fuchsia-400",
      hoverColor: "from-purple-500 to-fuchsia-300",
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Max Weber",
      role: "HR Manager",
      company: "TechCorp Solutions",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Vedive has transformed our outreach campaigns. The automation features saved us countless hours while improving our conversion rates dramatically.",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "Growth Dynamics",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Vedive has transformed our outreach campaigns. The automation features saved us countless hours while improving our conversion rates dramatically.",
    },
    {
      id: 3,
      name: "David Chen",
      role: "Sales Manager",
      company: "StartupHub",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Vedive has transformed our outreach campaigns. The automation features saved us countless hours while improving our conversion rates dramatically.",
    },
    {
      id: 4,
      name: "Emma Rodriguez",
      role: "Product Manager",
      company: "InnovateCorp",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Vedive has transformed our outreach campaigns. The automation features saved us countless hours while improving our conversion rates dramatically.",
    },
    {
      id: 5,
      name: "Michael Thompson",
      role: "CEO",
      company: "Digital Solutions",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Vedive has transformed our outreach campaigns. The automation features saved us countless hours while improving our conversion rates dramatically.",
    },
  ];

  const handlePrevSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNextSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={18}
        className={`${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
        } transition-colors duration-200`}
      />
    ));
  };

  return (
    <div className="w-full min-h-screen text-white bg-[#0d0d0d] flex flex-col relative overflow-hidden">
      
      <Helmet>
      <title>Grow with Vedive Email, WhatsApp & Scraper Tools</title>
      <meta name="description" content="Use Vedive to send bulk emails, bulk WhatsApp messages, and scrape emails or numbers. 100% free tools. No limits. Start growing your outreach today!"/>
      </Helmet>
      

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

 

{/* Main section with background */}
<section className="relative w-full z-10 overflow-hidden">
  <div 
    className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
    style={{
      backgroundImage: `url(${bg})`,
      backgroundPosition: 'center top',
      backgroundSize: '100% 100%'
    }}
  />
  
       {/* Navbar */}
      <div className="relative z-30">
        <Navbar />
      </div>
  <div className="relative z-30 flex-1 flex flex-col items-center px-4 py-8 max-w-[1600px] mx-auto w-full">
    <section className="w-full text-center">
      <div className="overflow-hidden mb-2">
<h1 className="text-[40px] md:text-[65px] lg:text-8xl font-semibold mb-6 mt-4 md:mt-10 leading-tight font-raleway animate-slideUpFade relative inline-block">
          Best WhatsApp & <br/>Email Marketing Tool
        </h1>
      </div>
      
      <p className="text-[18px] md:text-[26px] text-white mb-12 max-w-8xl mx-auto animate-fadeInDelay font-secondary">
        Deliver messages & Emails with 99% accuracy. Engage leads instantly. Built for fast-growing businesses.
      </p>     
<div className="w-full max-w-6xl mx-auto mb-12">   
  <div className="flex flex-wrap justify-center md:justify-between gap-4 md:gap-6 lg:gap-10 px-0 md:px-6 lg:px-8">     
    {[       
      { icon: icon1, title: "Authenticate" },       
      { icon: icon2, title: "Upload Template" },       
      { icon: icon3, title: "Upload Recipients" },       
      { icon: icon4, title: "Create Campaign" },       
      { icon: icon5, title: "Send" }     
    ].map((step, index) => (       
      <div key={index} className={`relative ${index < 3 ? 'w-[calc(33.33%-16px)] md:w-auto' : 'w-[calc(33.33%-16px)] md:w-auto'} ${index >= 3 ? 'md:flex-1' : 'md:flex-1'}`}>         
        <div className="border-2 border-[#046FF9] rounded-2xl p-3 md:p-4 lg:p-6 text-center flex flex-col items-center justify-center h-full min-h-[120px] md:min-h-[140px] lg:min-h-[160px] w-full">           
          <div className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 mx-auto mb-2 md:mb-3 lg:mb-4 flex items-center justify-center">             
            <img                
              src={step.icon}                
              alt={step.title}                
              className="w-6 h-6 md:w-8 md:h-8 lg:w-12 lg:h-12 object-contain brightness-0 invert"              
            />           
          </div>           
          <h3 className="text-white font-semibold text-xs md:text-sm lg:text-lg font-raleway leading-tight">             
            {step.title}           
          </h3>         
        </div>                  
        
        {/* Arrow - show on tablets (md) and desktop, but not on last item */}         
        {index < 4 && (           
          <div className="hidden md:block absolute -right-3 md:-right-[1.25rem] lg:-right-6 xl:-right-8 top-1/2 transform -translate-y-1/2 z-10">             
            <svg                
              width="16"                
              height="12"                
              viewBox="0 0 24 16"                
              fill="none"                
              xmlns="http://www.w3.org/2000/svg"                
              className="w-3 h-2 md:w-4 md:h-3 lg:w-5 lg:h-4 xl:w-6 xl:h-4"
            >               
              <path                  
                d="M16 1L23 8L16 15M23 8H1"                  
                stroke="#046FF9"                  
                strokeWidth="2"                  
                strokeLinecap="round"                  
                strokeLinejoin="round"                
              />             
            </svg>           
          </div>         
        )}       
      </div>     
    ))}   
  </div> 
</div>
      <p className="text-[18px] md:text-[26px] text-white mt-24 mb-8  max-w-8xl mx-auto animate-fadeInDelay font-secondary">
        Trusted by Marketers from the World's Top 100 Startups to Speed Up Marketing.
      </p>     
<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="relative overflow-hidden mt-16 mb-20">
      <div className="flex items-center justify-center space-x-6 md:space-x-12 lg:space-x-16">
        <img src={company1} alt="Company 1" className="h-12 md:h-20 lg:h-32 w-auto opacity-70 hover:opacity-100 transition-opacity duration-300" />
        <img src={company2} alt="Company 2" className="h-12 md:h-16 lg:h-28 w-auto opacity-70 hover:opacity-100 transition-opacity duration-300" />
        <img src={company3} alt="Company 3" className="h-12 md:h-20 lg:h-32 w-auto opacity-70 hover:opacity-100 transition-opacity duration-300" />
        <img src={company4} alt="Company 4" className="h-12 md:h-16 lg:h-28 w-auto opacity-70 hover:opacity-100 transition-opacity duration-300" />
        <img src={company5} alt="Company 5" className="h-12 md:h-20 lg:h-32 w-auto opacity-70 hover:opacity-100 transition-opacity duration-300" />
      </div>
  </div>
</div>    

</section>
  </div>
</section>
      <div className="relative z-30 flex-1 flex flex-col items-center py-0 max-w-[1600px] mx-auto w-full">
        <div className="overflow-hidden">
          <h1 className="text-[30px] md:text-[50px] xl:text-6xl text-center font-semibold mb-[-40px] mt-0 lg:mt-10 leading-tight font-raleway animate-slideUpFade relative inline-block">
            What Sets Vedive Apart <br/> from Others
          </h1>
        </div>
</div>
<div className="relative w-full py-10 z-20 overflow-hidden">
<div 
  className="absolute inset-0 z-0 responsive-bg"
  style={{
    backgroundImage: `url(${bg2})`
  }}
/>
  <div className="relative z-30 flex-1 flex flex-col items-center px-4 md:px-8 lg:px-[9rem] py-6 md:py-8 lg:py-12 max-w-[1600px] mx-auto w-full">
    <div className="relative z-10 w-full">
      <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-10">
        {services.map((service, index) => (
          <div
            key={service.id}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
            onClick={() => navigateToService(service.id)}
            className={`bg-slate-900/20 backdrop-blur-sm border border-slate-800 rounded-xl p-4 md:p-5 lg:p-6 transition-all duration-500 cursor-pointer flex flex-col items-center text-center group hover:shadow-xl hover:shadow-${service.color.split('-')[1]}-500/10 transform ${hoverIndex === index ? 'scale-105' : 'scale-100'} overflow-hidden relative`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 group-hover:animate-gradientPulse`}></div>
            <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-white/10 group-hover:shadow-inner group-hover:shadow-white/5 transition-all duration-500"></div>
            <div className={`w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br ${service.color} bg-opacity-20 flex items-center justify-center mb-3 md:mb-4 lg:mb-5 transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-${service.color.split('-')[1]}-500/30 group-hover:rotate-6 relative`}>
              <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 blur-sm transform scale-110 transition-opacity duration-500"></div>
              <div className="text-blue-400 group-hover:text-white transition-colors duration-500 relative z-10 animate-float">
                {service.icon}
              </div>
            </div>
            <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-3 font-raleway group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-indigo-300 transition-colors duration-500">
              {service.name}
            </h2>
            <p className="font-secondary text-white/60 text-xs md:text-sm group-hover:text-white/80 transition-colors duration-500">
              {service.description}
            </p>
            <div className="mt-3 md:mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 relative flex items-center gap-2">
              <span className="text-white/80 text-xs md:text-sm font-medium">Find out more</span>
              <ArrowRight size={16} className={`md:w-[18px] md:h-[18px] text-gradient-to-r ${service.color} transition-all duration-500`} />
            </div>
          </div>
        ))}
      </section>
    </div>
  </div>
</div>        
        {/* What Makes Us Unique Section with Fixed Mask Positioning */}
<section className="relative w-full py-0 z-20">
  {/* Add mask1 here - positioned for the "What Makes Us Unique" section */}
  <img 
    src={mask1} 
    alt="" 
  className="responsive-mask-image"
  />
  
  <div className="relative z-30 max-w-[1400px] mx-auto px-6 md:px-12">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-16 items-center">
      {/* Right Image - Shows first on mobile */}
      <div className="flex justify-center lg:justify-end order-1 lg:order-2">
        <div className="relative">
          <img 
            src={about_img} 
            alt="What makes us unique" 
            className="w-full max-w-sm md:max-w-md h-auto object-contain"
          />
        </div>
      </div>
      
      {/* Left Content - Shows second on mobile */}
      <div className="space-y-4 md:space-y-6 lg:space-y-8 order-2 lg:order-1 text-center lg:text-left">
        <div>
          <h1 className="text-[30px] md:text-[50px] xl:text-6xl font-semibold mb-8 md:mb-10 lg:mb-4 mt-6 md:mt-10 leading-tight font-raleway animate-slideUpFade relative inline-block">
            <span className="lg:hidden">What Makes Us Unique</span>
            <span className="hidden lg:inline">What Makes<br />Us Unique</span>
          </h1>
          <p className="text-[16px] md:text-[18px] text-white leading-relaxed font-secondary">
            Vedive helps businesses simplify and scale their outreach without 
            coding or costly marketing teams. Whether you're sending bulk 
            WhatsApp messages, validating emails, or tracking campaign 
            performance — everything happens in one dashboard. From 
            generating verified leads to boosting customer engagement, 
            Vedive saves your time, improves ROI, and helps you grow faster 
            with automation that actually works.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
{/* Testimonials Section with Swiper */}
<section className="relative w-full py-16 z-20 mt-20 overflow-hidden">
  <div 
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `url(${testimonials_bg})`,
      backgroundPosition: 'center',
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat'
    }}
  />
  
  {/* Add mask2 here for testimonials section */}
  <img 
    src={mask2} 
    alt="" 
    className="responsive-mask2-image"
  />
  
  <div className="relative z-30 max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">
    {/* Section Header */}
    <div className="text-center mb-16">
      <h1 className="text-[30px] md:text-[50px] xl:text-6xl font-semibold mb-0 lg:mb-8 leading-tight font-raleway text-white">
        Positive feedback<br />
        from our users
      </h1>
    </div>

    {/* Testimonials Swiper Container */}
    <div className="relative max-w-7xl mx-auto">
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={32}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 24,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 32,
          },
        }}
        className="testimonials-swiper"
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id}>
            <div className="bg-slate-800/40 backdrop-blur-sm border border-white rounded-2xl p-8 h-full transition-all duration-500 relative overflow-hidden hover:bg-slate-800/60 group">
              {/* Background overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              
              {/* Stars */}
              <div className="flex items-center gap-1 mb-6 relative z-10">
                {renderStars(testimonial.rating)}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-white/90 mb-8 font-secondary text-lg leading-relaxed relative z-10">
                "{testimonial.text}"
              </blockquote>

              {/* User Info */}
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-slate-600/50 group-hover:ring-blue-500/30 transition-all duration-300">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-white font-semibold font-raleway text-lg mb-1">
                    {testimonial.name}
                  </h4>
                  <p className="text-white/70 text-sm font-secondary">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons with White Line */}
      <div className="flex justify-end items-center gap-4 mt-12">
        {/* Vector Line Image */}
        <img src={indicator} alt="" className="max-w-[65%] md:max-w-none" />
        
        {/* Navigation Buttons */}
        <button
          onClick={handlePrevSlide}
          className="w-10 h-10 rounded-full bg-slate-700/60 backdrop-blur-sm border border-slate-600/50 flex items-center justify-center text-white/80 hover:bg-slate-600/60 hover:border-slate-500/50 hover:text-white hover:scale-110 transition-all duration-300 group"
        >
          <ChevronLeft size={24} className="group-hover:text-blue-400 transition-colors duration-300" />
        </button>

        <button
          onClick={handleNextSlide}
          className="w-10 h-10 rounded-full bg-slate-700/60 backdrop-blur-sm border border-slate-600/50 flex items-center justify-center text-white/80 hover:bg-slate-600/60 hover:border-slate-500/50 hover:text-white hover:scale-110 transition-all duration-300 group"
        >
          <ChevronRight size={24} className="group-hover:text-blue-400 transition-colors duration-300" />
        </button>
      </div>
    </div>
  </div>
</section>
      <Footer />

   </div>
        
  );
};

export default Hero;