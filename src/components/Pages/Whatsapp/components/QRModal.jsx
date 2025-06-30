import React from 'react';
import { X, Loader, AlertCircle } from 'lucide-react';

const QRModal = ({ showQR, qrCode, onClose, onRetry }) => {
  if (!showQR) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Add WhatsApp Account</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="text-center">
          {qrCode ? (
            <div>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <img 
                  src={qrCode} 
                  alt="WhatsApp QR Code" 
                  className="w-48 h-48 mx-auto bg-white border-2 border-gray-300 rounded-lg"
                  onError={(e) => {
                    console.error('QR Code image failed to load:', qrCode);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                {/* Fallback if image fails to load */}
                <div 
                  className="w-48 h-48 bg-white border-2 border-dashed border-gray-300 rounded-lg mx-auto items-center justify-center hidden"
                  style={{ display: 'none' }}
                >
                  <div className="text-center p-4">
                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <span className="text-red-500 text-sm">QR Code failed to load</span>
                    <button 
                      onClick={onRetry}
                      className="block mt-2 text-blue-500 text-sm hover:underline"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-left space-y-2 text-sm text-gray-600">
                <p><strong>1.</strong> Open WhatsApp on your phone</p>
                <p><strong>2.</strong> Go to Settings → Linked Devices</p>
                <p><strong>3.</strong> Tap "Link a Device"</p>
                <p><strong>4.</strong> Scan this QR code</p>
              </div>
            </div>
          ) : (
            <div className="py-8">
              <Loader className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Generating QR code...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRModal;