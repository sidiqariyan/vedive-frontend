import React, { useState, useEffect } from "react";
import axios from "axios";

const WhatsAppSender = () => {
  const [qrCode, setQrCode] = useState(null);
  const [messageFile, setMessageFile] = useState(null);
  const [contactsFile, setContactsFile] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let ws;
    const connectWebSocket = () => {
      ws = new WebSocket("ws://ec2-3-111-32-68.ap-south-1.compute.amazonaws.com:3001");

      ws.onopen = () => {
        console.log("WebSocket connected.");
        setStatus("Connected to WebSocket. Waiting for QR code...");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.qr) {
          setQrCode(data.qr);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setStatus("WebSocket error. Reconnecting...");
      };

      ws.onclose = () => {
        console.warn("WebSocket connection closed. Reconnecting...");
        setStatus("WebSocket disconnected. Attempting to reconnect...");
        setTimeout(connectWebSocket, 5000);
      };
    };

    connectWebSocket();
    return () => ws && ws.close();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (messageFile) formData.append("messageFile", messageFile);
    if (contactsFile) formData.append("contactsFile", contactsFile);
    if (mediaFile) formData.append("mediaFile", mediaFile);

    console.log("Submitting files:", { messageFile, contactsFile, mediaFile });

    try {
      setStatus("Uploading files...");
      const response = await axios.post("http://ec2-3-111-32-68.ap-south-1.compute.amazonaws.com:3001/api/send-whatsapp", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus(response.data.message || "Files uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("Upload failed. Check console for details.");
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">WhatsApp Bulk Message Sender</h1>
      <div>
        <h3>Step 1: Scan QR Code</h3>
        {qrCode ? (
          <img src={qrCode} alt="QR Code" style={{ width: "100%", maxHeight: "300px" }} />
        ) : (
          <p>Waiting for QR Code...</p>
        )}
      </div>
      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <h3>Step 2: Upload Files</h3>
        <div className="mt-5">
          <label>
            Message File (.txt):{" "}
            <label htmlFor="messageFileInput" className="custom-button bg-third text-white px-4 py-2 rounded-lg">
              Upload File
              <input
                type="file"
                id="messageFileInput"
                accept=".txt"
                onChange={(e) => setMessageFile(e.target.files[0])}
                required
                style={{ display: "none" }}
              />
            </label>
            <span> {messageFile ? messageFile.name : "No file selected"}</span>
          </label>
        </div>
        <div className="mt-5">
          <label>
            Contacts File (.xlsx):{" "}
            <label htmlFor="contactsFileInput" className="custom-button bg-third text-white px-4 py-2 rounded-lg">
              Upload File
              <input
                type="file"
                id="contactsFileInput"
                accept=".xlsx"
                onChange={(e) => setContactsFile(e.target.files[0])}
                required
                style={{ display: "none" }}
              />
            </label>
            <span> {contactsFile ? contactsFile.name : "No file selected"}</span>
          </label>
        </div>
        <div className="mt-5">
          <label>
            Media File (Optional):{" "}
            <label htmlFor="mediaFileInput" className="custom-button bg-third text-white px-4 py-2 rounded-lg">
              Upload File
              <input
                type="file"
                id="mediaFileInput"
                accept="image/*,video/*"
                onChange={(e) => setMediaFile(e.target.files[0])}
                style={{ display: "none" }}
              />
            </label>
            <span> {mediaFile ? mediaFile.name : "No file selected"}</span>
          </label>
        </div>
        <div className="flex flex-row-reverse">
          <button type="submit" className="bg-black rounded-lg text-white px-4 py-2" style={{ marginTop: "20px" }}>
            Send Messages
          </button>
        </div>
      </form>
      {status && <p style={{ marginTop: "20px", color: "blue" }}>{status}</p>}
    </div>
  );
};

export default WhatsAppSender;
