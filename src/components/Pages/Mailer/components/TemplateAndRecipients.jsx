import React from 'react';
import { Mail, Upload } from 'lucide-react';

const TemplateAndRecipients = ({ 
  htmlTemplateName, 
  recipientsFileName, 
  htmlTemplateRef, 
  recipientsFileRef, 
  onFileUpload,
  setHtmlTemplateName,
  setRecipientsFileName,
  setRecipientsPreview 
}) => {
  
  const handleFileUpload = (ref, fieldName) => {
    const file = ref.current.files[0];
    if (file) {
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
    // Call the parent handler for form data update
    onFileUpload(ref, fieldName);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
      {/* Email Template Section */}
      <div className="space-y-4 p-4 sm:p-6 border border-gray-300 rounded-lg shadow-sm">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-2">
            <Mail className="text-blue-600" size={24} />
          </div>
          <h3 className="text-base font-medium text-gray-900">Email Template</h3>
          <p className="text-sm text-gray-500 mt-1">Upload HTML, HTM, or TXT templates</p>
        </div>
        <div className="space-y-2">
          <button
            onClick={() => htmlTemplateRef.current.click()}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Choose Template
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
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-2">
            <Upload className="text-blue-600" size={24} />
          </div>
          <h3 className="text-base font-medium text-gray-900">Recipients List</h3>
          <p className="text-sm text-gray-500 mt-1">Upload TXT, CSV, or XLSX files</p>
        </div>
        <div className="space-y-2">
          <button
            onClick={() => recipientsFileRef.current.click()}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Choose File
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
  );
};

export default TemplateAndRecipients;