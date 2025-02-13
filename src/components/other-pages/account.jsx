import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Pages/Hero/Header-2";
import "./thirdstyles.css";

const Account = () => {
  return (
    <>
      <Navbar />
      <div className="body-dashboard" style={{ background: "#ffffff" }}>
        <div className="sidebar">
          <Link className="big-a" style={{ color: "#1E90FF" }} to="#">
            Dashboard
          </Link>
          <Link className="big-a" to="#">
            Campaigns
          </Link>
          <Link className="big-a" to="#">
            Account
          </Link>
          <Link className="big-a" to="#">
            Billing
          </Link>
          <Link className="big-a" to="#">
            Tools ▾
          </Link>
          <Link className="small-a" to="#">
            Mail Sender
          </Link>
          <Link className="small-a" to="#">
            Mail Scraper
          </Link>
          <Link className="small-a" to="#">
            Gmail Sender
          </Link>
          <Link className="small-a" to="#">
            WhatsApp Sender
          </Link>
          <Link className="small-a" to="#">
            Number Scraper
          </Link>
        </div>
        <div className="main-content">
          <h1>Welcome User Name</h1>
          <hr className="hr2" />
          <div className="form-accounts-container">
            <div className="form-accounts-group">
              <label htmlFor="first-name2">First name</label>
              <input type="text" id="first-name2" />
            </div>
            <div className="form-accounts-group">
              <label htmlFor="last-name2">Last name</label>
              <input type="text" id="last-name2" />
            </div>
            <div className="form-accounts-group">
              <label htmlFor="phone2">Phone No.</label>
              <input type="text" id="phone2" />
            </div>
            <div className="form-accounts-group">
              <label htmlFor="email2">Email Id</label>
              <input type="email" id="email2" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
