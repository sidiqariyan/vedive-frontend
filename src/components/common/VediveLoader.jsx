import React, { memo, useEffect } from "react";
import { Login, Signup, Dashboard, ContactUs, AboutUs, Pricing, Services } from "../../config/lazyComponents.jsx";

const LOADER_DURATION = 800;

// Optimized Loader with minimal animations
const VediveLoader = memo(({ onComplete }) => {
  useEffect(() => {
    const criticalPreloads = [];
    if (Login.preload) criticalPreloads.push(Login.preload());
    if (Signup.preload) criticalPreloads.push(Signup.preload());
    if (Dashboard.preload) criticalPreloads.push(Dashboard.preload());
    
    const delayedPreload = setTimeout(() => {
      ContactUs.preload?.();
      AboutUs.preload?.();
      Pricing.preload?.();
      Services.preload?.();
    }, 400);
    
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, LOADER_DURATION);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(delayedPreload);
    };
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

export default VediveLoader;