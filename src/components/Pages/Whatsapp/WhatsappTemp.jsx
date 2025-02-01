import React, { useState } from 'react';
import '../Mailer/MailerSender.css';
import WhatsAppSender from './WhatsAppSender';
import NumberScraper from './NumberScraper';

const WhatsAppTemp = () => {
  const [activeTab, setActiveTab] = useState('MailSender'); // State to track the active tab

  return (
    <div className="p-6 min-h-screen   box-main-container-home">
      <div className="max-w-4xl bg-white mx-auto p-8 rounded-5xl shadow-lg box-container-home mt-16">
        {/* Navigation Tabs */}
        <div className="flex border-b pb-4 mb-6 button-boxes">
          <button
            className={`text-white px-4 py-2 rounded-lg mr-3 ${
              activeTab === 'MailSender' ?'bg-third' : 'bg-primary'
            }`}
            onClick={() => setActiveTab('MailSender')}
          >
            WhatsApp Sender
          </button>
          <button
            className={`text-white px-4 py-2 rounded-lg ${
              activeTab === 'MailScraper' ? 'bg-third' : 'bg-primary'
            }`}
            onClick={() => setActiveTab('MailScraper')}
          >
            Number Scraper
          </button>
        </div>

        {/* Render Components Based on Active Tab */}
        {activeTab === 'MailSender' ? <WhatsAppSender /> : <NumberScraper />}
      </div>
    </div>
  );
};

export default WhatsAppTemp;
