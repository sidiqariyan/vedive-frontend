import React, { useRef, useState } from 'react';
import axios from 'axios';

export default function SenderBody() {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [fromName, setFromName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);

  const recipientsRef = useRef(null);
  const templateRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    const form = new FormData();
    form.append('userEmail', userEmail);
    form.append('userPassword', userPassword);
    form.append('fromName', fromName);
    form.append('emailSubject', subject);
    form.append('recipientsFile', recipientsRef.current.files[0]);
    form.append('htmlTemplate', templateRef.current.files[0]);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/mail/send-bulk-mail',
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (res.data.success) {
        setStatus('Emails sent successfully!');
      } else {
        setStatus('Failed to send emails');
      }
    } catch (err) {
      setStatus('Error: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Bulk Email Sender</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Your Email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 8 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 8 }}
        />
        <input
          type="text"
          placeholder="Display Name (optional)"
          value={fromName}
          onChange={(e) => setFromName(e.target.value)}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 8 }}
        />
        <div style={{ marginBottom: 8 }}>
          <label>Recipients (.txt): </label>
          <input type="file" accept=".txt" ref={recipientsRef} required />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>HTML Template: </label>
          <input type="file" accept=".html" ref={templateRef} required />
        </div>
        <button type="submit" style={{ width: '100%' }}>Send Emails</button>
      </form>
      {status && <p style={{ marginTop: 16 }}>{status}</p>}
    </div>
  );
}
