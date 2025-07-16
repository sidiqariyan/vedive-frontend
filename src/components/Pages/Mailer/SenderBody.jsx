import React, { useRef, useState } from 'react';
import { Mail, HelpCircle } from 'lucide-react';
import EmailConfiguration from './components/EmailConfiguration';
import TemplateAndRecipients from './components/TemplateAndRecipients';
import RecipientsPreview from './components/RecipientsPreview';
import ActionButtons from './components/ActionButtons';
import StatusMessages from './components/StatusMessages';
import { useEmailSender } from './hooks/useEmailSender';

function SenderBody() {
  const {
    formData,
    error,
    successMessage,
    recipientsPreview,
    htmlTemplateName,
    recipientsFileName,
    sendingStatus,
    isSending,
    completedEmails,
    handleInputChange,
    handleFileUpload,
    handleSendMail,
    handleReset,
    setHtmlTemplateName,
    setRecipientsFileName,
    setRecipientsPreview
  } = useEmailSender();

  const recipientsFileRef = useRef(null);
  const htmlTemplateRef = useRef(null);

  return (
    <div className="min-h-screen bg-gray-50 p-0 sm:p-4 md:p-8">
      <div className="mx-auto bg-white rounded-lg shadow-md border border-gray-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-b border-gray-300">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <Mail className="text-blue-600" size={30} />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">Mail Sender</h1>
          </div>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
            <HelpCircle size={16} className="text-blue-600" />
            <span>Need help?</span>
            <a href="https://www.youtube.com/watch?v=BFSjAnZey-8&ab_channel=Vedive" className="text-blue-600 underline">
              Watch tutorial
            </a>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* Email Configuration */}
          <EmailConfiguration 
            formData={formData}
            onInputChange={handleInputChange}
          />

          {/* Template and Recipients */}
          <TemplateAndRecipients
            htmlTemplateName={htmlTemplateName}
            recipientsFileName={recipientsFileName}
            htmlTemplateRef={htmlTemplateRef}
            recipientsFileRef={recipientsFileRef}
            onFileUpload={handleFileUpload}
            setHtmlTemplateName={setHtmlTemplateName}
            setRecipientsFileName={setRecipientsFileName}
            setRecipientsPreview={setRecipientsPreview}
          />

          {/* Recipients Preview */}
          {recipientsPreview.length > 0 && (
            <RecipientsPreview recipientsPreview={recipientsPreview} />
          )}

          {/* Action Buttons */}
          <ActionButtons
            isSending={isSending}
            formData={formData}
            onSendMail={handleSendMail}
            onReset={handleReset}
          />

          {/* Status Messages */}
          <StatusMessages
            error={error}
            successMessage={successMessage}
            sendingStatus={sendingStatus}
            completedEmails={completedEmails}
          />
        </div>
      </div>
    </div>
  );
}

export default SenderBody;