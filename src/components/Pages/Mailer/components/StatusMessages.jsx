import React from 'react';

const StatusMessages = ({ error, successMessage, sendingStatus, completedEmails }) => {
  return (
    <>
      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mt-4 p-4 bg-green-50 border border-green-300 rounded-lg">
          <p className="text-sm text-green-600">{successMessage}</p>
        </div>
      )}

      {/* Sending Progress */}
      {sendingStatus.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Sending Progress ({completedEmails} completed)
          </h4>
          {sendingStatus.map((status, index) => (
            <div
              key={index}
              className="p-3 bg-gray-50 border border-gray-300 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0"
            >
              <span className="text-sm text-gray-700 truncate max-w-full sm:max-w-xs md:max-w-md">
                {status.email}
              </span>
              <div className="flex items-center w-full sm:w-auto">
                <span className={`text-sm mr-2 ${
                  status.status === 'Sent' ? 'text-green-600' : 
                  status.status === 'Failed' ? 'text-red-600' : 
                  'text-blue-600'
                }`}>
                  {status.status}
                </span>
                <div className="w-full sm:w-24 bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      status.status === 'Sent' ? 'bg-green-500' : 
                      status.status === 'Failed' ? 'bg-red-500' : 
                      'bg-blue-500'
                    }`}
                    style={{ width: `${status.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default StatusMessages;