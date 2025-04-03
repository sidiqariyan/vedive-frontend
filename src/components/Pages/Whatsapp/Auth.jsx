import React, { useEffect, useState } from "react";
import axios from "axios";

const QRCodeDisplay = () => {
  const [qrCode, setQrCode] = useState(null); // State to store the QR code
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        // Added auth token from localStorage
        const token = localStorage.getItem("token");
        
        const response = await axios.get("https://ec2-51-21-1-175.eu-north-1.compute.amazonaws.com:3000/api/whatsapp/qr", {
          headers: {
            Authorization: `Bearer ${token}` // Add authentication header
          }
        });
        
        if (response.data.qrCode) {
          // Set the QR code if available
          setQrCode(response.data.qrCode);
          setError(null); // Clear any previous errors
        } else if (response.data.message === "WhatsApp is authenticated!") {
          // Clear QR code if authenticated
          setQrCode(null);
          setError(null); // Clear any previous errors
        } else if (response.data.error) {
          // Handle backend errors
          setError(response.data.error);
        }
      } catch (err) {
        // Handle network or other errors
        setError("Failed to fetch QR code. Please try again later.");
        console.error("QR code fetch error:", err);
      }
    };
    
    const interval = setInterval(fetchQRCode, 3000); // Poll every 3 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }
  
  if (!qrCode) {
    return <div className="text-green-500 text-center">WhatsApp is authenticated! You can now send messages.</div>;
  }
  
  return (
    <div style={{ textAlign: "center" }}>
      <h2 className="text-[32px] font-semibold font-primary mb-4 -mt-4 flex justify-center text-primary">
        WhatsApp Sender
      </h2>
      <p>Scan the QR code with your WhatsApp mobile app:</p>
      <img src={qrCode} alt="QR Code" style={{ maxWidth: "200px", maxHeight: "200px" }} />
    </div>
  );
};

export default QRCodeDisplay;