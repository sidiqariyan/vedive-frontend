import React, { useContext, useState, useRef, useCallback, useMemo } from "react";
import axios from "axios";
import { Mail, Upload, HelpCircle, Settings } from "lucide-react";
import { AuthContext } from "../Mailer/AuthContext.jsx";
import { Helmet } from 'react-helmet';

// Constants
const API_ENDPOINT = "https://vedive.com:3000/api/send-gmail";
const ACCEPTED_FILE_TYPES = {
  html: ".html",
  recipients: ".txt,.csv"
};

// Custom hook for form management
const useFormState = () => {
  const [formData, setFormData] = useState({
    gmail: "",
    appPassword: "",
    from: "",
    subject: "",
    body: "",
    htmlTemplateName: "",
    recipientsFileName: ""
  });

  const [files, setFiles] = useState({
    contacts: null,
    html: null
  });

  const updateFormData = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateFiles = useCallback((type, file) => {
    setFiles(prev => ({ ...prev, [type]: file }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      gmail: "",
      appPassword: "",
      from: "",
      subject: "",
      body: "",
      htmlTemplateName: "",
      recipientsFileName: ""
    });
    setFiles({
      contacts: null,
      html: null
    });
  }, []);

  return {
    formData,
    files,
    updateFormData,
    updateFiles,
    resetForm
  };
};

// Custom hook for file handling
const useFileHandlers = (updateFormData, updateFiles) => {
  const handleContactsFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log("No recipient file selected.");
      return;
    }

    console.log("Recipient File Selected:", file.name);
    updateFiles('contacts', file);
    updateFormData('recipientsFileName', file.name);
  }, [updateFiles, updateFormData]);

  const handleHtmlFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      console.log("HTML Template File Selected:", file.name);
      
      updateFormData('body', content);
      updateFormData('htmlTemplateName', file.name);
      updateFiles('html', file);
    } catch (error) {
      console.error("Error reading HTML file:", error);
      alert("Error reading HTML file. Please try again.");
    }
  }, [updateFiles, updateFormData]);

  return {
    handleContactsFileChange,
    handleHtmlFileChange
  };
};

// Validation utilities
const validateForm = (formData, files) => {
  const { gmail, appPassword, from, subject } = formData;
  const { contacts, html } = files;

  if (!gmail || !appPassword || !from || !subject) {
    return "Please fill in all required fields.";
  }

  if (!contacts) {
    return "Please upload a contacts file.";
  }

  if (!html) {
    return "Please upload an HTML file for the mail body.";
  }

  return null;
};

const processContacts = async (contactsFile) => {
  try {
    const contacts = await contactsFile.text();
    return contacts.split("\n")
      .map(email => email.trim())
      .filter(email => email.length > 0);
  } catch (error) {
    throw new Error("Failed to process contacts file");
  }
};

// Main component
const GmailSender = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    formData,
    files,
    updateFormData,
    updateFiles,
    resetForm
  } = useFormState();

  const {
    handleContactsFileChange,
    handleHtmlFileChange
  } = useFileHandlers(updateFormData, updateFiles);

  const htmlTemplateRef = useRef(null);
  const recipientsFileRef = useRef(null);

  // Memoized computed values
  const isFormValid = useMemo(() => {
    return validateForm(formData, files) === null;
  }, [formData, files]);

  const handleSendEmail = useCallback(async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("Please log in first to send emails.");
      window.location.href = "/login";
      return;
    }

    const validationError = validateForm(formData, files);
    if (validationError) {
      alert(validationError);
      return;
    }

    const campaignName = prompt("Please name your campaign:")?.trim();
    if (!campaignName) {
      alert("Campaign name is required!");
      return;
    }

    setIsLoading(true);
    
    try {
      const processedContacts = await processContacts(files.contacts);
      
      const response = await axios.post(
        API_ENDPOINT,
        {
          gmail: formData.gmail,
          appPassword: formData.appPassword,
          from: formData.from,
          subject: formData.subject,
          contacts: processedContacts,
          body: formData.body,
          campaignName
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      alert(response.data.message || "Emails sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      const errorMessage = error.response?.data?.message || "Failed to send emails. Check the console for details.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, formData, files]);

  // Input field component for reusability
  const InputField = useCallback(({ label, type, id, placeholder, value, onChange, required = false }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-secondary"
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        required={required}
        disabled={isLoading}
      />
    </div>
  ), [isLoading]);

  // File upload component for reusability
  const FileUploadCard = useCallback(({ title, description, fileName, onButtonClick, icon: Icon }) => (
    <div className="space-y-4 p-4 sm:p-6 border border-gray-300 rounded-lg shadow-sm">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-2">
          <Icon className="text-third" size={24} />
        </div>
        <h3 className="text-base font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <button
        onClick={onButtonClick}
        disabled={isLoading}
        className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-third hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {fileName ? "Change File" : `Choose ${title}`}
      </button>
      {fileName && (
        <p className="text-sm text-gray-600 text-center truncate" title={fileName}>
          {fileName}
        </p>
      )}
    </div>
  ), [isLoading]);

  return (
    <div className="min-h-screen bg-gray-50 p-0 sm:p-4 md:p-8">
      <Helmet>
        <title>Vedive Gmail Sender: Best Bulk Email Tool India</title>
        <meta 
          name="description" 
          content="Automate bulk email campaigns with Vedive's Gmail sender tool. Send emails via Gmail easily and boost leads in India with our marketing solution"
        />
      </Helmet>
      
      <div className="mx-auto bg-white rounded-lg shadow-md border border-gray-300">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-b border-gray-300">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <Mail className="text-third" size={30} />
            <h1 className="text-2xl sm:text-3xl md:text-[40px] font-semibold text-gray-900">
              Gmail Sender
            </h1>
          </div>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
            <HelpCircle size={16} className="text-third" />
            <span>Need help?</span>
            <a href="#" className="text-third underline hover:text-indigo-800">
              Watch tutorial
            </a>
          </div>
        </header>

        <main className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* SMTP Configuration */}
          <section className="space-y-4 p-4 sm:p-6 border border-gray-300 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <Settings className="text-third" size={20} />
              <h2 className="text-lg font-medium text-gray-900">SMTP Configuration</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Gmail Account"
                type="email"
                id="gmail"
                placeholder="your@gmail.com"
                value={formData.gmail}
                onChange={updateFormData}
                required
              />
              <InputField
                label="App Password"
                type="password"
                id="appPassword"
                placeholder="••••••••"
                value={formData.appPassword}
                onChange={updateFormData}
                required
              />
            </div>
          </section>

          {/* Email Configuration */}
          <section className="space-y-4 p-4 sm:p-6 border border-gray-300 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <Mail className="text-third" size={20} />
              <h2 className="text-lg font-medium text-gray-900">Email Configuration</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="From Email"
                type="email"
                id="from"
                placeholder="sender@company.com"
                value={formData.from}
                onChange={updateFormData}
                required
              />
              <InputField
                label="Email Subject"
                type="text"
                id="subject"
                placeholder="Enter email subject"
                value={formData.subject}
                onChange={updateFormData}
                required
              />
            </div>
          </section>

          {/* Template and Recipients */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <FileUploadCard
              title="Email Template"
              description="Upload your HTML template"
              fileName={formData.htmlTemplateName}
              onButtonClick={() => htmlTemplateRef.current?.click()}
              icon={Mail}
            />
            
            <FileUploadCard
              title="Recipients List"
              description="Upload .txt file with recipients"
              fileName={formData.recipientsFileName}
              onButtonClick={() => recipientsFileRef.current?.click()}
              icon={Upload}
            />
          </section>

          {/* Hidden file inputs */}
          <input
            type="file"
            accept={ACCEPTED_FILE_TYPES.html}
            ref={htmlTemplateRef}
            onChange={handleHtmlFileChange}
            className="hidden"
          />
          <input
            type="file"
            accept={ACCEPTED_FILE_TYPES.recipients}
            ref={recipientsFileRef}
            onChange={handleContactsFileChange}
            className="hidden"
          />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={resetForm}
              disabled={isLoading}
            >
              Reset
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-third hover:bg-indigo-700 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSendEmail}
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? "Sending..." : "Send Emails"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GmailSender;