import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Hero from "./components/Pages/Hero/Hero";
import ContactUs from "./components/Pages/contact.jsx";
import AboutUs from "./components/Pages/about.jsx";
import Pricing from "./components/Pages/pricing.jsx";
import Services from "./components/Pages/services.jsx";
import Login from "./components/other-pages/login.jsx";
import Signup from "./components/other-pages/sign-up.jsx";
import Passreset from "./components/other-pages/pass-reset.jsx";
import Dashboard from "./components/other-pages/dashboard.jsx";
import Account from "./components/other-pages/account.jsx";
import PostForm from "./components/other-pages/PostForm.jsx";
import PostList from "./components/other-pages/PostList.jsx";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Hero />} />

          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset" element={<Passreset />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/account" element={<Account />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/post-form" element={<PostForm />} />
          <Route path="/templates" element={<PostList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
