import React, { useEffect } from "react";
import emailImg from "../assets/email(1) 1.svg";
import whatsappImg from "../assets/whatsapp 1.svg";
import dataImg from "../assets/data 1.svg";
import selfieImg from "../assets/selfie 1.svg";
import Navbar from "../Pages/Hero/Header-2";
import "./thirdstyles.css";

const Dashboard = () => {
  useEffect(() => {
    // Apply specific styles for the body when the Dashboard page is mounted
    document.body.style.backgroundColor = "#ffffff"; // Example: Set background color

    // Clean up when the component is unmounted to avoid global changes
    return () => {
      document.body.style.backgroundColor = ""; // Reset the background color
    };
  }, []); // Empty array ensures this runs only on mount and unmount

  return (
    <>
      <Navbar /> {/* Header is placed outside of dashboard-contain */}
      <div className="Dashboard-contain">
        <div className="sidebar">
          <a className="big-a" style={{ color: "#1E90FF" }} href="#">
            Dashboard
          </a>
          <a className="big-a" href="#">
            Campaigns
          </a>
          <a className="big-a" href="#">
            Account
          </a>
          <a className="big-a" href="#">
            Billing
          </a>
          <a className="big-a" href="#">
            Tools ▾
          </a>
          <a className="small-a" href="#">
            Mail Sender
          </a>
          <a className="small-a" href="#">
            Mail Scraper
          </a>
          <a className="small-a" href="#">
            Gmail Sender
          </a>
          <a className="small-a" href="#">
            WhatsApp Sender
          </a>
          <a className="small-a" href="#">
            Number Scraper
          </a>
        </div>
        <div className="main-content">
          <h1>Welcome User Name</h1>
          <hr className="hr2" />
          <div className="cards">
            <div className="card">
              <img src={emailImg} alt="Email Campaigns" />
              <div>
                <h3>
                  Total Email Campaign <br />
                  (10)
                </h3>
              </div>
            </div>
            <div className="card">
              <img src={whatsappImg} alt="WhatsApp Campaigns" />
              <div>
                <h3>
                  Total WhatsApp Campaign <br />
                  (9)
                </h3>
              </div>
            </div>
            <div className="card">
              <img src={dataImg} alt="Email Scraped" />
              <div>
                <h3>
                  Total Email Scraped <br />
                  (10)
                </h3>
              </div>
            </div>
            <div className="card">
              <img src={selfieImg} alt="Number Scraped" />
              <div>
                <h3>
                  Total Number Scraped <br />
                  (9)
                </h3>
              </div>
            </div>
          </div>
          <hr className="hr1" />
          <div className="recent-campaigns">
            <h2>Recent Campaign</h2>
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Recipients</th>
                  <th>Sent By</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>New email</td>
                  <td>10/12/25</td>
                  <td>1000</td>
                  <td>User Name</td>
                  <td>Done</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>New email</td>
                  <td>10/12/25</td>
                  <td>1000</td>
                  <td>User Name</td>
                  <td>Pending</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>New email</td>
                  <td>10/12/25</td>
                  <td>1000</td>
                  <td>User Name</td>
                  <td>Done</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>New email</td>
                  <td>10/12/25</td>
                  <td>1000</td>
                  <td>User Name</td>
                  <td>Done</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
