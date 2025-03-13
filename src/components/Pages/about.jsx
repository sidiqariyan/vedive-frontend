import "./mainstyles.css";
import Navbar from "./Hero/Navbar";
import Footer from "./Hero/Footer";
import CoreValues from "./Hero/Values";

const AboutUs = () => {
  return (
    <div className="main-body">
      <Navbar />

      <div className="top-section">
        <h1>About Us</h1>
        <h2>
          Maximize Your Reach with <span>Free</span> Messaging Services.
        </h2>
      </div>

      {/* Desktop View */}
      <div className="desktop-view">
        <div
          style={{ background: "#000000", color: "#ffffff" }}
          className="about-us-container about-us-container-1"
        >
          <h1>Our Story</h1>
          <p>
            Our mission is to provide convenience and quality service to every
            marketing professional, so they can make their marketing efforts
            easier and better. We are always committed to giving our customers
            the best experience, and every day, we aim to exceed their
            expectations in new ways. This will help make marketing even easier
            in the future.
          </p>
        </div>
        <div className="about-us-container">2</div>
        <div className="about-us-container">3</div>
        <div className="about-us-container">4</div>
      </div>

      {/* Mobile/Tablet View */}
      <div className="mobile-tablet-view">
        <div
          style={{ background: "#000000", color: "#ffffff" }}
          className="about-us-container about-us-container-1"
        >
          <h1>Our Story</h1>
          <p>
            Our mission is to provide convenience and quality service to every
            marketing professional, so they can make their marketing efforts
            easier and better. We are always committed to giving our customers
            the best experience, and every day, we aim to exceed their
            expectations in new ways. This will help make marketing even easier
            in the future.
          </p>
        </div>
        <div className="scroll-row">
          <div className="about-us-container">2</div>
          <div className="about-us-container">3</div>
          <div className="about-us-container">4</div>
        </div>
      </div>

      {/* Main Heading Text */}
      <div className="main-heading-text">
        <h1>What We Want</h1>
      </div>

      {/* Grid Container */}
      <div className="grid-container">
        <div className="grid-item">
          <h2>Our Value:</h2>
          <p>
            Our mission is to provide convenience and quality service to every
            marketing professional, so they can make their marketing efforts
            easier and better. We are always committed to giving our customers
            the best experience, and every day, we aim to exceed their
            expectations in new ways. This will help make marketing even easier
            in the future. Our mission is to provide convenience and quality
            service to every marketing professional, so they can make their
            marketing efforts easier and better. We are always committed to
            giving our customers the best experience, and every day, we aim to
            exceed their expectations in new ways. This will help make marketing
            even easier in the future. so they can make their marketing efforts
            easier and better. We are always committed to giving our customers
            the best experience, and every day, we aim to exceed their
            expectations in new ways. This will help make marketing even easier
            in the future.
          </p>
        </div>

        <div className="grid-item">
          <h2>Our Vision:</h2>
          <p>
            Our mission is to provide convenience and quality service to every
            marketing professional, so they can make their marketing efforts
            easier and better. We are always committed to giving our customers
            the best experience, and every day, we aim to exceed their
            expectations in new ways. This will help make marketing even easier
            in the future. Our mission is to provide convenience and quality
            service to every marketing professional, so they can make their
            marketing efforts easier and better. We are always committed to
            giving our customers the best experience, and every day, we aim to
            exceed their expectations in new ways. This will help make marketing
            even easier in the future. so they can make their marketing efforts
            easier and better. We are always committed to giving our customers
            the best experience, and every day, we aim to exceed their
            expectations in new ways. This will help make marketing even easier
            in the future.
          </p>
        </div>

        <div className="grid-item">
          <h2>Our Commitment:</h2>
          <p>
            Our mission is to provide convenience and quality service to every
            marketing professional, so they can make their marketing efforts
            easier and better. We are always committed to giving our customers
            the best experience, and every day, we aim to exceed their
            expectations in new ways. This will help make marketing even easier
            in the future. Our mission is to provide convenience and quality
            service to every marketing professional, so they can make their
            marketing efforts easier and better. We are always committed to
            giving our customers the best experience, and every day, we aim to
            exceed their expectations in new ways. This will help make marketing
            even easier in the future. so they can make their marketing efforts
            easier and better. We are always committed to giving our customers
            the best experience, and every day, we aim to exceed their
            expectations in new ways. This will help make marketing even easier
            in the future.
          </p>
        </div>

        <div
          className="grid-item"
          style={{ backgroundColor: "#1E90FF", color: "white" }}
        >
          <h2>Our Promise:</h2>
          <p>
            Our mission is to provide convenience and quality service to every
            marketing professional, so they can make their marketing efforts
            easier and better. We are always committed to giving our customers
            the best experience, and every day, we aim to exceed their
            expectations in new ways. This will help make marketing even easier
            in the future. Our mission is to provide convenience and quality
            service to every marketing professional, so they can make their
            marketing efforts easier and better. We are always committed to
            giving our customers the best experience, and every day, we aim to
            exceed their expectations in new ways. This will help make marketing
            even easier in the future. so they can make their marketing efforts
            easier and better. We are always committed to giving our customers
            the best experience, and every day, we aim to exceed their
            expectations in new ways. This will help make marketing even easier
            in the future.
          </p>
        </div>
      </div>

      <CoreValues />
      <Footer />
    </div>
  );
};

export default AboutUs;
