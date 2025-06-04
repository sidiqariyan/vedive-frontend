import React, { Suspense, lazy, useState, useEffect, useMemo, memo } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./components/Pages/Mailer/AuthContext.jsx";
import ProtectedRoute from "./components/other-pages/ProtectedRoutes.jsx";
import MainLayout from "./components/MailLayout.jsx";
import "tailwindcss/tailwind.css";
import "./VediveLoader.css"; 
import ResetPassword from "./components/other-pages/ResetPassword.jsx";
import Navbar from "./components/Pages/Hero/Navbar.jsx";
import Footer from "./components/Pages/Hero/Footer.jsx";
import AdminRoute from "./components/other-pages/AdminRoute.jsx";
import EditBlogPost from "./components/other-pages/EditorBlogPost.jsx";
import BlogAdmin from "./components/other-pages/BlogAdmin.jsx";
import OAuth2RedirectHandler from "./components/other-pages/OAuth2RedirectHandler.jsx";
// import BlogPostList from "./components/other-pages/BlogPostList.jsx";

// Lazy-loaded components with better organization
const lazyLoad = (importFunc, fallback = null) => 
  lazy(() => importFunc().catch(() => ({ default: () => <div>Failed to load component</div> })));

// Public Pages
const Hero = lazyLoad(() => import("./components/Pages/Hero/Hero"));
const ContactUs = lazyLoad(() => import("./components/Pages/contact.jsx"));
const AboutUs = lazyLoad(() => import("./components/Pages/about.jsx"));
const Pricing = lazyLoad(() => import("./components/Pages/pricing.jsx"));
const Services = lazyLoad(() => import("./components/Pages/services.jsx"));

// Auth Pages
const Login = lazyLoad(() => import("./components/other-pages/login.jsx"));
const Signup = lazyLoad(() => import("./components/other-pages/sign-up.jsx"));
const Passreset = lazyLoad(() => import("./components/other-pages/pass-reset.jsx"));
const VerifyEmail = lazyLoad(() => import("./components/other-pages/VerifyEmail"));
const PaymentStatus = lazyLoad(() => import("./components/other-pages/PaymentStatus.jsx"));


// Blog Components
const BlogPostList = lazyLoad(() => import("./components/other-pages/BlogPostList"));
const BlogPostDetail = lazyLoad(() => import("./components/other-pages/BlogPostDetail"));
const CreateBlogPost = lazyLoad(() => import("./components/other-pages/CreateBlogPost"));
const PostDetail = lazyLoad(() => import("./components/other-pages/BlogPostDetail"));

// Dashboard Pages
const Dashboard = lazyLoad(() => import("./components/other-pages/dashboard.jsx"));
const Account = lazyLoad(() => import("./components/other-pages/account.jsx"));
const Plan = lazyLoad(() => import("./components/other-pages/plan.jsx"));
const SenderBody = lazyLoad(() => import("./components/Pages/Mailer/SenderBody.jsx"));
const EmailScrapper = lazyLoad(() => import("./components/Pages/Mailer/EmailScrapper.jsx"));
const GmailSender = lazyLoad(() => import("./components/Pages/Gmail/GmailSender.jsx"));
const MessageForm = lazyLoad(() => import("./components/Pages/Whatsapp/WhatsAppSender.jsx"));
const NumberScraper = lazyLoad(() => import("./components/Pages/Whatsapp/NumberScraper.jsx"));
const SubscriptionHistory = lazyLoad(() => import("./components/other-pages/SubscriptionHistory.jsx"));
const PostForm = lazyLoad(() => import("./components/other-pages/PostForm.jsx"));
const CouponManagement = lazyLoad(() => import("./components/other-pages/create-coupon.jsx"));
const PostList = lazyLoad(() => import("./components/other-pages/PostList.jsx"));
const TemplateEditorPage = lazyLoad(() => import("./components/other-pages/TemplateEditor.jsx"));

// Optimized Loading Component
const LoadingSpinner = memo(() => (
  <div className="min-h-screen bg-[#04081d] flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="text-blue-400 text-sm font-medium">Loading...</div>
    </div>
  </div>
));

// Optimized Page Transition Component
const PageTransition = memo(({ children }) => {
  const pageVariants = useMemo(() => ({
    initial: { opacity: 0, x: -10 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.25, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      x: 10,
      transition: { duration: 0.15, ease: "easeIn" }
    },
  }), []);

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
});

// Optimized Loader Component with CSS-in-JS moved to external styles
const VediveLoader = memo(({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="vedive-loader">
      <div className="vedive-loader-bg">
        <div className="vedive-light-beam" />
      </div>
      <div className="vedive-text-container">
        <h1 
          data-text="Vedive"
          className="vedive-text"
        >
          Vedive
        </h1>
      </div>
      <div className="vedive-pulse-bg">
        <div className="vedive-pulse" />
      </div>
    </div>
  );
});

// Optimized ScrollToTop component
const ScrollToTop = memo(() => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
});

// Route configuration for better maintainability
const routeConfig = {
  public: [
    { path: "/", component: Hero, exact: true },
    { path: "/home", component: Hero },
    { path: "/contact", component: ContactUs },
    { path: "/about", component: AboutUs },
    { path: "/pricing", component: Pricing },
    { path: "/services", component: Services },
    { path: "/login", component: Login },
    { path: "/signup", component: Signup },
    { path: "/oauth2/redirect", component: OAuth2RedirectHandler },
    { path: "/pass-reset", component: Passreset },
    { path: "/reset-password", component: ResetPassword, noLazy: true },
    { path: "/verify-email", component: VerifyEmail },
    { path: "/plans/payment-status", component: PaymentStatus },
    { path: "/plans", component: Plan },
    { path: "/blogs", component: BlogPostList },
    { path: "/templates", component: PostList },
    { path: "/editor/:id", component: TemplateEditorPage },
  ],
  blog: [
    {path: "/search", component: BlogPostList    },
    {path: "/category/:category", component: BlogPostList},
    {path: "/tag/:tag", component: BlogPostList},
    { path: "/blog/:slug", component: BlogPostDetail },
    { path: "/:slug", component: BlogPostDetail },
    { path: "/blog-posts/:identifier", component: PostDetail },
    { path: "/blog/create", component: CreateBlogPost },
  ],
  admin: [
    { path: "/create-blog", component: CreateBlogPost },
    { path: "/admin/blog", component: BlogAdmin, noLazy: true },
    { path: "/admin/blog", component: BlogAdmin, noLazy: true },
    { path: "/create-coupun", component: CouponManagement, noLazy: true },
    { path: "/post-form", component: PostForm },
  ],
  protected: [
    { path: "dashboard", component: Dashboard },
    { path: "account", component: Account },
    { path: "plan", component: Plan },
    { path: "gmail-sender", component: GmailSender },
    { path: "email-scraper", component: EmailScrapper },
    { path: "email-sender", component: SenderBody },
    { path: "whatsapp-sender", component: MessageForm },
    { path: "number-scraper", component: NumberScraper },
  ]
};

// Route renderer helper
const renderRoute = (route, index, wrapper = null) => {
  const Component = route.component;
  const element = route.noLazy ? (
    <PageTransition>
      <Component />
    </PageTransition>
  ) : (
    <Suspense fallback={<LoadingSpinner />}>
      <PageTransition>
        <Component />
      </PageTransition>
    </Suspense>
  );

  const wrappedElement = wrapper ? wrapper(element) : element;

  return (
    <Route
      key={`${route.path}-${index}`}
      path={route.path}
      element={wrappedElement}
    />
  );
};

// Optimized AnimatedRoutes component
const AnimatedRoutes = memo(() => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        {routeConfig.public.map((route, index) => renderRoute(route, index))}
        
        {/* Blog Routes */}
        {routeConfig.blog.map((route, index) => renderRoute(route, index))}
        
        {/* Admin Routes */}
        {routeConfig.admin.map((route, index) => 
          renderRoute(route, index, (element) => <AdminRoute>{element}</AdminRoute>)
        )}
        
        {/* Protected Dashboard Routes */}
        <Route path="/*" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          {routeConfig.protected.map((route, index) => renderRoute(route, index))}
        </Route>
        
        {/* 404 Route */}
        <Route
          path="*"
          element={
            <PageTransition>
              <div className="min-h-screen bg-[#04081d] flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-white mb-4">404</h1>
                  <p className="text-gray-400">Page Not Found</p>
                </div>
              </div>
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
});

// Main App component
const App = () => {
  const [showLoader, setShowLoader] = useState(() => {
    // Check if we should show loader based on localStorage or sessionStorage
    // Since we can't use localStorage in artifacts, we'll use a simple state
    return true;
  });

  const handleLoaderComplete = useMemo(() => 
    () => setShowLoader(false), []
  );

  return (
    <AuthProvider>
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