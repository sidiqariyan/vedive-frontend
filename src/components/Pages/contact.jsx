import React, { useState } from "react";
import "./mainstyles.css"; // Make sure you create a separate CSS file for styling
import Navbar from "./Hero/Navbar.jsx";
import Footer from "./Hero/Footer.jsx";
import { Helmet } from 'react-helmet';

const ContactUs = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    message: "",
  });

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="main-body">
        <Helmet>
      <title>Contact Vedive: Support for Email & WhatsApp Marketing Tools</title>
      <meta name="description" content="We are always ready to help you and answer your questions ; Call Center. +91 8920593970 ; Our Location. New Delhi, Delhi, India 110084 ; Email."/>
      </Helmet>
      {" "}
      {/* Wrapper div for the whole page */}
      <Navbar />
      <div className="top-section">
        <h1>Contact Us</h1>
        <h2>
          Resolve all your questions effortlessly—<span>connect</span> with us
          today!
        </h2>
      </div>
      <div className="parent-container">
      <div className="main-container-contact">
        {/* Contact Info Section */}
        <div className="info-container-contact">
          <h2>We are always ready to help you and answer your questions</h2>
          <p>
            Our mission is to provide convenience and quality service to every
            marketing professional, so they can make their marketing efforts
            easier and better.
          </p>
          <div className="contact-grid">
            <div className="contact-item">
              <h3>Call Center</h3>
              <h4>+91 8920593970</h4>
              <h4>+91 8447435919</h4>
            </div>
            <div className="contact-item">
              <h3>Our Location</h3>
              <h4>New Delhi, Delhi, India 110084</h4>
            </div>
            <div className="contact-item">
              <h3>Email</h3>
              <h4>info@vedive.com</h4>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="form-container-contact">
          <h1>Get in touch</h1>
          <p>
            Our mission is to provide convenience and quality service to every
            marketing professional, so they can make their marketing efforts
            easier and better.
          </p>
          <div className="form-group">
            <label>
              <span>First Name:</span>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </label>
            <label>
              <span>Last Name:</span>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              <span>Email:</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </label>
            <label>
              <span>Mobile No:</span>
              <input
                type="phone"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
              />
            </label>
          </div>
          <label>Message</label>
          <textarea
            rows="2"
            name="message"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
          <br />
          <div className="button-contact-form-container-contact">
            <button type="submit" className="button-contact-form">
              Send Message
            </button>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;
