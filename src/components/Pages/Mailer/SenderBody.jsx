import React, { useRef, useState } from 'react';
import axios from 'axios';

function SenderBody() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [recipientsPreview, setRecipientsPreview] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
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
          const emails = e.target.result.split('\n').map(email => email.trim()).filter(email => email);
          setRecipientsPreview(emails.slice(0, 5)); // Preview first 5 emails
        };
        reader.readAsText(file);
      } else if (fieldName === 'htmlTemplate') {
        setHtmlTemplateName(file.name);
      }
    }
  };

  const handleSendMail = async () => {
    setShowPopup(true);
    setIsSending(true);
    setCompletedEmails(0);
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    const recipients = recipientsPreview; // Should get all recipients here

    try {
      for (let i = 0; i < recipients.length; i++) {
        const email = recipients[i];
        setSendingStatus((prevState) => [
          ...prevState,
          { email, status: 'Sending', progress: 0 },
        ]);

        const response = await axios.post(
          "http://localhost:3000/api/send-bulk-mail",
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
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
      setSuccessMessage("Emails sent successfully!");
      setError(null);
    } catch (error) {
      const errorMessage = error.response ? error.response.data : error.message;
      setError(`Failed to send emails: ${errorMessage}`);
      setIsSending(false);
    }
  };

  return (
    <div className="bg-[#121212] p-4 border rounded-lg absolute bottom-3 -ml-8">
      
      <div className='flex justify-end border-b-white'>
        <h4 className="flex font-secondary mb-2 text-primary text-[12px]">
          SMTP Configuration:{" "}
          <span className="text-primary flex  text-base mt-1">
            <svg className="mr-2 ml-2" width="12" height="15" viewBox="0 0 20 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="12.069" r="10" fill="#FFE100" />
              <path d="M9.63863 7.45658C9.35173 7.45658 9.10897 7.35727 8.91035 7.15865C8.71173 6.96003 8.61242 6.71727 8.61242 6.43037C8.61242 6.14348 8.71173 5.90072 8.91035 5.7021C9.10897 5.50348 9.35173 5.40417 9.63863 5.40417C9.91449 5.40417 10.1462 5.50348 10.3338 5.7021C10.5324 5.90072 10.6317 6.14348 10.6317 6.43037C10.6317 6.71727 10.5324 6.96003 10.3338 7.15865C10.1462 7.35727 9.91449 7.45658 9.63863 7.45658ZM10.3669 8.92969V18H8.86069V8.92969H10.3669Z" fill="#0F0E0D" />
            </svg>
            <span className='text-[12px] mt-[-4px]' >How to do? (</span>
            <a href="#" className="underline text-third text-[12px] mt-[-4px]">
              Click Here - Video
            </a>{" "}
            <span className='text-[12px] mt-[-4px]' >)</span>
          </span>
        </h4>
        <hr />
      </div>

      <h3 className="text-[32px] font-semibold font-primary mb-4 -mt-4 flex justify-center text-primary">Mail Sender</h3>

      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex">
            <label htmlFor="smtpHost" className="block font-secondary text-[14px] mt-1 ml-10 text-primary">
              SMTP Host:{" "}
            </label>
            <input
              type="text"
              id="smtpHost"
              className="border-gray-300 border p-1 rounded-md ml-2 text-secondary" style={{ height: "30px" }}
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
              className="border-gray-300 border p-1 rounded-md ml-4 text-secondary" style={{ height: "30px" }}
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
              className="border-gray-300 border p-1 rounded-md ml-3 text-secondary" style={{ height: "30px" }}
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
              className="border-gray-300 border p-1 rounded-md ml-3 text-secondary" style={{ height: "30px" }}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex">
            <label htmlFor="fromEmail" className="block font-secondary text-[14px] mt-1 ml-8 text-primary">
              From Email:
            </label>
            <input
              type="email"
              id="fromEmail"
              className="border-gray-300 border p-1 rounded-md ml-3 text-secondary" style={{ height: "30px" }}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex">
            <label htmlFor="emailSubject" className="block font-secondary text-[14px] mt-1 ml-4 text-primary">
              Email Subject:
            </label>
            <input
              type="text"
              id="emailSubject"
              className="border-gray-300 border p-1 rounded-md ml-3 text-secondary" style={{ height: "30px" }}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div className='flex mt-6'>
          <label htmlFor="emailBody" className="block font-secondary text-[14px] mt-1 ml-8 text-primary">
            Email Body:
          </label>
          <div className="mb-6">
            <div className="flex items-center gap-4 ">
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
            Upload Recipients(.txt file):
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
      <div className="text-center mt-12">
        <button
          className="bg-third text-[16px] text-primary px-10 py-2 rounded-md font-secondary"
          onClick={handleSendMail}
        >
          Send Mail
        </button>
      </div>

      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg text-center">
            {isSending ? (
              <div>
                <p>Sending emails...</p>
                <div className="mt-4">
                  {sendingStatus.map((status, index) => (
                    <div key={index} className="mb-2">
                      <p>
                        {status.email}: {status.status} - {status.progress}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>{successMessage ? successMessage : error}</p>
            )}
            <button className="mt-4 bg-gray-700 text-white px-4 py-2 rounded" onClick={() => setShowPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SenderBody;
