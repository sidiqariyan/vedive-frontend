import React, { useContext, useState, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../Mailer/AuthContext.jsx"; // Ensure this path is correct

const GmailSender = () => {
  const { isLoggedIn } = useContext(AuthContext); // Access authentication state

  const [gmail, setGmail] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [from, setFrom] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [contactsFile, setContactsFile] = useState(null);
  const [htmlFile, setHtmlFile] = useState(null);
  const [htmlTemplateName, setHtmlTemplateName] = useState("");
  const [recipientsFileName, setRecipientsFileName] = useState("");

  const htmlTemplateRef = useRef(null);
  const recipientsFileRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Recipient File Selected:", file.name);
      setContactsFile(file);
      setRecipientsFileName(file.name);
    } else {
      console.log("No recipient file selected.");
    }
  };

  const handleHtmlFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const content = await file.text();
      console.log("HTML Template File Selected:", file.name);
      setBody(content);
      setHtmlTemplateName(file.name);
    }
    setHtmlFile(file);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();

    // Check if the user is logged in
    if (!isLoggedIn) {
      alert("Please log in first to send emails.");
      window.location.href = "/login"; // Redirect to login page
      return;
    }

    // Prompt user to enter campaign name
    const campaignNameInput = prompt("Please name your campaign:");
    if (!campaignNameInput || campaignNameInput.trim() === "") {
      alert("Campaign name is required!");
      return;
    }

    if (!contactsFile) {
      alert("Please upload a contacts file.");
      return;
    }

    if (!htmlFile) {
      alert("Please upload an HTML file for the mail body.");
      return;
    }

    try {
      const contacts = await contactsFile.text();
      console.log("Contacts File Content:", contacts); // Debugging

      // Make API request to send emails
      const response = await axios.post(
        "http://localhost:3000/api/send-gmail", // Replace with your backend endpoint
        {
          gmail,
          appPassword,
          from,
          subject,
          contacts: contacts.split("\n").map((email) => email.trim()),
          body,
          campaignName: campaignNameInput, // Include campaign name in the payload
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include JWT token
          },
        }
      );

      // Handle success
      alert(response.data.message || "Emails sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send emails. Check the console for details.");
    }
  };

  return (
    <div className="bg-[#121212] p-4 pt-[70px] border rounded-lg mt-4">
      <div className="how-to-sec">
        <span className="text-primary flex text-base">
          <svg
            className="mr-2 ml-2"
            width="12"
            height="15"
            viewBox="0 0 20 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="10" cy="12.069" r="10" fill="#FFE100" />
            <path
              d="M9.63863 7.45658C9.35173 7.45658 9.10897 7.35727 8.91035 7.15865C8.71173 6.96003 8.61242 6.71727 8.61242 6.43037C8.61242 6.14348 8.71173 5.90072 8.91035 5.7021C9.10897 5.50348 9.35173 5.40417 9.63863 5.40417C9.91449 5.40417 10.1462 5.50348 10.3338 5.7021C10.5324 5.90072 10.6317 6.14348 10.6317 6.43037C10.6317 6.71727 10.5324 6.96003 10.3338 7.15865C10.1462 7.35727 9.91449 7.45658 9.63863 7.45658ZM10.3669 8.92969V18H8.86069V8.92969H10.3669Z"
              fill="#0F0E0D"
            />
          </svg>
          <span className="text-[12px] mt-[-4px]">How to do? (</span>
          <a href="#" className="underline text-third text-[12px] mt-[-4px]">
            Click Here - Video
          </a>{" "}
          <span className="text-[12px] mt-[-4px]">)</span>
        </span>
      </div>
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-[32px] font-semibold font-primary mb-4 -mt-8 flex justify-center text-primary">
          Send Bulk Emails
        </h2>
        <form onSubmit={handleSendEmail}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Gmail Account */}
            <div className="flex items-center justify-between w-full">
              <label htmlFor="gmail" className="hidden sm:block flex-1 text-right font-secondary text-[14px] text-primary">
                Gmail Account:
              </label>
              <input
                id="gmail"
                type="email"
                className="ml-0 sm:ml-2 border-gray-300 border p-1 rounded-md text-secondary w-full sm:w-auto 
                           placeholder:text-secondary sm:placeholder-transparent"
                style={{ height: "30px" }}
                placeholder="Enter your Gmail"
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
                required
              />
            </div>
            {/* App Password */}
            <div className="flex items-center justify-between w-full">
              <label htmlFor="appPassword" className="hidden sm:block flex-1 text-right font-secondary text-[14px] text-primary">
                App Password:
              </label>
              <input
                id="appPassword"
                type="password"
                className="ml-0 sm:ml-2 border-gray-300 border p-1 rounded-md text-secondary w-full sm:w-auto 
                           placeholder:text-secondary sm:placeholder-transparent"
                style={{ height: "30px" }}
                placeholder="Enter your App Password"
                value={appPassword}
                onChange={(e) => setAppPassword(e.target.value)}
                required
              />
            </div>
            {/* From */}
            <div className="flex items-center justify-between w-full">
              <label htmlFor="from" className="hidden sm:block flex-1 text-right font-secondary text-[14px] text-primary">
                From:
              </label>
              <input
                id="from"
                type="text"
                className="ml-0 sm:ml-2 border-gray-300 border p-1 rounded-md text-secondary w-full sm:w-auto 
                           placeholder:text-secondary sm:placeholder-transparent"
                style={{ height: "30px" }}
                placeholder="Enter sender email"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                required
              />
            </div>
            {/* Subject */}
            <div className="flex items-center justify-between w-full">
              <label htmlFor="subject" className="hidden sm:block flex-1 text-right font-secondary text-[14px] text-primary">
                Subject:
              </label>
              <input
                id="subject"
                type="text"
                className="ml-0 sm:ml-2 border-gray-300 border p-1 rounded-md text-secondary w-full sm:w-auto 
                           placeholder:text-secondary sm:placeholder-transparent"
                style={{ height: "30px" }}
                placeholder="Enter email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-secondary text-[14px] text-primary">Mail Template (.html):</label>
              <button
                className="bg-third text-primary px-3 py-2 rounded-md text-[12px]"
                type="button"
                onClick={() => htmlTemplateRef.current.click()}
              >
                Upload Template
              </button>
              {htmlTemplateName && <span className="text-primary text-sm">{htmlTemplateName}</span>}
              <input
                type="file"
                accept=".html"
                ref={htmlTemplateRef}
                onChange={handleHtmlFileChange}
                style={{ display: "none" }}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="block font-secondary text-[14px] text-primary">
                Upload Recipients (.txt file):
              </label>
              <button
                className="bg-third text-primary px-3 py-2 rounded-md text-[12px]"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  recipientsFileRef.current.click();
                }}
              >
                Upload Recipients
              </button>
              {recipientsFileName && <span className="text-primary text-sm">{recipientsFileName}</span>}
              <input
                type="file"
                accept=".txt"
                ref={recipientsFileRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
          </div>
          <div className="flex flex-row-reverse mt-5">
            <button type="submit" className="bg-black rounded-lg text-white px-4 py-2">
              Send Emails
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GmailSender;