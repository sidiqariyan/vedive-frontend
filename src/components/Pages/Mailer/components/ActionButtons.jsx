import React from 'react';

const ActionButtons = ({ isSending, formData, onSendMail, onReset }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
      <button
        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
        onClick={onReset}
      >
        Reset
      </button>
      <button
        className={`px-4 py-2 rounded-lg text-sm font-medium text-white w-full sm:w-auto ${
          isSending || !formData.emailSubject || !formData.recipientsFile
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        onClick={onSendMail}
        disabled={isSending || !formData.emailSubject || !formData.recipientsFile}
      >
        {isSending ? 'Sending Emails...' : 'Send Emails'}
      </button>
    </div>
  );
};

export default ActionButtons;