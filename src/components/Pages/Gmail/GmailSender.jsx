import React, { useContext, useState, useRef } from "react";
import axios from "axios";
import { Mail, Upload } from "lucide-react"; // Import icons for consistency
import { AuthContext } from "../Mailer/AuthContext.jsx"; // Ensure this path is correct

const GmailSender = () => {
  const { isLoggedIn } = useContext(AuthContext); // Access authentication state

  const [gmail, setGmail] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [from, setFrom] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [contactsFile, setContactsFile] = useState(null);
  const [htmlFile, setHtmlFile] = useState(null);
  const [htmlTemplateName, setHtmlTemplateName] = useState("");
  const [recipientsFileName, setRecipientsFileName] = useState("");

  const htmlTemplateRef = useRef(null);
  const recipientsFileRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Recipient File Selected:", file.name);
      setContactsFile(file);
      setRecipientsFileName(file.name);
    } else {
      console.log("No recipient file selected.");
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

    // Check if the user is logged in
    if (!isLoggedIn) {
      alert("Please log in first to send emails.");
      window.location.href = "/login"; // Redirect to login page
      return;
    }

    // Prompt user to enter campaign name
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

    try {
      const contacts = await contactsFile.text();
      console.log("Contacts File Content:", contacts); // Debugging

      // Make API request to send emails
      const response = await axios.post(
        "https://vedive.com:3000/api/send-gmail", // Replace with your backend endpoint
        {
          gmail,
          appPassword,
          from,
          subject,
          contacts: contacts.split("\n").map((email) => email.trim()),
          body,
          campaignName: campaignNameInput, // Include campaign name in the payload
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include JWT token
          },
        }
      );

      // Handle success
      alert(response.data.message || "Emails sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send emails. Check the console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto bg-white rounded-lg shadow-md border border-gray-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-300">
          <div className="flex items-center space-x-2">
            <Mail className="text-third" size={40} />
            <h1 className="text-[40px] font-semibold text-gray-900">Gmail Sender</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700">
              <Upload size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* SMTP Configuration */}
          <div className="space-y-4 p-6 border border-gray-300 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <Mail className="text-third" size={20} />
              <h2 className="text-lg font-medium text-gray-900">SMTP Configuration</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
          <div className="space-y-4 p-6 border border-gray-300 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <Mail className="text-third" size={20} />
              <h2 className="text-lg font-medium text-gray-900">Email Configuration</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
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

          {/* Template and Recipients */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4 p-6 border border-gray-300 rounded-lg shadow-sm">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-2">
                  <Mail className="text-third" size={24} />
                </div>
                <h3 className="text-base font-medium text-gray-900">Email Template</h3>
                <p className="text-sm text-gray-500 mt-1">Upload your HTML template</p>
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
                <p className="text-sm text-gray-600 text-center">{htmlTemplateName}</p>
              )}
            </div>

            <div className="space-y-4 p-6 border border-gray-300 rounded-lg shadow-sm">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-2">
                  <Upload className="text-third" size={24} />
                </div>
                <h3 className="text-base font-medium text-gray-900">Recipients List</h3>
                <p className="text-sm text-gray-500 mt-1">Upload CSV file with recipients</p>
              </div>
              <button
                onClick={() => recipientsFileRef.current.click()}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-third hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Choose File
              </button>
              <input
                type="file"
                accept=".txt,.csv"
                ref={recipientsFileRef}
                onChange={handleFileChange}
                className="hidden"
              />
              {recipientsFileName && (
                <p className="text-sm text-gray-600 text-center">{recipientsFileName}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setGmail("");
                setAppPassword("");
                setFrom("");
                setSubject("");
                setHtmlFile(null);
                setContactsFile(null);
                setHtmlTemplateName("");
                setRecipientsFileName("");
              }}
            >
              Reset
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-third hover:bg-indigo-700"
              onClick={handleSendEmail}
            >
              Send Emails
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GmailSender;