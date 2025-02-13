import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QRCodeDisplay = () => {
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/qr'); // Ensure this matches the backend URL
        setQrCode(response.data.qrCode);
      } catch (error) {
        console.error('Error fetching QR code:', error);
      }
    };

    const interval = setInterval(fetchQRCode, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  if (!qrCode) {
    return <div><h2 className='text-[32px] font-semibold font-primary mb-4 -mt-4 flex justify-center text-primary'>WhastsApp Sender</h2> <p>WhatsApp is authenticated! You can now send messages.</p></div>;
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h2 className='text-[32px] font-semibold font-primary mb-4 -mt-4 flex justify-center text-primary'>WhastsApp Sender</h2>
      <p>Scan the QR code with your WhatsApp mobile app:</p>
      <img src={qrCode} alt="QR Code" style={{ maxWidth: '200px', maxHeight: '200px' }} />
    </div>
  );
};

export default QRCodeDisplay;