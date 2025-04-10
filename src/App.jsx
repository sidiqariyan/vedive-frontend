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
const PostDetail = lazy(() => import("./components/other-pages/PostDetails.jsx"));
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
const TemplateEditorPage = lazy(() => import("./components/other-pages/TemplateEditor.jsx"));
const SenderBody = lazy(() => import("./components/Pages/Mailer/SenderBody.jsx"));
const EmailScrapper = lazy(() => import("./components/Pages/Mailer/EmailScrapper.jsx"));
const GmailSender = lazy(() => import("./components/Pages/Gmail/GmailSender.jsx"));
const MessageForm = lazy(() => import("./components/Pages/Whatsapp/WhatsAppSender.jsx"));
const NumberScraper = lazy(() => import("./components/Pages/Whatsapp/NumberScraper.jsx"));
const PaymentStatus = lazy(() => import("./components/other-pages/PaymentStatus.jsx"));
const SubscriptionHistory = lazy(() => import("./components/other-pages/SubscriptionHistory.jsx"));

// Loading fallback for lazy-loaded components
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Optimized Page Transition Component
const PageTransition = ({ children }) => {
  const pageVariants = {
    initial: {
      opacity: 0,
      x: -10,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.25,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      x: 10,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="page-transition w-full"
    >
      {children}
    </motion.div>
  );
};

// Vedive Loader Component (simplified)
const VediveLoader = ({ onComplete }) => {
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

// Simplified ScrollToTop component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

// Global styles for transitions
const globalStyles = `
  .page-transition {
    will-change: opacity, transform;
    width: 100%;
  }
`;

// AnimatedRoutes component with optimized transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route
          path="/"
          element={
              <PageTransition>
                <Hero />
              </PageTransition>
          }
        />
        <Route
          path="/contact"
          element={
            <Suspense fallback={<PageLoader />}>
              <PageTransition>
                <ContactUs />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/about"
          element={
            <Suspense fallback={<PageLoader />}>
              <PageTransition>
                <AboutUs />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/pricing"
          element={
            <Suspense fallback={<PageLoader />}>
              <PageTransition>
                <Pricing />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/services"
          element={
            <Suspense fallback={<PageLoader />}>
              <PageTransition>
                <Services />
              </PageTransition>
            </Suspense>
          }
        />
        
        {/* Payment & Plan Routes */}
        <Route
          path="/plans/payment-status"
          element={
            <Suspense fallback={<PageLoader />}>
              <PageTransition>
                <PaymentStatus />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/plans"
          element={
            <Suspense fallback={<PageLoader />}>
              <PageTransition>
                <Plan />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/dashboard/subscription"
          element={
            <Suspense fallback={<PageLoader />}>
              <PageTransition>
                <SubscriptionHistory />
              </PageTransition>
            </Suspense>
          }
        />
        
        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <Suspense fallback={<PageLoader />}>
              <PageTransition>
                <Login />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/signup"
          element={
            <Suspense fallback={<PageLoader />}>
              <PageTransition>
                <Signup />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/pass-reset"
          element={
            <Suspense fallback={<PageLoader />}>
              <PageTransition>
                <Passreset />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/reset-password"
          element={
            <Suspense fallback={<PageLoader />}>
              <PageTransition>
                <ResetPassword />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/verify-email"
          element={
            <Suspense fallback={<PageLoader />}>
              <PageTransition>
                <VerifyEmail />
              </PageTransition>
            </Suspense>
          }
        />
        
        {/* Protected Routes */}
        <Route
          path="/plan"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <PageTransition>
                    <Plan />
                  </PageTransition>
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <PageTransition>
                    <Dashboard />
                  </PageTransition>
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <PageTransition>
                    <Account />
                  </PageTransition>
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        
        {/* Email & Communication Routes */}
        <Route
          path="/email-sender"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <PageTransition>
                    <SenderBody />
                  </PageTransition>
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/email-scraper"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <PageTransition>
                    <EmailScrapper />
                  </PageTransition>
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/gmail-sender"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <PageTransition>
                    <GmailSender />
                  </PageTransition>
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/whatsapp-sender"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <PageTransition>
                    <MessageForm />
                  </PageTransition>
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/number-scraper"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <PageTransition>
                    <NumberScraper />
                  </PageTransition>
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        
        {/* Blog & Content Routes */}
        <Route
          path="/blog-posts/:identifier"
          element={
            <Suspense fallback={<PageLoader />}>
              <PageTransition>
                <PostDetail />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/blog/create"
          element={
            <Suspense fallback={<PageLoader />}>
              <PageTransition>
                <CreateBlogPostPage />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/blogs"
          element={
            <Suspense fallback={<PageLoader />}>
              <PageTransition>
                <BlogPostListPage />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/blog-posts/:id"
          element={
            <Suspense fallback={<PageLoader />}>
              <PageTransition>
                <PostDetail />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/post-form"
          element={
            <Suspense fallback={<PageLoader />}>
              <PageTransition>
                <PostForm />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/templates"
          element={
            <Suspense fallback={<PageLoader />}>
              <PageTransition>
                <PostList />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/editor/:id"
          element={
            <Suspense fallback={<PageLoader />}>
              <PageTransition>
                <TemplateEditorPage />
              </PageTransition>
            </Suspense>
          }
        />
        
        {/* Fallback Route */}
        <Route
          path="*"
          element={
            <PageTransition>
              <h1 className="text-4xl font-bold text-center mt-10">404 - Page Not Found</h1>
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [showLoader, setShowLoader] = useState(true);

  const handleLoaderComplete = () => {
    setShowLoader(false);
  };

  return (
    <AuthProvider>
      <style>{globalStyles}</style>
      {showLoader ? (
        <VediveLoader onComplete={handleLoaderComplete} />
      ) : (
        <Router>
          <ScrollToTop />
          <AnimatedRoutes />
        </Router>
      )}
    </AuthProvider>
  );
};

export default App;