import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// Public Pages
import Hero from "./components/Pages/Hero/Hero";
import ContactUs from "./components/Pages/contact.jsx";
import AboutUs from "./components/Pages/about.jsx";
import Pricing from "./components/Pages/pricing.jsx";
import Services from "./components/Pages/services.jsx";
// Auth Pages
import Login from "./components/other-pages/login.jsx";
import Signup from "./components/other-pages/sign-up.jsx";
import Passreset from "./components/other-pages/pass-reset.jsx";
import VerifyEmail from "./components/other-pages/VerifyEmail"; // Import the VerifyEmail component
// Protected Pages
import Dashboard from "./components/other-pages/dashboard.jsx";
import Account from "./components/other-pages/account.jsx";
import PostForm from "./components/other-pages/PostForm.jsx";
import PostList from "./components/other-pages/PostList.jsx";
// Protected Route Component
import ProtectedRoute from "./components/other-pages/ProtectedRoutes.jsx";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Hero />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset" element={<Passreset />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-form"
            element={
              <ProtectedRoute>
                <PostForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/templates"
            element={
              <ProtectedRoute>
                <PostList />
              </ProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Hero />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;