import React from 'react';
import '../Mailer/MailerSender.css';
import GmailSender from './GmailSender';

const GmailTemp= () => {

  return (
    <div className="p-6 min-h-screen   box-main-container-home">
      <div className="max-w-4xl bg-white mx-auto p-8 rounded-5xl shadow-lg box-container-home mt-16">
      <GmailSender /> 
      </div>
    </div>
  );
};

export default GmailTemp;
