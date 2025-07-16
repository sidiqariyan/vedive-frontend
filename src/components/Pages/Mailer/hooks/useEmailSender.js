import { useState } from 'react';
import { sendEmailToRecipient } from '../services/emailService';

export const useEmailSender = () => {
  const [formData, setFormData] = useState({
    smtpHost: '',
    smtpPort: '',
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: '',
    emailSubject: '',
    recipientsFile: null,
    htmlTemplate: null
  });
  
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [recipientsPreview, setRecipientsPreview] = useState([]);
  const [htmlTemplateName, setHtmlTemplateName] = useState(null);
  const [recipientsFileName, setRecipientsFileName] = useState(null);
  const [sendingStatus, setSendingStatus] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [completedEmails, setCompletedEmails] = useState(0);

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
    const campaignName = prompt('Please name your campaign:');
    if (!campaignName || campaignName.trim() === '') {
      alert('Campaign name is required!');
      return;
    }

    setIsSending(true);
    setCompletedEmails(0);
    setError(null);
    setSuccessMessage(null);
    setSendingStatus([]);

    try {
      // Read the template file content
      let templateContent = '';
      if (formData.htmlTemplate) {
        const reader = new FileReader();
        templateContent = await new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsText(formData.htmlTemplate);
        });
      }

      // Read recipients file content
      let recipientsList = [];
      if (formData.recipientsFile) {
        const reader = new FileReader();
        const recipientsContent = await new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsText(formData.recipientsFile);
        });
        recipientsList = recipientsContent
          .split('\n')
          .map((email) => email.trim())
          .filter((email) => email);
      }

      // Send emails to each recipient
      const results = [];
      for (let i = 0; i < recipientsList.length; i++) {
        const recipient = recipientsList[i];
        
        // Update status for current email
        setSendingStatus(prev => [
          ...prev.filter(s => s.email !== recipient),
          { email: recipient, status: 'Sending...', progress: 50 }
        ]);

        try {
          const success = await sendEmailToRecipient(
            recipient,
            formData.emailSubject,
            templateContent || 'Default message content'
          );

          if (success) {
            results.push({ email: recipient, status: 'Sent', success: true });
            setSendingStatus(prev => 
              prev.map(s => 
                s.email === recipient 
                  ? { ...s, status: 'Sent', progress: 100 }
                  : s
              )
            );
          } else {
            results.push({ email: recipient, status: 'Failed', success: false });
            setSendingStatus(prev => 
              prev.map(s => 
                s.email === recipient 
                  ? { ...s, status: 'Failed', progress: 0 }
                  : s
              )
            );
          }
        } catch (emailError) {
          results.push({ email: recipient, status: 'Failed', success: false });
          setSendingStatus(prev => 
            prev.map(s => 
              s.email === recipient 
                ? { ...s, status: 'Failed', progress: 0 }
                : s
            )
          );
        }

        setCompletedEmails(i + 1);
        
        // Add delay between emails to avoid overwhelming the server
        if (i < recipientsList.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;

      setSuccessMessage(
        `Campaign "${campaignName}" completed! ${successCount} emails sent successfully, ${failCount} failed.`
      );

    } catch (error) {
      setError(`Failed to send emails: ${error.message}`);
      // Mark all as failed in case of error
      const failedStatus = recipientsPreview.map(email => ({
        email,
        status: 'Failed',
        progress: 0
      }));
      setSendingStatus(failedStatus);
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = () => {
    setFormData({
      smtpHost: '',
      smtpPort: '',
      smtpUsername: '',
      smtpPassword: '',
      fromEmail: '',
      emailSubject: '',
      recipientsFile: null,
      htmlTemplate: null
    });
    setHtmlTemplateName(null);
    setRecipientsFileName(null);
    setRecipientsPreview([]);
    setSendingStatus([]);
    setError(null);
    setSuccessMessage(null);
    setCompletedEmails(0);
  };

  return {
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
  };
};