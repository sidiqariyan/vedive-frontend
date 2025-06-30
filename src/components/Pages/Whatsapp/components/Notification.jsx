import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

const Notification = ({ type, message, onClose }) => {
  if (!message) return null;

  const isError = type === 'error';
  const bgColor = isError ? 'bg-red-50' : 'bg-green-50';
  const borderColor = isError ? 'border-red-200' : 'border-green-200';
  const textColor = isError ? 'text-red-800' : 'text-green-800';
  const iconColor = isError ? 'text-red-600' : 'text-green-600';
  const Icon = isError ? AlertCircle : CheckCircle;

  return (
    <div className="max-w-6xl mx-auto mb-6">
      <div className={`${bgColor} border ${borderColor} rounded-lg p-4 flex items-center`}>
        <Icon className={`w-5 h-5 ${iconColor} mr-3`} />
        <span className={textColor}>{message}</span>
      </div>
    </div>
  );
};

export default Notification;