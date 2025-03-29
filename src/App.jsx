import React, { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./components/Pages/Mailer/AuthContext.jsx";
import ProtectedRoute from "./components/other-pages/ProtectedRoutes.jsx";
import MainLayout from "./components/MailLayout.jsx";
import "tailwindcss/tailwind.css";
import ResetPassword from "./components/other-pages/ResetPassword.jsx";

// Lazy-loaded pages
const CreateBlogPostPage = lazy(() => import("./components/other-pages/CreateBlogPostPage.jsx"));
const BlogPostListPage  = lazy(() => import("./components/other-pages/BlogPostListPage.jsx"));
const PostDetail = lazy(() => import("./components/other-pages/PostDetails.jsx")); // New route for single post details
const Hero = lazy(() => import("./components/Pages/Hero/Hero"));
const ContactUs = lazy(() => import("./components/Pages/contact.jsx"));
const AboutUs = lazy(() => import("./components/Pages/about.jsx"));
const Pricing = lazy(() => import("./components/Pages/pricing.jsx"));
const Services = lazy(() => import("./components/Pages/services.jsx"));
const Login = lazy(() => import("./components/other-pages/login.jsx"));
const Signup = lazy(() => import("./components/other-pages/sign-up.jsx"));
const Passreset = lazy(() => import("./components/other-pages/pass-reset.jsx"));
const VerifyEmail = lazy(() => import("./components/other-pages/VerifyEmail"));
const Dashboard = lazy(() => import("./components/other-pages/dashboard.jsx"));
const Account = lazy(() => import("./components/other-pages/account.jsx"));
const PostForm = lazy(() => import("./components/other-pages/PostForm.jsx"));
const PostList = lazy(() => import("./components/other-pages/PostList.jsx"));
const Plan = lazy(() => import("./components/other-pages/plan.jsx"));
const Campaign = lazy(() => import("./components/other-pages/campaign.jsx"));
const TemplateEditorPage = lazy(() => import("./components/other-pages/TemplateEditor.jsx"));
const SenderBody = lazy(() => import("./components/Pages/Mailer/SenderBody.jsx"));
const EmailScrapper = lazy(() => import("./components/Pages/Mailer/EmailScrapper.jsx"));
const GmailSender = lazy(() => import("./components/Pages/Gmail/GmailSender.jsx"));
const MessageForm = lazy(() => import("./components/Pages/Whatsapp/WhatsAppSender.jsx"));
const NumberScraper = lazy(() => import("./components/Pages/Whatsapp/NumberScraper.jsx"));
const PaymentStatus = lazy(() => import("./components/other-pages/PaymentStatus.jsx"));
const SubscriptionHistory = lazy(() => import("./components/other-pages/SubscriptionHistory.jsx"));

// Enhanced Page Transition Component
const EnhancedPageTransition = ({ children }) => {
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="page-transition-wrapper"
    >
      {children}
    </motion.div>
  );
};

// Custom Loader Component
const ElegantLoader = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="h-screen bg-black flex items-center justify-center overflow-hidden relative">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@200;300;400;700&display=swap');
          @keyframes slideIn {
            0% {
              transform: translateX(100%);
              opacity: 0;
              letter-spacing: 0.35em;
            }
            30% {
              opacity: 0.3;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
              letter-spacing: 0.15em;
            }
          }
          @keyframes lightUp {
            0% {
              background-position: 200% 50%;
              opacity: 0.3;
            }
            50% {
              opacity: 0.7;
            }
            100% {
              background-position: 0% 50%;
              opacity: 1;
            }
          }
          @keyframes borderLight {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 100% 50%;
            }
          }
          .elegant-text {
            font-weight: 700;
            text-transform: uppercase;
            transition: all 0.3s ease-in-out;
            color: transparent;
            -webkit-text-stroke: 2px rgba(30, 144, 255, 1);
            text-stroke: 2px rgba(30, 144, 255, 1);
            position: relative;
          }
          .elegant-text::before {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            color: transparent;
            -webkit-text-stroke: 2px rgba(30, 144, 255, 1);
            text-stroke: 2px rgba(30, 144, 255, 1);
            background: linear-gradient(90deg, transparent, rgba(30,144,255,1), transparent);
            background-size: 200%;
            -webkit-background-clip: text;
            background-clip: text;
            animation: borderLight 3s ease-in-out infinite normal;
          }
          .animate-slide {
            animation: 
              slideIn 2.8s cubic-bezier(0.22, 1, 0.36, 1) forwards,
              lightUp 3s cubic-bezier(0.4, 0, 0.2, 1) 0.8s forwards;
          }
          .gradient-bg {
            background: radial-gradient(
              circle at right,
              rgba(30, 144, 255, 0.15) 0%,
              rgba(0, 0, 0, 1) 65%
            );
            transition: background 0.5s ease-in-out;
          }
          .light-beam {
            position: absolute;
            right: -50%;
            top: -100%;
            width: 200%;
            height: 300%;
            background: linear-gradient(
              90deg,
              transparent 0%,
              rgba(30, 144, 255, 0.02) 40%,
              rgba(30, 144, 255, 0.1) 50%,
              rgba(30, 144, 255, 0.02) 60%,
              transparent 100%
            );
            transform: rotate(-45deg);
            pointer-events: none;
            animation: lightBeam 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
          @keyframes lightBeam {
            0%, 100% {
              opacity: 0.8;
              transform: rotate(-45deg) translateY(0);
            }
            50% {
              opacity: 1;
              transform: rotate(-45deg) translateY(-3%);
            }
          }
        `}
      </style>
      <div className="absolute inset-0 gradient-bg">
        <div className="light-beam" />
      </div>
      <div className="relative text-center">
        <h1 
          data-text="Vedive"
          className="elegant-text animate-slide text-[10rem] opacity-0 tracking-wider drop-shadow-xl hover:scale-105 transition-transform duration-500"
          style={{ fontFamily: 'Raleway, sans-serif' }}
        >
          Vedive
        </h1>
      </div>
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="animate-pulse w-[200px] h-[200px] rounded-full bg-blue-500 opacity-10 blur-3xl" />
      </div>
    </div>
  );
};

// Animated loading fallback component
const LoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center bg-gradient-to-r from-gray-900 to-black">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        transition: { 
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse"
        }
      }}
      className="text-blue-500 text-2xl font-light tracking-wider"
    >
      Loading...
    </motion.div>
  </div>
);

// Global transition styles
const globalStyles = `
  .page-content {
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  body.transitioning {
    overflow: hidden;
  }
  
  html {
    scroll-behavior: smooth;
  }
  
  .content-element {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  
  .page-loaded .content-element {
    opacity: 1;
    transform: translateY(0);
  }
  
  .content-element:nth-child(1) { transition-delay: 0.1s; }
  .content-element:nth-child(2) { transition-delay: 0.2s; }
  .content-element:nth-child(3) { transition-delay: 0.3s; }
  .content-element:nth-child(4) { transition-delay: 0.4s; }
  .content-element:nth-child(5) { transition-delay: 0.5s; }
`;

// ScrollToTop component with smooth scrolling
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    document.body.classList.add('transitioning');
    window.scrollTo({ top: 0, behavior: "smooth" });
    const timeout = setTimeout(() => {
      document.body.classList.remove('transitioning');
      document.body.classList.add('page-loaded');
    }, 600);
    
    return () => {
      clearTimeout(timeout);
      document.body.classList.remove('page-loaded');
    };
  }, [pathname]);
  
  return null;
};

// Wrapper for protected routes using MainLayout and PageTransition
const ProtectedMainLayout = ({ children }) => (
  <ProtectedRoute>
    <MainLayout>
      <EnhancedPageTransition>{children}</EnhancedPageTransition>
    </MainLayout>
  </ProtectedRoute>
);

// AnimatedRoutes component to handle route transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <EnhancedPageTransition>
              <Hero />
            </EnhancedPageTransition>
          }
        />
        <Route
          path="/contact"
          element={
            <EnhancedPageTransition>
              <ContactUs />
            </EnhancedPageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <EnhancedPageTransition>
              <AboutUs />
            </EnhancedPageTransition>
          }
        />
        <Route
          path="/pricing"
          element={
            <EnhancedPageTransition>
              <Pricing />
            </EnhancedPageTransition>
          }
        />
        <Route
          path="/services"
          element={
            <EnhancedPageTransition>
              <Services />
            </EnhancedPageTransition>
          }
        />
        {/* Payment & Plan */}
        <Route
          path="/plans/payment-status"
          element={
            <EnhancedPageTransition>
              <PaymentStatus />
            </EnhancedPageTransition>
          }
        />
        <Route
          path="/plans"
          element={
            <EnhancedPageTransition>
              <Plan />
            </EnhancedPageTransition>
          }
        />
        <Route
          path="/dashboard/subscription"
          element={
            <EnhancedPageTransition>
              <SubscriptionHistory />
            </EnhancedPageTransition>
          }
        />
        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <EnhancedPageTransition>
              <Login />
            </EnhancedPageTransition>
          }
        />
        <Route
          path="/signup"
          element={
            <EnhancedPageTransition>
              <Signup />
            </EnhancedPageTransition>
          }
        />
        <Route
          path="/pass-reset"
          element={
            <EnhancedPageTransition>
              <Passreset />
            </EnhancedPageTransition>
          }
        />
        <Route
          path="/reset-password"
          element={
            <EnhancedPageTransition>
              <ResetPassword />
            </EnhancedPageTransition>
          }
        />
        <Route
          path="/plan"
          element={
            <ProtectedMainLayout>
              <Plan />
            </ProtectedMainLayout>
          }
        />
        <Route
          path="/verify-email"
          element={
            <EnhancedPageTransition>
              <VerifyEmail />
            </EnhancedPageTransition>
          }
        />
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedMainLayout>
              <Dashboard />
            </ProtectedMainLayout>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedMainLayout>
              <Account />
            </ProtectedMainLayout>
          }
        />
        <Route
          path="/email-sender"
          element={
            <ProtectedMainLayout>
              <SenderBody />
            </ProtectedMainLayout>
          }
        />
         <Route
          path="/blog-posts/:identifier"
          element={
            <EnhancedPageTransition>
              <PostDetail />
            </EnhancedPageTransition>
          }
        />
        <Route
          path="/blog/create"
          element={
            <EnhancedPageTransition>
              <CreateBlogPostPage />
            </EnhancedPageTransition>
          }
        />
        <Route
          path="/blogs"
          element={
            <EnhancedPageTransition>
              <BlogPostListPage />
            </EnhancedPageTransition>
          }
        />
        {/* New Route for Single Blog Post Details */}
        <Route
          path="/blog-posts/:id"
          element={
            <EnhancedPageTransition>
              <PostDetail />
            </EnhancedPageTransition>
          }
        />
        <Route
          path="/email-scraper"
          element={
            <ProtectedMainLayout>
              <EmailScrapper />
            </ProtectedMainLayout>
          }
        />
        <Route
          path="/gmail-sender"
          element={
            <ProtectedMainLayout>
              <GmailSender />
            </ProtectedMainLayout>
          }
        />
        <Route
          path="/whatsapp-sender"
          element={
            <ProtectedMainLayout>
              <MessageForm />
            </ProtectedMainLayout>
          }
        />
        <Route
          path="/number-scraper"
          element={
            <ProtectedMainLayout>
              <NumberScraper />
            </ProtectedMainLayout>
          }
        />
        <Route
          path="/campaigns"
          element={
            <ProtectedMainLayout>
              <Campaign />
            </ProtectedMainLayout>
          }
        />
        <Route
          path="/post-form"
          element={
            <EnhancedPageTransition>
              <PostForm />
            </EnhancedPageTransition>
          }
        />
        <Route
          path="/templates"
          element={
            <ProtectedMainLayout>
              <PostList />
            </ProtectedMainLayout>
          }
        />
        <Route
          path="/editor/:id"
          element={
            <EnhancedPageTransition>
              <TemplateEditorPage />
            </EnhancedPageTransition>
          }
        />
        {/* Fallback Route */}
        <Route
          path="*"
          element={
            <EnhancedPageTransition>
              <h1 className="text-4xl font-bold text-center mt-10">404 - Page Not Found</h1>
            </EnhancedPageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const handleLoaderComplete = () => {
    setShowLoader(false);
    setInitialLoadComplete(true);
  };

  return (
    <AuthProvider>
      <style>{globalStyles}</style>
      <Router>
        <ScrollToTop />
        {showLoader ? (
          <ElegantLoader onComplete={handleLoaderComplete} />
        ) : (
          <Suspense fallback={<LoadingFallback />}>
            <AnimatedRoutes />
          </Suspense>
        )}
      </Router>
    </AuthProvider>
  );
};

export default App;
