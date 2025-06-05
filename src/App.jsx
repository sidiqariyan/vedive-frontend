import React, { Suspense, lazy, useState, useEffect, useMemo, memo } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./components/Pages/Mailer/AuthContext.jsx";
import ProtectedRoute from "./components/other-pages/ProtectedRoutes.jsx";
import MainLayout from "./components/MailLayout.jsx";
import "./VediveLoader.css"; 
import ResetPassword from "./components/other-pages/ResetPassword.jsx";
import Navbar from "./components/Pages/Hero/Navbar.jsx";
import Footer from "./components/Pages/Hero/Footer.jsx";
import AdminRoute from "./components/other-pages/AdminRoute.jsx";
import EditBlogPost from "./components/other-pages/EditorBlogPost.jsx";
import BlogAdmin from "./components/other-pages/BlogAdmin.jsx";
import OAuth2RedirectHandler from "./components/other-pages/OAuth2RedirectHandler.jsx";

// Enhanced lazy loading with preloading capabilities
const lazyLoad = (importFunc, preload = false) => {
  const LazyComponent = lazy(() => 
    importFunc().catch(() => ({ 
      default: () => <div className="p-4 text-red-500">Failed to load component</div> 
    }))
  );
  
  // Preload component on route hover/focus
  if (preload) {
    LazyComponent.preload = importFunc;
  }
  
  return LazyComponent;
};

// Critical components (loaded immediately)
const Hero = lazyLoad(() => import("./components/Pages/Hero/Hero"), true);

// High priority components (likely to be visited)
const Login = lazyLoad(() => import("./components/other-pages/login.jsx"), true);
const Signup = lazyLoad(() => import("./components/other-pages/sign-up.jsx"), true);
const Dashboard = lazyLoad(() => import("./components/other-pages/dashboard.jsx"), true);

// Medium priority components
const ContactUs = lazyLoad(() => import("./components/Pages/contact.jsx"));
const AboutUs = lazyLoad(() => import("./components/Pages/about.jsx"));
const Pricing = lazyLoad(() => import("./components/Pages/pricing.jsx"));
const Services = lazyLoad(() => import("./components/Pages/services.jsx"));
const BlogPostList = lazyLoad(() => import("./components/other-pages/BlogPostList"));
const Plan = lazyLoad(() => import("./components/other-pages/plan.jsx"));

// Low priority components (loaded on demand)
const Passreset = lazyLoad(() => import("./components/other-pages/pass-reset.jsx"));
const VerifyEmail = lazyLoad(() => import("./components/other-pages/VerifyEmail"));
const PaymentStatus = lazyLoad(() => import("./components/other-pages/PaymentStatus.jsx"));
const BlogPostDetail = lazyLoad(() => import("./components/other-pages/BlogPostDetail"));
const CreateBlogPost = lazyLoad(() => import("./components/other-pages/CreateBlogPost"));
const PostDetail = lazyLoad(() => import("./components/other-pages/BlogPostDetail"));
const Account = lazyLoad(() => import("./components/other-pages/account.jsx"));
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

// Minimal Loading Component
const LoadingSpinner = memo(() => (
  <div className="min-h-screen bg-[#04081d] flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
));

// Optimized Page Transition with reduced motion for performance
const PageTransition = memo(({ children }) => {
  const pageVariants = useMemo(() => ({
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.1, ease: "easeIn" }
    },
  }), []);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full"
    >
      {children}
    </motion.div>
  );
});

// Simplified Loader Component
const VediveLoader = memo(({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2000); // Reduced from 3000ms to 2000ms
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
    // Use requestAnimationFrame for smoother scrolling
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [pathname]);
  
  return null;
});

// Route configuration with priority levels
const routeConfig = {
  critical: [
    { path: "/", component: Hero, exact: true },
    { path: "/home", component: Hero },
    { path: "/login", component: Login },
    { path: "/signup", component: Signup },
  ],
  high: [
    { path: "/contact", component: ContactUs },
    { path: "/about", component: AboutUs },
    { path: "/pricing", component: Pricing },
    { path: "/services", component: Services },
    { path: "/blogs", component: BlogPostList },
    { path: "/plans", component: Plan },
  ],
  medium: [
    { path: "/oauth2/redirect", component: OAuth2RedirectHandler },
    { path: "/pass-reset", component: Passreset },
    { path: "/reset-password", component: ResetPassword, noLazy: true },
    { path: "/verify-email", component: VerifyEmail },
    { path: "/plans/payment-status", component: PaymentStatus },
    { path: "/templates", component: PostList },
    { path: "/editor/:id", component: TemplateEditorPage },
  ],
  blog: [
    { path: "/search", component: BlogPostList },
    { path: "/category/:category", component: BlogPostList },
    { path: "/tag/:tag", component: BlogPostList },
    { path: "/blog/:slug", component: BlogPostDetail },
    { path: "/:slug", component: BlogPostDetail },
    { path: "/blog-posts/:identifier", component: PostDetail },
    { path: "/blog/create", component: CreateBlogPost },
  ],
  admin: [
    { path: "/create-blog", component: CreateBlogPost },
    { path: "/admin/blog", component: BlogAdmin, noLazy: true },
    { path: "/admin/blog/create", component: CreateBlogPost }, 
    { path: "/admin/blog/edit/:id", component: EditBlogPost, noLazy: true },
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

// Enhanced route renderer with preloading
const renderRoute = (route, index, wrapper = null) => {
  const Component = route.component;
  
  const handleMouseEnter = () => {
    if (Component.preload) {
      Component.preload();
    }
  };

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
      element={<div onMouseEnter={handleMouseEnter}>{wrappedElement}</div>}
    />
  );
};

// Optimized AnimatedRoutes component
const AnimatedRoutes = memo(() => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Critical Routes (no lazy loading) */}
        {routeConfig.critical.map((route, index) => renderRoute(route, index))}
        
        {/* High Priority Routes */}
        {routeConfig.high.map((route, index) => renderRoute(route, index))}
        
        {/* Medium Priority Routes */}
        {routeConfig.medium.map((route, index) => renderRoute(route, index))}
        
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

// Main App component with performance optimizations
const App = () => {
  const [showLoader, setShowLoader] = useState(() => {
    // Show loader only on page refresh (F5 or browser refresh)
    if (typeof window !== 'undefined') {
      // Check if it's a page refresh
      const isPageRefresh = (
        window.performance.navigation.type === 1 || // TYPE_RELOAD
        window.performance.getEntriesByType('navigation')[0]?.type === 'reload'
      );
      
      return isPageRefresh;
    }
    return false;
  });

  const handleLoaderComplete = useMemo(() => 
    () => setShowLoader(false), []
  );

  // Preload critical resources
  useEffect(() => {
    const preloadCriticalRoutes = () => {
      // Preload Hero component after initial load
      setTimeout(() => {
        if (Hero.preload) Hero.preload();
      }, 100);
      
      // Preload auth components after 1 second
      setTimeout(() => {
        if (Login.preload) Login.preload();
        if (Signup.preload) Signup.preload();
      }, 1000);
    };

    if (!showLoader) {
      preloadCriticalRoutes();
    }
  }, [showLoader]);

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