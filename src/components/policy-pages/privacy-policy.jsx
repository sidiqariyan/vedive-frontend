import React from "react";
import Navbar from "../Pages/Hero/Navbar.jsx";
import Footer from "../Pages/Hero/Footer.jsx";
import "../Pages/mainstyles.css";
import { Helmet } from 'react-helmet';

const PrivacyPolicy = () => {
  return (
    <div className="bg-[#04081d]">
      <Helmet>
        <title>Privacy Policy | Vedive</title>
        <meta 
          name="description" 
          content="Learn how Vedive collects, uses, and protects your personal information. Our privacy policy explains your rights and our commitment to data security."
        />
      </Helmet>
      <Navbar />
      
      {/* Top Banner Section */}
      <div className="top-section">
        <h1>
          Privacy Policy
        </h1>
        <h2>
          Your data privacy matters—learn how we <span className="text-[#1E90FF]">protect</span> your information
        </h2>
      </div>
      
      {/* Main Content Container */}
      <div className="flex justify-center items-center">
        <div className="w-[98%] mx-auto p-8 md:p-6 sm:p-4 text-white mb-16">
          <div className="mb-10">
            <h2 className="font-['Raleway'] text-5xl md:text-4xl sm:text-3xl font-semibold mb-5">
              Vedive Privacy Policy
            </h2>
            <p className="font-['Open_Sans'] text-lg mb-5">
              Last Updated: May 16, 2025
            </p>
            <p className="font-['Open_Sans'] text-lg leading-7">
              At Vedive, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our email and WhatsApp marketing services.
            </p>
          </div>

          {/* Privacy Policy Sections */}
          <div>
            {/* Section 1 */}
            <div className="mb-10">
              <h3 className="font-['Raleway'] text-2xl font-semibold mb-4 ">
                1. Information We Collect
              </h3>
              <div className="font-['Open_Sans'] text-base leading-6">
                <p className="mb-4">
                  <span className="font-semibold">Personal Information:</span> When you register for our services, we may collect your name, email address, phone number, company name, billing address, and payment information.
                </p>
                <p className="mb-4">
                  <span className="font-semibold">Usage Data:</span> We automatically collect information about your interactions with our platform, including IP address, browser type, pages visited, time spent on pages, and other diagnostic data.
                </p>
                <p className="mb-4">
                  <span className="font-semibold">Marketing Data:</span> Information related to your marketing campaigns, including recipient lists, campaign performance metrics, and engagement statistics.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="mb-10">
              <h3 className="font-['Raleway'] text-2xl font-semibold mb-4 ">
                2. How We Use Your Information
              </h3>
              <div className="font-['Open_Sans'] text-base leading-6">
                <p className="mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-8 mb-4">
                  <li className="mb-2">Provide, maintain, and improve our services</li>
                  <li className="mb-2">Process transactions and send related information</li>
                  <li className="mb-2">Send administrative notifications, such as updates, security alerts, and support messages</li>
                  <li className="mb-2">Respond to your comments, questions, and requests</li>
                  <li className="mb-2">Monitor usage patterns and analyze trends to enhance user experience</li>
                  <li className="mb-2">Protect against, identify, and prevent fraud and other illegal activities</li>
                </ul>
              </div>
            </div>

            {/* Section 3 */}
            <div className="mb-10">
              <h3 className="font-['Raleway'] text-2xl font-semibold mb-4 ">
                3. Information Sharing and Disclosure
              </h3>
              <div className="font-['Open_Sans'] text-base leading-6">
                <p className="mb-4">
                  We may share your information with:
                </p>
                <p className="mb-4">
                  <span className="font-semibold">Service Providers:</span> Third-party vendors who perform services on our behalf, such as payment processing, data analysis, email delivery, hosting services, and customer service.
                </p>
                <p className="mb-4">
                  <span className="font-semibold">Compliance with Laws:</span> We may disclose your information where required by law or if we believe that such action is necessary to comply with legal obligations or protect our rights.
                </p>
                <p className="mb-4">
                  <span className="font-semibold">Business Transfers:</span> In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business.
                </p>
                <p className="mb-4">
                  <span className="font-semibold">With Your Consent:</span> We may share your information for other purposes if we have obtained your explicit consent.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="mb-10">
              <h3 className="font-['Raleway'] text-2xl font-semibold mb-4 ">
                4. Data Security
              </h3>
              <div className="font-['Open_Sans'] text-base leading-6">
                <p className="mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div className="mb-10">
              <h3 className="font-['Raleway'] text-2xl font-semibold mb-4 ">
                5. Your Data Protection Rights
              </h3>
              <div className="font-['Open_Sans'] text-base leading-6">
                <p className="mb-4">Depending on your location, you may have the following rights:</p>
                <ul className="list-disc pl-8 mb-4">
                  <li className="mb-2">Right to access personal information we hold about you</li>
                  <li className="mb-2">Right to rectification of inaccurate information</li>
                  <li className="mb-2">Right to erasure of your personal information</li>
                  <li className="mb-2">Right to restrict or object to processing of your information</li>
                  <li className="mb-2">Right to data portability</li>
                  <li className="mb-2">Right to withdraw consent at any time</li>
                </ul>
                <p className="mb-4">
                  To exercise these rights, please contact us using the information provided in the "Contact Us" section.
                </p>
              </div>
            </div>

            {/* Section 6 */}
            <div className="mb-10">
              <h3 className="font-['Raleway'] text-2xl font-semibold mb-4 ">
                6. Cookies and Tracking Technologies
              </h3>
              <div className="font-['Open_Sans'] text-base leading-6">
                <p className="mb-4">
                  We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
                </p>
              </div>
            </div>

            {/* Section 7 */}
            <div className="mb-10">
              <h3 className="font-['Raleway'] text-2xl font-semibold mb-4 ">
                7. Children's Privacy
              </h3>
              <div className="font-['Open_Sans'] text-base leading-6">
                <p className="mb-4">
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect personally identifiable information from children under 18. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.
                </p>
              </div>
            </div>

            {/* Section 8 */}
            <div className="mb-10">
              <h3 className="font-['Raleway'] text-2xl font-semibold mb-4 ">
                8. Changes to This Privacy Policy
              </h3>
              <div className="font-['Open_Sans'] text-base leading-6">
                <p className="mb-4">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
                </p>
              </div>
            </div>

            {/* Section 9 */}
            <div className="mb-10">
              <h3 className="font-['Raleway'] text-2xl font-semibold mb-4 ">
                9. Contact Us
              </h3>
              <div className="font-['Open_Sans'] text-base leading-6">
                <p className="mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <ul className="list-none mb-4">
                  <li className="mb-2">By email: <a href="mailto:info@vedive.com" className="text-[#1E90FF]">info@vedive.com</a></li>
                  <li className="mb-2">By phone: <a href="tel:+918920593970" className="text-[#1E90FF]">+91 8920593970</a></li>
                  <li className="mb-2">By mail: New Delhi, Delhi, India 110084</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;