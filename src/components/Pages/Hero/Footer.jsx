import React, { memo } from 'react';
import { Link } from "react-router-dom";
import './styles.css'; 
import address from '../assets/address.png';
import Vedive from '../assets/Vedive.png';
import emailIcon from '../assets/email.svg';
import phoneIcon from '../assets/phone.svg';
import facebookIcon from '../assets/facebook.svg';
import instagramIcon from '../assets/instagram.svg';
import linkedinIcon from '../assets/linkedin.svg';
import threadsIcon from '../assets/threads.svg';
import twitterIcon from '../assets/x.svg';
import youtubeIcon from '../assets/youtube.svg';

// Static data moved outside component to prevent recreation on each render
const SOCIAL_ICONS = [
  { src: facebookIcon, alt: "Facebook", href: "#facebook" },
  { src: instagramIcon, alt: "Instagram", href: "#instagram" },
  { src: linkedinIcon, alt: "LinkedIn", href: "#linkedin" },
  { src: threadsIcon, alt: "Threads", href: "#threads" },
  { src: twitterIcon, alt: "Twitter/X", href: "#twitter" },
  { src: youtubeIcon, alt: "YouTube", href: "#youtube" }
];

const NAVIGATION_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/templates", label: "Templates" },
  { to: "/pricing", label: "Pricing" },
  { to: "/blogs", label: "Blogs" },
  { to: "/contact", label: "Contact Us" }
];

const ACCOUNT_LINKS = [
  { to: "/account", label: "Account" },
  { to: "/login", label: "Log in" },
  { to: "/signup", label: "Sign Up" },
  { to: "/careers", label: "Careers" },
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms & Condition" }
];

const CONTACT_INFO = [
  { 
    icon: emailIcon, 
    alt: "Email", 
    text: "info@vedive.com",
    href: "mailto:info@vedive.com"
  },
  { 
    icon: phoneIcon, 
    alt: "Phone", 
    text: "+91 8920593970",
    href: "tel:+918920593970"
  },
  { 
    icon: address, 
    alt: "Address", 
    text: "Wazirabad, New Delhi, Delhi 110084, Near Mcd School",
  }
];

// Subcomponents for better organization
const SocialIcons = memo(() => (
  <div className="social-icons">
    {SOCIAL_ICONS.map((icon, index) => (
      <a 
        key={`social-${index}`} 
        href={icon.href} 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label={`Visit our ${icon.alt} page`}
      >
        <img src={icon.src} alt={icon.alt} />
      </a>
    ))}
  </div>
));

const NavigationLinks = memo(() => (
  <ul>
    {NAVIGATION_LINKS.map((link, index) => (
      <li key={`nav-${index}`}>
        <Link to={link.to}>{link.label}</Link>
      </li>
    ))}
  </ul>
));

const AccountLinks = memo(() => (
  <ul>
    {ACCOUNT_LINKS.map((link, index) => (
      <li key={`account-${index}`}>
        <Link to={link.to}>{link.label}</Link>
      </li>
    ))}
  </ul>
));

const ContactInfo = memo(() => (
  <div className="contact-info">
    <h3>Get in Touch</h3>
    {CONTACT_INFO.map((contact, index) => (
      <div key={`contact-${index}`} className="contact-item mb-2">
        {contact.href ? (
          <a
            href={contact.href}
            target={contact.href.startsWith('http') ? '_blank' : '_self'}
            rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="flex items-center gap-2 text-white no-underline hover:underline"
          >
            <img src={contact.icon} alt={contact.alt} className="w-5 h-5" />
            <span>{contact.text}</span>
          </a>
        ) : (
          <div className="flex items-center gap-2 text-white">
            <img src={contact.icon} alt={contact.alt} className="w-5 h-5" />
            <span>{contact.text}</span>
          </div>
        )}
      </div>
    ))}
  </div>
));

const Footer = memo(() => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="footer">
        {/* Column 1: Logo and Social Media */}
        <div className="column">
          <div className="logo-footer">
            <img src={Vedive} alt="Vedive Logo" />
          </div>
          <p>
            Our mission is to provide convenience and quality service to every
            marketing.
          </p>
          <p>Follow Us on Our Social Media:</p>
          <SocialIcons />
        </div>

        {/* Column 2: Navigation Links */}
        <div className="column">
          <NavigationLinks />
        </div>

        {/* Column 3: Account Links */}
        <div className="column">
          <AccountLinks />
        </div>

        {/* Column 4: Contact Information */}
        <div className="column">
          <ContactInfo />
        </div>
      </div>

      {/* Copyright Section */}
      <div className="copyright">
        Copyright &copy; {currentYear} All Rights Reserved By Vedive
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;