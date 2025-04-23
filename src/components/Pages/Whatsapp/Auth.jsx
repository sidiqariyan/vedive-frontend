import React, { useEffect, useState } from "react";
import axios from "axios";

const QRCodeDisplay = () => {
  const [qrCode, setQrCode] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://vedive.com:3000/api/whatsapp/qr",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.qrCode) {
          setQrCode(response.data.qrCode);
          setIsAuthenticated(false);
          setError(null);
        } else if (response.data.message === "WhatsApp is authenticated!") {
          setQrCode(null);
          setIsAuthenticated(true);
          setError(null);
        } else if (response.data.error) {
          setError(response.data.error);
        }
      } catch (err) {
        setError("Loading QR code… please wait.");
      }
    };

    // Poll every 3 seconds
    const interval = setInterval(fetchQRCode, 3000);
    fetchQRCode();            // also fetch immediately on mount
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="text-blue-500 text-center">
        {error}
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="text-green-600 text-center">
        🎉 You have been authenticated! Now you can send a message.
      </div>
    );
  }

  if (!qrCode) {
    return (
      <div className="text-blue-500 text-center">
        Loading QR code… please wait.
      </div>
    );
  }

  return (
    <div className="text-center" style={{ color: "black" }}>
      <h2 className="text-[32px] font-primary font-semibold mb-4 text-secondary">
        WhatsApp Sender
      </h2>
      <p>Scan this QR code with your WhatsApp mobile app to authenticate:</p>
      <img
        src={qrCode}
        alt="WhatsApp QR Code"
        style={{ maxWidth: "200px", maxHeight: "200px", margin: "1rem auto" }}
      />
    </div>
  );
};

export default QRCodeDisplay;
