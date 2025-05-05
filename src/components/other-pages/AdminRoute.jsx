import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Pages/Mailer/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return <>{children}</>;
}
