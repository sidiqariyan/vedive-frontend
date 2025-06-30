import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./components/Pages/Mailer/AuthContext.jsx";
import VediveLoader from "./components/common/VediveLoader.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import AnimatedRoutes from "./routes/AnimatedRoutes.jsx";
import { shouldShowLoader, preloadCriticalComponents } from "./utils/performance.js";
import "./VediveLoader.css";

const App = () => {
  const [showLoader, setShowLoader] = useState(() => shouldShowLoader());

  const handleLoaderComplete = useMemo(() => 
    () => setShowLoader(false), []
  );

  useEffect(() => {
    if (!showLoader) {
      preloadCriticalComponents();
    }
  }, [showLoader]);

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