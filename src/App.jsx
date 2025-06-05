import React, { Suspense, lazy, useState, useEffect, useMemo, memo } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./components/Pages/Mailer/AuthContext.jsx";
import ProtectedRoute from "./components/other-pages/ProtectedRoutes.jsx";
import MainLayout from "./components/MailLayout.jsx";
import "./VediveLoader.css"; 
import ResetPassword from "./components/other-pages/ResetPassword.jsx";
import AdminRoute from "./components/other-pages/AdminRoute.jsx";
import EditBlogPost from "./components/other-pages/EditorBlogPost.jsx";
import BlogAdmin from "./components/other-pages/BlogAdmin.jsx";
import OAuth2RedirectHandler from "./components/other-pages/OAuth2RedirectHandler.jsx";

// CRITICAL: Minimal loader duration for better performance
// const LOADER_DURATION = 800;
// const PERFORMANCE_KEY = 'vedive_app_loaded';

// Optimize lazy loading with aggressive chunking
const lazyLoad = (importFunc, preload = false) => {
  const LazyComponent = lazy(() => 
    importFunc().catch(() => ({ 
      default: () => <div className="p-4 text-red-500">Failed to load component</div> 
    }))
  );
  
  if (preload) {
    LazyComponent.preload = importFunc;
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => importFunc());
    } else {
      setTimeout(() => importFunc(), 0);
    }
  }
  
  return LazyComponent;
};

// CRITICAL: Load Hero component synchronously to improve FCP/LCP
import Hero from "./components/Pages/Hero/Hero";

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

// Ultra-minimal Loading Component
const LoadingSpinner = memo(() => (
  <div className="min-h-screen bg-[#04081d] flex items-center justify-center">
    <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin"></div>
  </div>
));

// CRITICAL: Disable page transitions to improve performance
const PageTransition = memo(({ children }) => {
  return <div className="w-full">{children}</div>;
});

// Optimized Loader with minimal animations
// const VediveLoader = memo(({ onComplete }) => {
//   useEffect(() => {
//     const criticalPreloads = [];
//     if (Login.preload) criticalPreloads.push(Login.preload());
//     if (Signup.preload) criticalPreloads.push(Signup.preload());
//     if (Dashboard.preload) criticalPreloads.push(Dashboard.preload());
    
//     const delayedPreload = setTimeout(() => {
//       ContactUs.preload?.();
//       AboutUs.preload?.();
//       Pricing.preload?.();
//       Services.preload?.();
//     }, 400);
    
//     const timer = setTimeout(() => {
//       if (onComplete) onComplete();
//     }, LOADER_DURATION);
    
//     return () => {
//       clearTimeout(timer);
//       clearTimeout(delayedPreload);
//     };
//   }, [onComplete]);

//   return (
//     <div className="vedive-loader">
//       <div className="vedive-loader-bg">
//         <div className="vedive-light-beam" />
//       </div>
//       <div className="vedive-text-container">
//         <h1 
//           data-text="Vedive"
//           className="vedive-text"
//         >
//           Vedive
//         </h1>
//       </div>
//       <div className="vedive-pulse-bg">
//         <div className="vedive-pulse" />
//       </div>
//     </div>
//    );
// });

// Optimized ScrollToTop
const ScrollToTop = memo(() => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
});

// Enhanced route renderer with intersection observer preloading
const renderRoute = (route, index, wrapper = null) => {
  const Component = route.component;
  
  const handleMouseEnter = () => {
    if (Component.preload && typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => Component.preload());
    } else if (Component.preload) {
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
        <div onMouseEnter={handleMouseEnter}>
          {wrappedElement}
        </div>
      }
    />
  );
};

// 🚨 FIXED: Create a Protected Layout component that wraps MainLayout once
const ProtectedLayout = memo(() => (
  <ProtectedRoute>
    <MainLayout />
  </ProtectedRoute>
));

// Optimized AnimatedRoutes without animations
const AnimatedRoutes = memo(() => {
  const location = useLocation();
  
  return (
    <Routes location={location}>
      {/* PUBLIC ROUTES - Outside of MainLayout */}
      <Route path="/" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PageTransition><Hero /></PageTransition>
        </Suspense>
      } />
      <Route path="/home" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PageTransition><Hero /></PageTransition>
        </Suspense>
      } />
      <Route path="/login" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PageTransition><Login /></PageTransition>
        </Suspense>
      } />
      <Route path="/signup" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PageTransition><Signup /></PageTransition>
        </Suspense>
      } />
      <Route path="/contact" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PageTransition><ContactUs /></PageTransition>
        </Suspense>
      } />
      <Route path="/about" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PageTransition><AboutUs /></PageTransition>
        </Suspense>
      } />
      <Route path="/pricing" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PageTransition><Pricing /></PageTransition>
        </Suspense>
      } />
      <Route path="/services" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PageTransition><Services /></PageTransition>
        </Suspense>
      } />
      <Route path="/blogs" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PageTransition><BlogPostList /></PageTransition>
        </Suspense>
      } />
      <Route path="/plans" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PageTransition><Plan /></PageTransition>
        </Suspense>
      } />
      
      {/* OTHER PUBLIC ROUTES */}
      <Route path="/oauth2/redirect" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PageTransition><OAuth2RedirectHandler /></PageTransition>
        </Suspense>
      } />
      <Route path="/pass-reset" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PageTransition><Passreset /></PageTransition>
        </Suspense>
      } />
      <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
      <Route path="/verify-email" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PageTransition><VerifyEmail /></PageTransition>
        </Suspense>
      } />
      <Route path="/plans/payment-status" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PageTransition><PaymentStatus /></PageTransition>
        </Suspense>
      } />
      <Route path="/templates" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PageTransition><PostList /></PageTransition>
        </Suspense>
      } />
      <Route path="/editor/:id" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PageTransition><TemplateEditorPage /></PageTransition>
        </Suspense>
      } />
      
      {/* BLOG ROUTES */}
      <Route path="/search" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PageTransition><BlogPostList /></PageTransition>
        </Suspense>
      } />
      <Route path="/category/:category" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PageTransition><BlogPostList /></PageTransition>
        </Suspense>
      } />
      <Route path="/tag/:tag" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PageTransition><BlogPostList /></PageTransition>
        </Suspense>
      } />
      <Route path="/blog/:slug" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PageTransition><BlogPostDetail /></PageTransition>
        </Suspense>
      } />
      <Route path="/blog-posts/:identifier" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PageTransition><PostDetail /></PageTransition>
        </Suspense>
      } />
      <Route path="/blog/create" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PageTransition><CreateBlogPost /></PageTransition>
        </Suspense>
      } />
      
      {/* ADMIN ROUTES */}
      <Route path="/create-blog" element={
        <AdminRoute>
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition><CreateBlogPost /></PageTransition>
          </Suspense>
        </AdminRoute>
      } />
      <Route path="/admin/blog" element={
        <AdminRoute>
          <PageTransition><BlogAdmin /></PageTransition>
        </AdminRoute>
      } />
      <Route path="/admin/blog/create" element={
        <AdminRoute>
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition><CreateBlogPost /></PageTransition>
          </Suspense>
        </AdminRoute>
      } />
      <Route path="/admin/blog/edit/:id" element={
        <AdminRoute>
          <PageTransition><EditBlogPost /></PageTransition>
        </AdminRoute>
      } />
      <Route path="/create-coupun" element={
        <AdminRoute>
          <PageTransition><CouponManagement /></PageTransition>
        </AdminRoute>
      } />
      <Route path="/post-form" element={
        <AdminRoute>
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition><PostForm /></PageTransition>
          </Suspense>
        </AdminRoute>
      } />
      
      {/* 🎯 PROTECTED DASHBOARD ROUTES - MainLayout stays mounted, only Outlet changes */}
      <Route path="/dashboard" element={<ProtectedLayout />}>
        <Route index element={
          <Suspense fallback={<LoadingSpinner />}>
            <Dashboard />
          </Suspense>
        } />
      </Route>
      <Route path="/account" element={<ProtectedLayout />}>
        <Route index element={
          <Suspense fallback={<LoadingSpinner />}>
            <Account />
          </Suspense>
        } />
      </Route>
      <Route path="/plan" element={<ProtectedLayout />}>
        <Route index element={
          <Suspense fallback={<LoadingSpinner />}>
            <Plan />
          </Suspense>
        } />
      </Route>
      <Route path="/gmail-sender" element={<ProtectedLayout />}>
        <Route index element={
          <Suspense fallback={<LoadingSpinner />}>
            <GmailSender />
          </Suspense>
        } />
      </Route>
      <Route path="/email-scraper" element={<ProtectedLayout />}>
        <Route index element={
          <Suspense fallback={<LoadingSpinner />}>
            <EmailScrapper />
          </Suspense>
        } />
      </Route>
      <Route path="/email-sender" element={<ProtectedLayout />}>
        <Route index element={
          <Suspense fallback={<LoadingSpinner />}>
            <SenderBody />
          </Suspense>
        } />
      </Route>
      <Route path="/whatsapp-sender" element={<ProtectedLayout />}>
        <Route index element={
          <Suspense fallback={<LoadingSpinner />}>
            <MessageForm />
          </Suspense>
        } />
      </Route>
      <Route path="/number-scraper" element={<ProtectedLayout />}>
        <Route index element={
          <Suspense fallback={<LoadingSpinner />}>
            <NumberScraper />
          </Suspense>
        } />
      </Route>
      
      {/* CATCH-ALL FOR BLOG SLUGS */}
      <Route path="/:slug" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PageTransition><BlogPostDetail /></PageTransition>
        </Suspense>
      } />
      
      {/* 404 Route */}
      <Route path="*" element={
        <PageTransition>
          <div className="min-h-screen bg-[#04081d] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">404</h1>
              <p className="text-gray-400">Page Not Found</p>
            </div>
          </div>
        </PageTransition>
      } />
    </Routes>
  );
});

// Smart loader detection
// const shouldShowLoader = () => {
//   if (typeof window === 'undefined') return false;
  
//   try {
//     const navigation = window.performance.getEntriesByType('navigation')[0];
//     const isReload = navigation?.type === 'reload';
//     return isReload;
//   } catch (error) {
//     return false;
//   }
// };

// Main App component with performance optimizations
const App = () => {
  // const [showLoader, setShowLoader] = useState(() => shouldShowLoader());

  // const handleLoaderComplete = useMemo(() => 
  //   () => setShowLoader(false), []
  // );

  // useEffect(() => {
  //   if (!showLoader) {
  //     if (typeof requestIdleCallback !== 'undefined') {
  //       requestIdleCallback(() => {
  //         ContactUs.preload?.();
  //         AboutUs.preload?.();
  //       });
  //     }
  //   }
  // }, [showLoader]);

  useEffect(() => {
    const preconnectLinks = [
      '//fonts.googleapis.com',
      '//fonts.gstatic.com'
    ];
    
    preconnectLinks.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = href;
      document.head.appendChild(link);
    });
  }, []);

  return (
    <AuthProvider>
      {/* {showLoader ? (
        <VediveLoader onComplete={handleLoaderComplete} />
      ) : ( */}
        <Router>
          <ScrollToTop />
          <AnimatedRoutes />
        </Router>
      {/* )} */}
    </AuthProvider>
  );
};

export default App;