import React, { memo, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Optimized ScrollToTop
const ScrollToTop = memo(() => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
});

export default ScrollToTop;