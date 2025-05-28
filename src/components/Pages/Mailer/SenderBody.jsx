import React, { useRef, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Mail, Upload, Settings, HelpCircle } from 'lucide-react';
import { Helmet } from 'react-helmet';

// Constants
const API_URL = process.env.REACT_APP_API_URL || 'https://vedive.com:3000';
const MAX_PREVIEW_EMAILS = 10;
const SUPPORTED_FILE_TYPES = {
  recipients: ['.txt', '.csv'],
  template: ['.html']
};

// Utility functions
const parseEmailFile = (content) => {
  return content
    .split(/[\n\r,;]+/)
    .map(email => email.trim())
    .filter(email => {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return email && emailRegex.test(email);
    });
};

const validateFormData = (formData, recipientsPreview) => {
  const errors = [];
  
  if (!formData.smtpHost?.trim()) errors.push('SMTP Host is required');
  if (!formData.smtpPort?.trim()) errors.push('SMTP Port is required');
  if (!formData.smtpUsername?.trim()) errors.push('Email is required');
  if (!formData.smtpPassword?.trim()) errors.push('Password is required');
  if (!formData.fromEmail?.trim()) errors.push('From Email is required');
  if (!formData.emailSubject?.trim()) errors.push('Email Subject is required');
  if (!formData.htmlTemplate) errors.push('HTML Template is required');
  if (!formData.recipientsFile) errors.push('Recipients file is required');
  if (recipientsPreview.length === 0) errors.push('No valid email addresses found in recipients file');
  
  return errors;
};

const getAuthToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.warn('localStorage not available:', error);
    return null;
  }
};

// Custom hooks
const useFileUpload = () => {
  const [files, setFiles] = useState({
    htmlTemplate: null,
    recipientsFile: null
  });
  
  const [fileNames, setFileNames] = useState({
    htmlTemplate: null,
    recipientsFile: null
  });

  const handleFileUpload = useCallback((file, fieldName, onRecipientsLoad) => {
    if (!file) return;

    setFiles(prev => ({ ...prev, [fieldName]: file }));
    setFileNames(prev => ({ ...prev, [fieldName]: file.name }));

    if (fieldName === 'recipientsFile' && onRecipientsLoad) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const emails = parseEmailFile(e.target.result);
        onRecipientsLoad(emails.slice(0, MAX_PREVIEW_EMAILS), emails.length);
      };
      reader.onerror = () => {
        console.error('Error reading file');
        onRecipientsLoad([], 0);
      };
      reader.readAsText(file);
    }
  }, []);

  const resetFiles = useCallback(() => {
    setFiles({ htmlTemplate: null, recipientsFile: null });
    setFileNames({ htmlTemplate: null, recipientsFile: null });
  }, []);

  return { files, fileNames, handleFileUpload, resetFiles };
};

function SenderBody() {
  // State management
  const [formData, setFormData] = useState({
    smtpHost: '',
    smtpPort: '',
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: '',
    emailSubject: ''
  });
  
  const [ui, setUi] = useState({
    error: null,
    successMessage: null,
    isSending: false,
    showValidation: false
  });
  
  const [recipients, setRecipients] = useState({
    preview: [],
    totalCount: 0
  });
  
  const [sendingStatus, setSendingStatus] = useState([]);
  const [completedEmails, setCompletedEmails] = useState(0);
  
  // File handling
  const { files, fileNames, handleFileUpload, resetFiles } = useFileUpload();
  
  // Refs
  const recipientsFileRef = useRef(null);
  const htmlTemplateRef = useRef(null);

  // Memoized validation
  const validationErrors = useMemo(() => {
    if (!ui.showValidation) return [];
    return validateFormData({ ...formData, ...files }, recipients.preview);
  }, [formData, files, recipients.preview, ui.showValidation]);

  const isFormValid = validationErrors.length === 0;

  // Event handlers
  const handleInputChange = useCallback((e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Clear error when user starts typing
    if (ui.error) {
      setUi(prev => ({ ...prev, error: null }));
    }
  }, [ui.error]);

  const handleRecipientsLoad = useCallback((emailsPreview, totalCount) => {
    setRecipients({ preview: emailsPreview, totalCount });
  }, []);

  const handleFileSelect = useCallback((ref, fieldName) => {
    const file = ref.current?.files[0];
    if (file) {
      handleFileUpload(file, fieldName, fieldName === 'recipientsFile' ? handleRecipientsLoad : null);
    }
  }, [handleFileUpload, handleRecipientsLoad]);

  const updateUI = useCallback((updates) => {
    setUi(prev => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      smtpHost: '',
      smtpPort: '',
      smtpUsername: '',
      smtpPassword: '',
      fromEmail: '',
      emailSubject: ''
    });
    resetFiles();
    setRecipients({ preview: [], totalCount: 0 });
    setSendingStatus([]);
    setCompletedEmails(0);
    updateUI({
      error: null,
      successMessage: null,
      showValidation: false
    });
    
    // Reset file inputs
    if (recipientsFileRef.current) recipientsFileRef.current.value = '';
    if (htmlTemplateRef.current) htmlTemplateRef.current.value = '';
  }, [resetFiles, updateUI]);

  const createFormData = useCallback((campaignName) => {
    const form = new FormData();
    
    // Add form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value) form.append(key, value);
    });
    
    // Add files
    Object.entries(files).forEach(([key, file]) => {
      if (file) form.append(key, file);
    });
    
    form.append('campaignName', campaignName);
    return form;
  }, [formData, files]);

  const handleSendMail = useCallback(async () => {
    // Show validation
    updateUI({ showValidation: true });
    
    if (!isFormValid) {
      updateUI({ error: `Please fix the following errors: ${validationErrors.join(', ')}` });
      return;
    }

    // Get campaign name
    const campaignName = prompt('Please name your campaign:');
    if (!campaignName?.trim()) {
      alert('Campaign name is required!');
      return;
    }

    // Check authentication
    const token = getAuthToken();
    if (!token) {
      updateUI({ error: 'Authentication token not found. Please login again.' });
      return;
    }

    // Start sending process
    updateUI({
      isSending: true,
      error: null,
      successMessage: null
    });
    
    setCompletedEmails(0);
    setSendingStatus([]);

    try {
      const form = createFormData(campaignName);
      
      const response = await axios.post(
        `${API_URL}/api/send-bulk-mail`,
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setSendingStatus([{ 
              email: 'Uploading files...', 
              status: 'Processing', 
              progress 
            }]);
          },
          timeout: 300000, // 5 minutes timeout
        }
      );

      if (response.data.success) {
        // Update status for all recipients
        const updatedStatus = recipients.preview.map(email => ({
          email,
          status: 'Sent',
          progress: 100
        }));
        
        setSendingStatus(updatedStatus);
        setCompletedEmails(recipients.totalCount);
        updateUI({
          successMessage: `Emails sent successfully to ${recipients.totalCount} recipients! Campaign ID: ${response.data.campaignId}`,
          isSending: false
        });
      } else {
        throw new Error(response.data.error || 'Failed to send emails');
      }
    } catch (error) {
      console.error('Send mail error:', error);
      
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred';
      updateUI({
        error: `Failed to send emails: ${errorMessage}`,
        isSending: false
      });
      
      // Mark preview emails as failed
      const failedStatus = recipients.preview.map(email => ({
        email,
        status: 'Failed',
        progress: 0
      }));
      setSendingStatus(failedStatus);
    }
  }, [isFormValid, validationErrors, updateUI, createFormData, recipients]);

  return (
    <div className="min-h-screen bg-gray-50 p-0 sm:p-4 md:p-8">
      <Helmet>
        <title>Best Bulk Email Sender: Vedive Bulk Email Sender & Scraper Tool</title>
        <meta name="description" content="Vedive's best email sender automates bulk campaigns & scrapes leads. Grow sales with Gmail-integrated tools in 2025. Start free now!" />
      </Helmet>
      
      <div className="mx-auto max-w-6xl bg-white rounded-lg shadow-md border border-gray-300">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-b border-gray-300">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <Mail className="text-third" size={30} />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">
              Mail Sender
            </h1>
          </div>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
            <HelpCircle size={16} className="text-third" />
            <span>Need help?</span>
            <a href="#" className="text-third underline hover:text-third-dark transition-colors">
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
              <div>
                <label htmlFor="smtpHost" className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Host *
                </label>
                <input
                  type="text"
                  id="smtpHost"
                  value={formData.smtpHost}
                  placeholder="smtp.gmail.com"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-third focus:border-transparent text-secondary transition-all ${
                    ui.showValidation && !formData.smtpHost.trim() ? 'border-red-300' : 'border-gray-300'
                  }`}
                  onChange={handleInputChange}
                  aria-describedby="smtpHost-error"
                />
              </div>
              <div>
                <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Port *
                </label>
                <input
                  type="text"
                  id="smtpPort"
                  value={formData.smtpPort}
                  placeholder="587"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-third focus:border-transparent text-secondary transition-all ${
                    ui.showValidation && !formData.smtpPort.trim() ? 'border-red-300' : 'border-gray-300'
                  }`}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="smtpUsername" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="smtpUsername"
                  value={formData.smtpUsername}
                  placeholder="your@email.com"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-third focus:border-transparent text-secondary transition-all ${
                    ui.showValidation && !formData.smtpUsername.trim() ? 'border-red-300' : 'border-gray-300'
                  }`}
                  onChange={handleInputChange}
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  id="smtpPassword"
                  value={formData.smtpPassword}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-third focus:border-transparent text-secondary transition-all ${
                    ui.showValidation && !formData.smtpPassword.trim() ? 'border-red-300' : 'border-gray-300'
                  }`}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                />
              </div>
            </div>
          </section>

          {/* Email Configuration */}
          <section className="space-y-4 p-4 sm:p-6 border border-gray-300 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <Mail className="text-third" size={20} />
              <h2 className="text-lg font-medium text-gray-900">Email Configuration</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fromEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  From Email *
                </label>
                <input
                  type="email"
                  id="fromEmail"
                  value={formData.fromEmail}
                  placeholder="sender@company.com"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-third focus:border-transparent text-secondary transition-all ${
                    ui.showValidation && !formData.fromEmail.trim() ? 'border-red-300' : 'border-gray-300'
                  }`}
                  onChange={handleInputChange}
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="emailSubject" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Subject *
                </label>
                <input
                  type="text"
                  id="emailSubject"
                  value={formData.emailSubject}
                  placeholder="Enter email subject"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-third focus:border-transparent text-secondary transition-all ${
                    ui.showValidation && !formData.emailSubject.trim() ? 'border-red-300' : 'border-gray-300'
                  }`}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </section>

          {/* Template and Recipients */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {/* Email Template */}
            <section className={`space-y-4 p-4 sm:p-6 border rounded-lg shadow-sm transition-all ${
              ui.showValidation && !files.htmlTemplate ? 'border-red-300' : 'border-gray-300'
            }`}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-third-light mb-2">
                  <Mail className="text-third" size={24} />
                </div>
                <h3 className="text-base font-medium text-gray-900">Email Template *</h3>
                <p className="text-sm text-gray-500 mt-1">Upload your HTML template</p>
              </div>
              <button
                type="button"
                onClick={() => htmlTemplateRef.current?.click()}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-third hover:bg-third-light focus:outline-none focus:ring-2 focus:ring-third focus:ring-offset-2 transition-all"
                disabled={ui.isSending}
              >
                Choose Template
              </button>
              <input
                type="file"
                accept={SUPPORTED_FILE_TYPES.template.join(',')}
                ref={htmlTemplateRef}
                onChange={() => handleFileSelect(htmlTemplateRef, 'htmlTemplate')}
                className="hidden"
                disabled={ui.isSending}
              />
              {fileNames.htmlTemplate && (
                <p className="text-sm text-gray-600 text-center truncate" title={fileNames.htmlTemplate}>
                  {fileNames.htmlTemplate}
                </p>
              )}
            </section>

            {/* Recipients List */}
            <section className={`space-y-4 p-4 sm:p-6 border rounded-lg shadow-sm transition-all ${
              ui.showValidation && !files.recipientsFile ? 'border-red-300' : 'border-gray-300'
            }`}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-third-light mb-2">
                  <Upload className="text-third" size={24} />
                </div>
                <h3 className="text-base font-medium text-gray-900">Recipients List *</h3>
                <p className="text-sm text-gray-500 mt-1">Upload .txt or .csv file with email addresses</p>
              </div>
              <button
                type="button"
                onClick={() => recipientsFileRef.current?.click()}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-third hover:bg-third-light focus:outline-none focus:ring-2 focus:ring-third focus:ring-offset-2 transition-all"
                disabled={ui.isSending}
              >
                Choose File
              </button>
              <input
                type="file"
                accept={SUPPORTED_FILE_TYPES.recipients.join(',')}
                ref={recipientsFileRef}
                onChange={() => handleFileSelect(recipientsFileRef, 'recipientsFile')}
                className="hidden"
                disabled={ui.isSending}
              />
              {fileNames.recipientsFile && (
                <>
                  <p className="text-sm text-gray-600 text-center truncate" title={fileNames.recipientsFile}>
                    {fileNames.recipientsFile}
                  </p>
                  {recipients.totalCount > 0 && (
                    <p className="text-xs text-green-600 text-center">
                      {recipients.totalCount} valid email{recipients.totalCount !== 1 ? 's' : ''} found
                    </p>
                  )}
                </>
              )}
            </section>
          </div>

          {/* Recipients Preview */}
          {recipients.preview.length > 0 && (
            <section className="space-y-2 p-4 border border-gray-300 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900">Recipients Preview</h3>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {recipients.preview.map((email, index) => (
                  <div key={index} className="text-xs text-gray-600 px-2 py-1 bg-gray-50 rounded">
                    {email}
                  </div>
                ))}
              </div>
              {recipients.totalCount > MAX_PREVIEW_EMAILS && (
                <p className="text-xs text-gray-500">
                  ...and {recipients.totalCount - MAX_PREVIEW_EMAILS} more recipients
                </p>
              )}
            </section>
          )}

          {/* Validation Errors */}
          {ui.showValidation && validationErrors.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-300 rounded-lg">
              <h3 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h3>
              <ul className="text-sm text-red-600 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Status Messages */}
          {ui.error && (
            <div className="p-4 bg-red-50 border border-red-300 rounded-lg" role="alert">
              <p className="text-sm text-red-600">{ui.error}</p>
            </div>
          )}

          {ui.successMessage && (
            <div className="p-4 bg-green-50 border border-green-300 rounded-lg" role="status">
              <p className="text-sm text-green-600">{ui.successMessage}</p>
            </div>
          )}

          {/* Sending Status */}
          {sendingStatus.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900">Sending Status</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {sendingStatus.map((status, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 border border-gray-300 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0"
                  >
                    <span className="text-sm text-gray-700 truncate max-w-full sm:max-w-xs md:max-w-md" title={status.email}>
                      {status.email}
                    </span>
                    <div className="flex items-center w-full sm:w-auto">
                      <span className={`text-sm mr-2 ${
                        status.status === 'Sent' ? 'text-green-600' : 
                        status.status === 'Failed' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {status.status}
                      </span>
                      <div className="w-full sm:w-24 bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            status.status === 'Sent' ? 'bg-green-500' :
                            status.status === 'Failed' ? 'bg-red-500' : 'bg-third'
                          }`}
                          style={{ width: `${status.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={resetForm}
              disabled={ui.isSending}
            >
              Reset
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-lg text-sm font-medium text-white w-full sm:w-auto transition-all duration-200 ${
                ui.isSending
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-third hover:bg-third-dark active:scale-95 shadow-lg hover:shadow-xl'
              }`}
              onClick={handleSendMail}
              disabled={ui.isSending}
            >
              {ui.isSending ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Emails...
                </span>
              ) : (
                'Send Emails'
              )}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SenderBody;