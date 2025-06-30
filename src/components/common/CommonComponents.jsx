import React, { memo } from "react";

// Ultra-minimal Loading Component
export const LoadingSpinner = memo(() => (
  <div className="min-h-screen bg-[#04081d] flex items-center justify-center">
    <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin"></div>
  </div>
));

// CRITICAL: Disable page transitions to improve performance
export const PageTransition = memo(({ children }) => {
  return <div className="w-full">{children}</div>;
});

// 404 Component
export const NotFound = memo(() => (
  <div className="min-h-screen bg-[#04081d] flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-white mb-4">404</h1>
      <p className="text-gray-400">Page Not Found</p>
    </div>
  </div>
));