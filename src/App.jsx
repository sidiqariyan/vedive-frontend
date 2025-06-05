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

// Performance tracking
const PERFORMANCE_KEY = 'vedive_app_loaded';
const LOADER_DURATION = 2000; // Perfect 2 seconds for branding + preloading

// Enhanced lazy loading with instant preloading
const lazyLoad = (importFunc, preload = false) => {
  const LazyComponent = lazy(() => 
    importFunc().catch(() => ({ 
      default: () => <div className="p-4 text-red-500">Failed to load component</div> 
    }))
  );
  
  if (preload) {
    LazyComponent.preload = importFunc;
    // Immediate preload on module definition
    setTimeout(() => importFunc(), 0);
  }
  
  return LazyComponent;
};

// Critical components (loaded immediately with aggressive preloading)
const Hero = lazyLoad(() => import("./components/Pages/Hero/Hero"), true);

// High priority components (preloaded instantly)
const Login = lazyLoad(() => import("./components/other-pages/login.jsx"), true);
const Signup = lazyLoad(() => import("./components/other-pages/sign-up.jsx"), true);
const Dashboard = lazyLoad(() => import("./components/other-pages/dashboard.jsx"), true);

// Medium priority components (smart preloading)
const ContactUs = lazyLoad(() => import("./components/Pages/contact.jsx"));
const AboutUs = lazyLoad(() => import("./components/Pages/about.jsx"));
const Pricing = lazyLoad(() => import("./components/Pages/pricing.jsx"));
const Services = lazyLoad(() => import("./components/Pages/services.jsx"));
const BlogPostList = lazyLoad(() => import("./components/other-pages/BlogPostList"));
const Plan = lazyLoad(() => import("./components/other-pages/plan.jsx"));

// Low priority components (on-demand loading)
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

// Ultra-minimal Loading Component (only shows when Vedive loader is not active)
const LoadingSpinner = memo(() => (
  <div className="min-h-screen bg-[#04081d] flex items-center justify-center">
    <div className="w-4 h-4 border border-blue-400 border-t-transparent rounded-full animate-spin"></div>
  </div>
));

// Optimized Page Transition with minimal motion
const PageTransition = memo(({ children }) => {
  const pageVariants = useMemo(() => ({
    initial: { opacity: 0.8 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.15, ease: "easeOut" }
    },
    exit: { 
      opacity: 0.8,
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

// Ultra-fast Loader Component with Maximum Preloading
const VediveLoader = memo(({ onComplete }) => {
  useEffect(() => {
    // Phase 1: Immediate critical preloading (0ms)
    const criticalPreloads = [];
    if (Hero.preload) criticalPreloads.push(Hero.preload());
    if (Login.preload) criticalPreloads.push(Login.preload());
    if (Signup.preload) criticalPreloads.push(Signup.preload());
    if (Dashboard.preload) criticalPreloads.push(Dashboard.preload());
    
    // Phase 2: High priority preloading (300ms)
    setTimeout(() => {
      ContactUs.preload?.();
      AboutUs.preload?.();
      Pricing.preload?.();
      Services.preload?.();
      BlogPostList.preload?.();
      Plan.preload?.();
    }, 300);
    
    // Phase 3: Medium priority preloading (800ms)
    setTimeout(() => {
      Passreset.preload?.();
      VerifyEmail.preload?.();
      PaymentStatus.preload?.();
      Account.preload?.();
      BlogPostDetail.preload?.();
      CreateBlogPost.preload?.();
    }, 800);
    
    // Phase 4: Low priority preloading (1200ms)
    setTimeout(() => {
      SenderBody.preload?.();
      EmailScrapper.preload?.();
      GmailSender.preload?.();
      MessageForm.preload?.();
      NumberScraper.preload?.();
      PostForm.preload?.();
      CouponManagement.preload?.();
      PostList.preload?.();
      TemplateEditorPage.preload?.();
    }, 1200);
    
    // Complete loader after 2 seconds
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, LOADER_DURATION);
    
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
    // Instant scroll without requestAnimationFrame for speed
    window.scrollTo(0, 0);
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

// Enhanced route renderer with conditional loading
const renderRoute = (route, index, wrapper = null) => {
  const Component = route.component;
  
  const handleMouseEnter = () => {
    if (Component.preload) {
      Component.preload();
    }
  };

  // Aggressive preloading on link focus/hover
  const handleFocus = () => {
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
      element={
        <div 
          onMouseEnter={handleMouseEnter}
          onFocus={handleFocus}
        >
          {wrappedElement}
        </div>
      }
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

// Smart loader detection function
const shouldShowLoader = () => {
  if (typeof window === 'undefined') return false;
  
  try {
    // Check if this is a fresh session (no previous app load)
    const hasLoadedBefore = sessionStorage.getItem(PERFORMANCE_KEY);
    const isDirectNavigation = !document.referrer || 
                              !document.referrer.includes(window.location.hostname);
    
    // Check navigation type
    const navigation = window.performance.getEntriesByType('navigation')[0];
    const isReload = navigation?.type === 'reload';
    const isDirectLoad = navigation?.type === 'navigate' && isDirectNavigation;
    const isPageRefresh = window.performance.navigation?.type === 1;
    
    // Show loader for: direct URL visits, page refreshes, or first-time loads
    const shouldShow = !hasLoadedBefore || isReload || isDirectLoad || isPageRefresh;
    
    if (shouldShow) {
      // Mark as loaded for this session
      sessionStorage.setItem(PERFORMANCE_KEY, 'true');
    }
    
    return shouldShow;
  } catch (error) {
    // Fallback: show loader if we can't determine navigation type
    return true;
  }
};

// Main App component with conditional loading states
const App = () => {
  const [showLoader, setShowLoader] = useState(() => shouldShowLoader());

  const handleLoaderComplete = useMemo(() => 
    () => setShowLoader(false), []
  );

  // Aggressive resource preloading (only after Vedive loader completes)
  useEffect(() => {
    if (!showLoader) {
      // Immediate preloading after Vedive loader
      const preloadCritical = () => {
        // Preload any remaining critical routes
        const criticalPreloads = [Hero, Login, Signup, Dashboard]
          .filter(comp => comp.preload)
          .map(comp => comp.preload());
        
        // Since most components are already preloaded during Vedive loader,
        // this is just a safety net for any missed components
        setTimeout(() => {
          [ContactUs, AboutUs, Pricing, Services, BlogPostList, Plan]
            .forEach(comp => comp.preload?.());
        }, 50);
      };
      
      // Start safety preloading immediately after Vedive loader
      requestAnimationFrame(preloadCritical);
    }
  }, [showLoader]);

  // Performance optimization: prefetch DNS for external resources
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = '//fonts.googleapis.com';
    document.head.appendChild(link);
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

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