import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Mail, Upload, Settings, HelpCircle, ExternalLink, Search } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

function SenderBody() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [recipientsPreview, setRecipientsPreview] = useState([]);
  const [htmlTemplateName, setHtmlTemplateName] = useState(null);
  const [recipientsFileName, setRecipientsFileName] = useState(null);
  const [sendingStatus, setSendingStatus] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [completedEmails, setCompletedEmails] = useState(0);
  const recipientsFileRef = useRef(null);
  const htmlTemplateRef = useRef(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleFileUpload = (ref, fieldName) => {
    const file = ref.current.files[0];
    if (file) {
      setFormData({
        ...formData,
        [fieldName]: file,
      });
      if (fieldName === 'recipientsFile') {
        setRecipientsFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
          const emails = e.target.result
            .split('\n')
            .map((email) => email.trim())
            .filter((email) => email);
          setRecipientsPreview(emails.slice(0, 5));
        };
        reader.readAsText(file);
      } else if (fieldName === 'htmlTemplate') {
        setHtmlTemplateName(file.name);
      }
    }
  };

  const handleSendMail = async () => {
    const campaignNameInput = prompt('Please name your campaign:');
    if (!campaignNameInput || campaignNameInput.trim() === '') {
      alert('Campaign name is required!');
      return;
    }
    setIsSending(true);
    setCompletedEmails(0);
    setError(null);
    setSuccessMessage(null);
    setSendingStatus([]); // Reset status before starting new batch
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });
    form.append('campaignName', campaignNameInput);
    try {
      // Get authentication token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }
      const response = await axios.post(
        'https://vedive.com:3000/api/send-bulk-mail',
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`, // Add authentication token
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setSendingStatus([{ email: 'Uploading files...', status: 'Processing', progress }]);
          },
        }
      );
      if (response.data.success) {
        // Display all recipient emails with "Sent" status
        const updatedStatus = recipientsPreview.map(email => ({
          email,
          status: 'Sent',
          progress: 100
        }));
        setSendingStatus(updatedStatus);
        setCompletedEmails(recipientsPreview.length);
        setSuccessMessage(`Emails sent successfully! Campaign ID: ${response.data.campaignId}`);
      } else {
        throw new Error(response.data.error || 'Failed to send emails');
      }
      setIsSending(false);
    } catch (error) {
      const errorMessage = error.response ? error.response.data.error : error.message;
      setError(`Failed to send emails: ${errorMessage}`);
      setIsSending(false);
      // Mark all as failed in case of error
      const failedStatus = recipientsPreview.map(email => ({
        email,
        status: 'Failed',
        progress: 0
      }));
      setSendingStatus(failedStatus);
    }
  };

  const handleTemplateRedirect = () => {
    navigate('/templates');
  };

  const handleScraperRedirect = () => {
    navigate('/email-scraper');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-0 sm:p-4 md:p-8">
        <Helmet>
      <title>Best Bulk Email Sender: Vedive Bulk Email Sender & Scraper Tool</title>
      <meta name="description" content="Vedive's best email sender automates bulk campaigns & scrapes leads. Grow sales with Gmail-integrated tools in 2025. Start free now!"/>
      </Helmet>
      <div className="mx-auto bg-white rounded-lg shadow-md border border-gray-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-b border-gray-300">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <Mail className="text-third" size={30} />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">Mail Sender</h1>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                <input
                  type="text"
                  id="smtpHost"
                  placeholder="smtp.example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-third focus:border-transparent text-secondary"
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                <input
                  type="text"
                  id="smtpPort"
                  placeholder="587"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-third focus:border-transparent text-secondary"
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="smtpUsername"
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-third focus:border-transparent text-secondary"
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  id="smtpPassword"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-third focus:border-transparent text-secondary"
                  onChange={handleInputChange}
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
                  id="fromEmail"
                  placeholder="sender@company.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-third focus:border-transparent text-secondary"
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Subject</label>
                <input
                  type="text"
                  id="emailSubject"
                  placeholder="Enter email subject"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-third focus:border-transparent text-secondary"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          {/* Template and Recipients */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {/* Email Template Section */}
            <div className="space-y-4 p-4 sm:p-6 border border-gray-300 rounded-lg shadow-sm">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-third-light mb-2">
                  <Mail className="text-third" size={24} />
                </div>
                <h3 className="text-base font-medium text-gray-900">Email Template</h3>
                <p className="text-sm text-gray-500 mt-1">Upload HTML, HTM, or TXT templates</p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => htmlTemplateRef.current.click()}
                  className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-third hover:bg-third-light focus:outline-none focus:ring-2 focus:ring-third focus:ring-offset-2"
                >
                  Choose Template
                </button>
                <button
                  onClick={handleTemplateRedirect}
                  className="w-full py-2 px-4 bg-third text-white rounded-lg text-sm font-medium hover:bg-third-dark focus:outline-none focus:ring-2 focus:ring-third focus:ring-offset-2 flex items-center justify-center space-x-2"
                >
                  <ExternalLink size={16} />
                  <span>Browse Templates</span>
                </button>
              </div>
              <input
                type="file"
                accept=".html,.htm,.txt"
                ref={htmlTemplateRef}
                onChange={() => handleFileUpload(htmlTemplateRef, 'htmlTemplate')}
                className="hidden"
              />
              {htmlTemplateName && (
                <p className="text-sm text-gray-600 text-center truncate">{htmlTemplateName}</p>
              )}
            </div>
            
            {/* Recipients List Section */}
            <div className="space-y-4 p-4 sm:p-6 border border-gray-300 rounded-lg shadow-sm">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-third-light mb-2">
                  <Upload className="text-third" size={24} />
                </div>
                <h3 className="text-base font-medium text-gray-900">Recipients List</h3>
                <p className="text-sm text-gray-500 mt-1">Upload TXT, CSV, or XLSX files</p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => recipientsFileRef.current.click()}
                  className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-third hover:bg-third-light focus:outline-none focus:ring-2 focus:ring-third focus:ring-offset-2"
                >
                  Choose File
                </button>
                <button
                  onClick={handleScraperRedirect}
                  className="w-full py-2 px-4 bg-third text-white rounded-lg text-sm font-medium hover:bg-third-dark focus:outline-none focus:ring-2 focus:ring-third focus:ring-offset-2 flex items-center justify-center space-x-2"
                >
                  <Search size={16} />
                  <span>Scrape Emails</span>
                </button>
              </div>
              <input
                type="file"
                accept=".txt,.csv,.xlsx"
                ref={recipientsFileRef}
                onChange={() => handleFileUpload(recipientsFileRef, 'recipientsFile')}
                className="hidden"
              />
              {recipientsFileName && (
                <p className="text-sm text-gray-600 text-center truncate">{recipientsFileName}</p>
              )}
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
              onClick={() => {
                setFormData({});
                setHtmlTemplateName(null);
                setRecipientsFileName(null);
                setRecipientsPreview([]);
                setSendingStatus([]);
                setError(null);
                setSuccessMessage(null);
              }}
            >
              Reset
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium text-white w-full sm:w-auto ${
                isSending
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-third hover:bg-third-dark'
              }`}
              onClick={handleSendMail}
              disabled={isSending}
            >
              {isSending ? 'Sending Emails...' : 'Send Emails'}
            </button>
          </div>
          {/* Status Messages */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          {successMessage && (
            <div className="mt-4 p-4 bg-green-50 border border-green-300 rounded-lg">
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          )}
          {sendingStatus.length > 0 && (
            <div className="mt-4 space-y-2">
              {sendingStatus.map((status, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 border border-gray-300 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0"
                >
                  <span className="text-sm text-gray-700 truncate max-w-full sm:max-w-xs md:max-w-md">{status.email}</span>
                  <div className="flex items-center w-full sm:w-auto">
                    <span className="text-sm text-gray-600 mr-2">{status.status}</span>
                    <div className="w-full sm:w-24 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-third h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${status.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SenderBody;