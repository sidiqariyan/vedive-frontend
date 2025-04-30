import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './Mailer/AuthContext.jsx';

/**
 * AdminRoute: Only allows users with role "admin" to access children.
 * Redirects non-admins to a forbidden page or back to home.
 */
export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While auth state is loading, you can show a spinner or nothing
  if (loading) {
    return null; // or a <Spinner />
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in but not an admin, redirect or show forbidden
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
    // Or render a 403 message:
    // return <h1 className="text-center mt-20 text-xl">403 - Forbidden</h1>;
  }

  // If admin, render children
  return <>{children}</>;
}
