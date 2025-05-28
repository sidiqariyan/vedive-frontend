import React, { useContext, useState, useRef } from "react";
import axios from "axios";
import { Mail, Upload, HelpCircle, FileText, CheckCircle } from "lucide-react";
import { AuthContext } from "../Mailer/AuthContext.jsx";
import { Helmet } from 'react-helmet';

const GmailSender = () => {
  const { isLoggedIn } = useContext(AuthContext);

  const [gmail, setGmail] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [from, setFrom] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [contactsFile, setContactsFile] = useState(null);
  const [htmlFile, setHtmlFile] = useState(null);
  const [htmlTemplateName, setHtmlTemplateName] = useState("");
  const [recipientsFileName, setRecipientsFileName] = useState("");
  const [processedRecipients, setProcessedRecipients] = useState([]);
  const [hasNameColumn, setHasNameColumn] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const htmlTemplateRef = useRef(null);
  const recipientsFileRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Recipient File Selected:", file.name);
      setContactsFile(file);
      setRecipientsFileName(file.name);
      setIsProcessingFile(true);

      // Process file on the backend
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(
          "https://vedive.com:3000/api/process-file",
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setProcessedRecipients(response.data.recipients);
        setHasNameColumn(response.data.hasNameColumn);
        console.log(`File processed: ${response.data.totalRecipients} recipients found`);
        
        if (response.data.hasNameColumn) {
          alert(`File processed successfully! Found ${response.data.totalRecipients} recipients with names. You can use {{name}} in your email template for personalization.`);
        } else {
          alert(`File processed successfully! Found ${response.data.totalRecipients} email addresses.`);
        }
      } catch (error) {
        console.error("Error processing file:", error);
        alert(error.response?.data?.error || "Error processing file. Please check the file format.");
        setContactsFile(null);
        setRecipientsFileName("");
        setProcessedRecipients([]);
        setHasNameColumn(false);
      } finally {
        setIsProcessingFile(false);
      }
    } else {
      console.log("No recipient file selected.");
      setProcessedRecipients([]);
      setHasNameColumn(false);
    }
  };

  const handleHtmlFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const content = await file.text();
      console.log("HTML Template File Selected:", file.name);
      setBody(content);
      setHtmlTemplateName(file.name);
    }
    setHtmlFile(file);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("Please log in first to send emails.");
      window.location.href = "/login";
      return;
    }

    const campaignNameInput = prompt("Please name your campaign:");
    if (!campaignNameInput || campaignNameInput.trim() === "") {
      alert("Campaign name is required!");
      return;
    }

    if (!contactsFile) {
      alert("Please upload a contacts file.");
      return;
    }

    if (!htmlFile) {
      alert("Please upload an HTML file for the mail body.");
      return;
    }

    if (processedRecipients.length === 0) {
      alert("No valid recipients found in the uploaded file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('recipientsFile', contactsFile);
      formData.append('gmail', gmail);
      formData.append('appPassword', appPassword);
      formData.append('from', from);
      formData.append('subject', subject);
      formData.append('body', body);
      formData.append('campaignName', campaignNameInput);

      const response = await axios.post(
        "https://vedive.com:3000/api/send-gmail",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert(response.data.message || "Emails sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert(error.response?.data?.message || "Failed to send emails. Check the console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-0 sm:p-4 md:p-8">
      <Helmet>
        <title>Vedive Gmail Sender: Best Bulk Email Tool India</title>
        <meta name="description" content="Automate bulk email campaigns with Vedive's Gmail sender tool. Send emails via Gmail easily and boost leads in India with our marketing solution"/>
      </Helmet>
      <div className="mx-auto bg-white rounded-lg shadow-md border border-gray-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-b border-gray-300">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <Mail className="text-third" size={30} />
            <h1 className="text-2xl sm:text-3xl md:text-[40px] font-semibold text-gray-900">Gmail Sender</h1>
          </div>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
            <HelpCircle size={16} className="text-third" />
            <span>Need help?</span>
            <a href="#" className="text-third underline">
              Watch tutorial
            </a>
          </div>
        </div>
  
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* SMTP Configuration */}
          <div className="space-y-4 p-4 sm:p-6 border border-gray-300 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <Mail className="text-third" size={20} />
              <h2 className="text-lg font-medium text-gray-900">SMTP Configuration</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gmail Account</label>
                <input
                  type="email"
                  id="gmail"
                  placeholder="your@gmail.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-secondary"
                  value={gmail}
                  onChange={(e) => setGmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">App Password</label>
                <input
                  type="password"
                  id="appPassword"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-secondary"
                  value={appPassword}
                  onChange={(e) => setAppPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
  
          {/* Email Configuration */}
          <div className="space-y-4 p-4 sm:p-6 border border-gray-300 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <Mail className="text-third" size={20} />
              <h2 className="text-lg font-medium text-gray-900">Email Configuration</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
                <input
                  type="email"
                  id="from"
                  placeholder="sender@company.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-secondary"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Subject</label>
                <input
                  type="text"
                  id="subject"
                  placeholder="Enter email subject"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-secondary"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* File Processing Status */}
          {processedRecipients.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-green-600" size={20} />
                <h3 className="text-sm font-medium text-green-800">
                  Recipients Processed Successfully
                </h3>
              </div>
              <div className="mt-2 text-sm text-green-700">
                <p>• {processedRecipients.length} valid email addresses found</p>
                {hasNameColumn && (
                  <p>• Names detected - you can use {{`name`}} in your email template for personalization</p>
                )}
                <p>• File format validated and ready for sending</p>
              </div>
            </div>
          )}
  
          {/* Template and Recipients */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="space-y-4 p-4 sm:p-6 border border-gray-300 rounded-lg shadow-sm">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-2">
                  <Mail className="text-third" size={24} />
                </div>
                <h3 className="text-base font-medium text-gray-900">Email Template</h3>
                <p className="text-sm text-gray-500 mt-1">Upload your HTML template</p>
                {hasNameColumn && (
                  <p className="text-xs text-blue-600 mt-1">
                    💡 Use {{`name`}} for personalization
                  </p>
                )}
              </div>
              <button
                onClick={() => htmlTemplateRef.current.click()}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-third hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Choose Template
              </button>
              <input
                type="file"
                accept=".html"
                ref={htmlTemplateRef}
                onChange={handleHtmlFileChange}
                className="hidden"
              />
              {htmlTemplateName && (
                <p className="text-sm text-gray-600 text-center truncate">{htmlTemplateName}</p>
              )}
            </div>
  
            <div className="space-y-4 p-4 sm:p-6 border border-gray-300 rounded-lg shadow-sm">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-2">
                  <Upload className="text-third" size={24} />
                </div>
                <h3 className="text-base font-medium text-gray-900">Recipients List</h3>
                <div className="text-sm text-gray-500 mt-1 space-y-1">
                  <p>Supported formats:</p>
                  <div className="text-xs">
                    <p>• .txt - One email per line</p>
                    <p>• .csv/.xlsx - Must have "name" & "email" columns</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => recipientsFileRef.current.click()}
                disabled={isProcessingFile}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-third hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessingFile ? "Processing..." : "Choose File"}
              </button>
              <input
                type="file"
                accept=".txt,.csv,.xlsx"
                ref={recipientsFileRef}
                onChange={handleFileChange}
                className="hidden"
              />
              {recipientsFileName && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 truncate">{recipientsFileName}</p>
                  {processedRecipients.length > 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ {processedRecipients.length} recipients ready
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Anti-Spam Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <FileText className="text-blue-600" size={20} />
              <h3 className="text-sm font-medium text-blue-800">
                Anti-Spam Features Enabled
              </h3>
            </div>
            <div className="mt-2 text-sm text-blue-700">
              <p>• Emails sent in small batches with proper delays</p>
              <p>• Professional headers to avoid spam filters</p>
              <p>• Automatic name personalization when available</p>
              <p>• Rate limiting to maintain sender reputation</p>
            </div>
          </div>
  
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
              onClick={() => {
                setGmail("");
                setAppPassword("");
                setFrom("");
                setSubject("");
                setHtmlFile(null);
                setContactsFile(null);
                setHtmlTemplateName("");
                setRecipientsFileName("");
                setProcessedRecipients([]);
                setHasNameColumn(false);
              }}
            >
              Reset
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-third hover:bg-indigo-700 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSendEmail}
              disabled={processedRecipients.length === 0 || isProcessingFile}
            >
              Send Emails ({processedRecipients.length} recipients)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GmailSender;