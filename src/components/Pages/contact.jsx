import React, { useState, useCallback, memo } from "react";
import { Helmet } from 'react-helmet';
import "./mainstyles.css";
import Navbar from "./Hero/Navbar.jsx";
import Footer from "./Hero/Footer.jsx";

// Constants
const CONTACT_INFO = [
  {
    title: "Call Center",
    content: ["+91 8920593970", "+91 8447435919"]
  },
  {
    title: "Our Location",
    content: ["New Delhi, Delhi, India 110084"]
  },
  {
    title: "Email",
    content: ["info@vedive.com"]
  }
];

const INITIAL_FORM_STATE = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  message: ""
};

const FORM_VALIDATION_RULES = {
  firstName: { required: true, minLength: 2 },
  lastName: { required: true, minLength: 2 },
  email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  mobile: { required: true, pattern: /^[\+]?[1-9][\d]{0,15}$/ },
  message: { required: true, minLength: 10 }
};

// Utility functions
const validateField = (name, value, rules) => {
  const rule = rules[name];
  if (!rule) return "";

  if (rule.required && !value.trim()) {
    return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
  }
  
  if (rule.minLength && value.length < rule.minLength) {
    return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rule.minLength} characters`;
  }
  
  if (rule.pattern && !rule.pattern.test(value)) {
    if (name === 'email') return "Please enter a valid email address";
    if (name === 'mobile') return "Please enter a valid mobile number";
  }
  
  return "";
};

const validateForm = (formData, rules) => {
  const errors = {};
  Object.keys(formData).forEach(field => {
    const error = validateField(field, formData[field], rules);
    if (error) errors[field] = error;
  });
  return errors;
};

// Memoized components
const TopSection = memo(() => (
  <>
    <Navbar />
    <div className="top-section">
      <h1>Contact Us</h1>
      <h2>
        Resolve all your questions effortlessly—<span>connect</span> with us today!
      </h2>
    </div>
  </>
));

const ContactItem = memo(({ title, content }) => (
  <div className="contact-item">
    <h3>{title}</h3>
    {content.map((item, index) => (
      <h4 key={index}>{item}</h4>
    ))}
  </div>
));

const ContactInfo = memo(() => (
  <div className="info-container-contact">
    <h2>We are always ready to help you and answer your questions</h2>
    <p>
      Our mission is to provide convenience and quality service to every
      marketing professional, so they can make their marketing efforts
      easier and better.
    </p>
    <div className="contact-grid">
      {CONTACT_INFO.map((info, index) => (
        <ContactItem key={index} {...info} />
      ))}
    </div>
  </div>
));

const FormField = memo(({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  error, 
  required = false,
  ...props 
}) => (
  <label>
    <span>
      {label}
      {required && <span className="required">*</span>}
    </span>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={error ? "error" : ""}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
      {...props}
    />
    {error && (
      <span id={`${name}-error`} className="error-message" role="alert">
        {error}
      </span>
    )}
  </label>
));

const TextAreaField = memo(({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  required = false,
  ...props 
}) => (
  <div className="textarea-container">
    <label>
      {label}
      {required && <span className="required">*</span>}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      className={error ? "error" : ""}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
      {...props}
    />
    {error && (
      <span id={`${name}-error`} className="error-message" role="alert">
        {error}
      </span>
    )}
  </div>
));

const ContactForm = memo(({ 
  formData, 
  errors, 
  isSubmitting, 
  onInputChange, 
  onSubmit 
}) => (
  <div className="form-container-contact">
    <h1>Get in touch</h1>
    <p>
      Our mission is to provide convenience and quality service to every
      marketing professional, so they can make their marketing efforts
      easier and better.
    </p>
    
    <form onSubmit={onSubmit} noValidate>
      <div className="form-group">
        <FormField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={onInputChange}
          error={errors.firstName}
          required
        />
        <FormField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={onInputChange}
          error={errors.lastName}
          required
        />
      </div>
      
      <div className="form-group">
        <FormField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onInputChange}
          error={errors.email}
          required
        />
        <FormField
          label="Mobile No"
          name="mobile"
          type="tel"
          value={formData.mobile}
          onChange={onInputChange}
          error={errors.mobile}
          required
        />
      </div>
      
      <TextAreaField
        label="Message"
        name="message"
        rows="4"
        value={formData.message}
        onChange={onInputChange}
        error={errors.message}
        required
      />
      
      <div className="button-contact-form-container-contact">
        <button 
          type="submit" 
          className="button-contact-form"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  </div>
));

// Main component
const ContactUs = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Memoized event handlers
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm(formData, FORM_VALIDATION_RULES);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Simulate API call - replace with actual submission logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success
      setSubmitStatus("success");
      setFormData(INITIAL_FORM_STATE);
      setErrors({});
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  return (
    <div className="main-body">
      <Helmet>
        <title>Contact Vedive: Support for Email & WhatsApp Marketing Tools</title>
        <meta 
          name="description" 
          content="Get support for Vedive's email and WhatsApp marketing tools. Contact us at +91 8920593970 or info@vedive.com. Located in New Delhi, India."
        />
      </Helmet>

      <TopSection />

      <div className="parent-container">
        <div className="main-container-contact">
          <ContactInfo />
          <ContactForm
            formData={formData}
            errors={errors}
            isSubmitting={isSubmitting}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        </div>
        
        {submitStatus === "success" && (
          <div className="success-message" role="alert">
            Thank you for your message! We'll get back to you soon.
          </div>
        )}
        
        {submitStatus === "error" && (
          <div className="error-message" role="alert">
            Sorry, there was an error sending your message. Please try again.
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ContactUs;