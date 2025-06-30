import React, { memo } from "react";
import ProtectedRoute from "../other-pages/ProtectedRoutes.jsx";
import MainLayout from "../MailLayout.jsx";

// Create a Protected Layout component that wraps MainLayout once
const ProtectedLayout = memo(() => (
  <ProtectedRoute>
    <MainLayout />
  </ProtectedRoute>
));

export default ProtectedLayout;