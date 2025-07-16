import React from 'react';

const RecipientsPreview = ({ recipientsPreview }) => {
  return (
    <div className="space-y-4 p-4 sm:p-6 border border-gray-300 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900">Recipients Preview</h3>
      <div className="space-y-1">
        {recipientsPreview.map((email, index) => (
          <div key={index} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
            {email}
          </div>
        ))}
        {recipientsPreview.length === 5 && (
          <p className="text-sm text-gray-500 italic">...and more</p>
        )}
      </div>
    </div>
  );
};

export default RecipientsPreview;