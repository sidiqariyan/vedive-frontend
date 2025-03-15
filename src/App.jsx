import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
// Import Pages
import Hero from "./components/Pages/Hero/Hero";
import ContactUs from "./components/Pages/contact.jsx";
import AboutUs from "./components/Pages/about.jsx";
import Pricing from "./components/Pages/pricing.jsx";
import Services from "./components/Pages/services.jsx";
import Login from "./components/other-pages/login.jsx";
import Signup from "./components/other-pages/sign-up.jsx";
import Passreset from "./components/other-pages/pass-reset.jsx";
import VerifyEmail from "./components/other-pages/VerifyEmail";
import Dashboard from "./components/other-pages/dashboard.jsx";
import Account from "./components/other-pages/account.jsx";
import PostForm from "./components/other-pages/PostForm.jsx";
import PostList from "./components/other-pages/PostList.jsx";
import Plan from "./components/other-pages/plan.jsx";
import Campaign from "./components/other-pages/campaign.jsx";
import TemplateEditorPage from "./components/other-pages/TemplateEditor.jsx";
import MainLayout from "./components/MailLayout.jsx"; // Import MainLayout
import { AuthProvider } from "./components/Pages/Mailer/AuthContext.jsx";
import ProtectedRoute from "./components/other-pages/ProtectedRoutes.jsx";
import SenderBody from "./components/Pages/Mailer/SenderBody.jsx";
import EmailScrapper from "./components/Pages/Mailer/EmailScrapper.jsx";
import GmailSender from "./components/Pages/Gmail/GmailSender.jsx";
import WhatsAppSender from "./components/Pages/Whatsapp/WhatsAppSender.jsx"
import NumberScraper from "./components/Pages/Whatsapp/NumberScraper.jsx";
import MessageForm from "./components/Pages/Whatsapp/WhatsAppSender.jsx";
import PaymentStatus from "./components/other-pages/PaymentStatus.jsx";
import SubscriptionHistory from "./components/other-pages/SubscriptionHistory.jsx";

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  }, [pathname]);
  return null;
};

// Page Transition Animation
const pageVariants = {
  initial: { opacity: 0, scale: 0.95, y: 20 }, // Subtle zoom-in and down
  animate: { opacity: 1, scale: 1, y: 0 }, // Normal state
  exit: { opacity: 0, scale: 1.02, y: -20 }, // Slight zoom-out and up
};
const transition = { duration: 0.5, ease: "easeInOut" }; // Smooth & professional

// Wrapper for Protected Routes with MainLayout
const ProtectedMainLayout = ({ children }) => (
  <ProtectedRoute>
    <MainLayout>
      <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={transition}>
        {children}
      </motion.div>
    </MainLayout>
  </ProtectedRoute>
);

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop /> {/* Ensures smooth scroll to top */}
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={transition}>
                  <Hero />
                </motion.div>
              }
            />
            <Route
              path="/contact"
              element={
                <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={transition}>
                  <ContactUs />
                </motion.div>
              }
            />
            <Route
              path="/about"
              element={
                <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={transition}>
                  <AboutUs />
                </motion.div>
              }
            />
            <Route
              path="/pricing"
              element={
                <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={transition}>
                  <Pricing />
                </motion.div>
              }
            />
            <Route
              path="/services"
              element={
                <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={transition}>
                  <Services />
                </motion.div>
              }
            />
            {/* Added the previously nested routes here */}
            <Route path="/plans" element={<Plan />} />
            <Route path="/payment-status" element={<PaymentStatus />} />
            <Route path="/dashboard/subscription" element={<SubscriptionHistory/>} />
            
            {/* Auth Routes */}
            <Route
              path="/login"
              element={
                <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={transition}>
                  <Login />
                </motion.div>
              }
            />
            <Route
              path="/signup"
              element={
                <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={transition}>
                  <Signup />
                </motion.div>
              }
            />
            <Route
              path="/reset"
              element={
                <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={transition}>
                  <Passreset />
                </motion.div>
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
                <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={transition}>
                  <VerifyEmail />
                </motion.div>
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
                <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={transition}>
                  <PostForm />
                </motion.div>
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
                <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={transition}>
                  <TemplateEditorPage />
                </motion.div>
              }
            />
            {/* Fallback Route */}
            <Route
              path="*"
              element={
                <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={transition}>
                  <h1 className="text-4xl font-bold text-center mt-10">404 - Page Not Found</h1>
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </Router>
    </AuthProvider>
  );
};

export default App;