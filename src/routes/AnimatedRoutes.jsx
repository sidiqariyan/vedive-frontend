import React, { memo } from "react";
import { Routes, useLocation, Route } from "react-router-dom";
import { NotFound } from "../components/common/CommonComponents.jsx";

// Import the individual route configurations
import PublicRoutes from "./PublicRoutes.jsx";
import AdminRoutes from "./AdminRoutes.jsx";
import ProtectedRoutes from "./ProtectedRoutes.jsx";

// Optimized AnimatedRoutes without animations
const AnimatedRoutes = memo(() => {
  const location = useLocation();
  
  return (
    <Routes location={location}>
      {/* Call the route functions to get their Route elements */}
      {PublicRoutes()}
      {AdminRoutes()}
      {ProtectedRoutes()}
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
});

export default AnimatedRoutes;