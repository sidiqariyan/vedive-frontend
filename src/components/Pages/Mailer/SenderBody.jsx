import React, { useRef, useState } from 'react';
import axios from 'axios';

function SenderBody() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [recipientsPreview, setRecipientsPreview] = useState([]);
  const [htmlTemplateName, setHtmlTemplateName] = useState(null);
  const [recipientsFileName, setRecipientsFileName] = useState(null);
  const [sendingStatus, setSendingStatus] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [completedEmails, setCompletedEmails] = useState(0);

  // Refs for file inputs
  const recipientsFileRef = useRef(null);
  const htmlTemplateRef = useRef(null);

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Handle file uploads
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
          setRecipientsPreview(emails.slice(0, 5)); // Preview first 5 emails
        };
        reader.readAsText(file);
      } else if (fieldName === 'htmlTemplate') {
        setHtmlTemplateName(file.name);
      }
    }
  };

  // Handle sending emails
  const handleSendMail = async () => {
    // Prompt user to enter campaign name
    const campaignNameInput = prompt('Please name your campaign:');
    if (!campaignNameInput || campaignNameInput.trim() === '') {
      alert('Campaign name is required!');
      return;
    }

    setIsSending(true);
    setCompletedEmails(0);
    setError(null);
    setSuccessMessage(null);

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    // Add campaign name to the form data
    form.append('campaignName', campaignNameInput);

    const recipients = recipientsPreview; // Should get all recipients here

    try {
      for (let i = 0; i < recipients.length; i++) {
        const email = recipients[i];
        setSendingStatus((prevState) => [
          ...prevState,
          { email, status: 'Sending', progress: 0 },
        ]);

        const response = await axios.post(
          'http://localhost:3000/api/send-bulk-mail',
          form,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setSendingStatus((prevState) => {
                const updatedStatus = [...prevState];
                updatedStatus[i].progress = progress;
                return updatedStatus;
              });
            },
          }
        );

        setSendingStatus((prevState) => {
          const updatedStatus = [...prevState];
          updatedStatus[i].status = response.data.success ? 'Sent' : 'Failed';
          return updatedStatus;
        });

        setCompletedEmails(i + 1);
      }

      setIsSending(false);
      setSuccessMessage('Emails sent successfully!');
    } catch (error) {
      const errorMessage = error.response ? error.response.data : error.message;
      setError(`Failed to send emails: ${errorMessage}`);
      setIsSending(false);
    }
  };

  return (
    <div className="bg-[#121212] p-4 border rounded-lg top-4 -ml-8">
      <h3 className="text-[32px] font-semibold font-primary mb-4 -mt-4 flex justify-center text-primary[!important]">
        Mail Sender
      </h3>

      {/* SMTP Configuration Fields */}
      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex">
            <label htmlFor="smtpHost" className="block font-secondary text-[14px] mt-1 ml-10 text-primary">
              SMTP Host:
            </label>
            <input
              type="text"
              id="smtpHost"
              className="border-gray-300 border p-1 rounded-md ml-2 text-secondary"
              style={{ height: '30px' }}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex">
            <label htmlFor="smtpPort" className="block font-secondary text-[14px] mt-1 ml-8 text-primary">
              SMTP Port:
            </label>
            <input
              type="text"
              id="smtpPort"
              className="border-gray-300 border p-1 rounded-md ml-4 text-secondary"
              style={{ height: '30px' }}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex">
            <label htmlFor="smtpUsername" className="block font-secondary text-[14px] mt-1 text-primary ml-[70px]">
              Email:
            </label>
            <input
              type="text"
              id="smtpUsername"
              className="border-gray-300 border p-1 rounded-md ml-3 text-secondary"
              style={{ height: '30px' }}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex">
            <label htmlFor="smtpPassword" className="block font-secondary text-[14px] mt-1 text-primary ml-10">
              Password:
            </label>
            <input
              type="password"
              id="smtpPassword"
              className="border-gray-300 border p-1 rounded-md ml-3 text-secondary"
              style={{ height: '30px' }}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/* Email Body and Recipients Section */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex">
            <label htmlFor="fromEmail" className="block font-secondary text-[14px] mt-1 ml-8 text-primary">
              From Email:
            </label>
            <input
              type="email"
              id="fromEmail"
              className="border-gray-300 border p-1 rounded-md ml-3 text-secondary"
              style={{ height: '30px' }}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex">
            <label htmlFor="emailSubject" className="block font-secondary text-[14px] mt-1 text-primary ml-4">
              Email Subject:
            </label>
            <input
              type="text"
              id="emailSubject"
              className="border-gray-300 border p-1 rounded-md ml-3 text-secondary"
              style={{ height: '30px' }}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div className="flex mt-6">
            <label htmlFor="emailBody" className="block font-secondary text-[14px] mt-1 ml-8 text-primary">
              Email Body:
            </label>
            <div className="mb-6">
              <div className="flex items-center gap-4">
                <button className="bg-black text-white px-3 py-2 rounded-md text-[12px] ml-3">
                  Search Template
                </button>
                <button
                  className="bg-third text-primary px-3 py-2 rounded-md text-[12px] text-primary"
                  onClick={() => htmlTemplateRef.current.click()}
                >
                  Upload Template
                </button>
                {htmlTemplateName && <span className="text-primary text-sm">{htmlTemplateName}</span>}
                <input
                  type="file"
                  accept=".html"
                  ref={htmlTemplateRef}
                  onChange={() => handleFileUpload(htmlTemplateRef, 'htmlTemplate')}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label htmlFor="recipientList" className="block font-secondary text-[14px] text-primary">
              Upload Recipients (.txt file):
            </label>
            <button
              className="bg-secondary text-primary px-3 py-2 rounded-md text-[12px]"
              onClick={() => recipientsFileRef.current.click()}
            >
              Scrap Emails
            </button>
            <button
              className="bg-third text-primary px-3 py-2 rounded-md text-[12px]"
              onClick={() => recipientsFileRef.current.click()}
            >
              Upload Recipient
            </button>
            {recipientsFileName && <span className="text-primary text-sm">{recipientsFileName}</span>}
            <input
              type="file"
              accept=".txt"
              ref={recipientsFileRef}
              onChange={() => handleFileUpload(recipientsFileRef, 'recipientsFile')}
              id="recipientList"
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* Send Mail Button */}
      <div className="text-center mt-12">
        <button
          className="bg-third text-[16px] text-primary px-10 py-2 rounded-md font-secondary"
          onClick={handleSendMail}
          disabled={isSending}
        >
          {isSending ? 'Sending...' : 'Send Mail'}
        </button>
      </div>

      {/* Inline Feedback */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
      {isSending && (
        <div className="mt-4">
          {sendingStatus.map((status, index) => (
            <div key={index} className="mb-2">
              <p>
                {status.email}: {status.status} - {status.progress}%
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SenderBody;