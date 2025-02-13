import React from 'react';
import { Link } from "react-router-dom";
import './styles.css'; 
import Vedive from '../assets/Vedive.png';
import emailIcon from '../assets/email.svg';
import phoneIcon from '../assets/phone.svg';
import facebookIcon from '../assets/facebook.svg';
import instagramIcon from '../assets/instagram.svg';
import linkedinIcon from '../assets/linkedin.svg';
import threadsIcon from '../assets/threads.svg';
import twitterIcon from '../assets/x.svg';
import youtubeIcon from '../assets/youtube.svg';

const Footer = () => {
  return (
    <div className="main-body">
      {/* Your main content goes here */}
      <header>
        {/* Header Content */}
      </header>

      {/* Your page content */}
      <div className="content">
        {/* Main content */}
      </div>

      <footer>
        {/* Footer content */}
        <div className="footer">
          <div className="column">
            <div className="logo-footer">
              <img src={Vedive} alt="Vedive Logo-footer" />
            </div>
            <p>
              Our mission is to provide convenience and quality service to every
              marketing (address)
            </p>
            <br />
            <br />
            <p>Follow Us on Our Social Media:</p>
            <div className="social-icons">
              <img src={facebookIcon} alt="Facebook" />
              <img src={instagramIcon} alt="Instagram" />
              <img src={linkedinIcon} alt="LinkedIn" />
              <img src={threadsIcon} alt="Threads" />
              <img src={twitterIcon} alt="Twitter/X" />
              <img src={youtubeIcon} alt="YouTube" />
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="column">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/templates">Templates</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/blogs">Blogs</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Account Links */}
          <div className="column">
            <ul>
              <li>
                <a href="#">Account</a>
              </li>
              <li>
                <a href="/login.html">Log in</a>
              </li>
              <li>
                <a href="#">Sign Up</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms & Condition</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="column contact-info">
            <h3>Get in Touch</h3>
            <span>
              <img src={emailIcon} alt="Email" /> info@vedive.com
            </span>
            <span>
              <img src={phoneIcon} alt="Phone" /> +91 8920593970
            </span>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="copyright">
          Copyright &copy; 2025 All Rights Reserved By Vedive
        </div>
      </footer>
    </div>
  );
};

export default Footer;
