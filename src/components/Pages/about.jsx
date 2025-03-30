import "./mainstyles.css";
import Navbar from "./Hero/Navbar";
import Footer from "./Hero/Footer";
import CoreValues from "./Hero/Values";
import bgImage1 from "./assets/about-us-image-1.png";
import bgImage2 from "./assets/about-us-image-2.jpg";
import bgImage3 from "./assets/about-us-image-3.jpg";
import bgImage4 from "./assets/about-us-image-4.png";
import bgImage5 from "./assets/about-us-image-5.jpg";

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
          style={{ background: "transparent", color: "#ffffff" }}
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
        <div className="about-us-container"><img src={bgImage1} alt="" /></div>
        <div className="about-us-container"><img src={bgImage2} alt="" /></div>
        <div className="about-us-container"><img src={bgImage3} alt="" /></div>
      </div>

      {/* Mobile/Tablet View */}
      <div className="mobile-tablet-view">
        <div
          style={{ background: "#04081D", color: "#ffffff" }}
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
        <div className="about-us-container"><img src={bgImage1} alt="" /></div>
        <div className="about-us-container"><img src={bgImage2} alt="" /></div>
        <div className="about-us-container"><img src={bgImage3} alt="" /></div>
        </div>
      </div>

      {/* Main Heading Text */}
      <div className="main-heading-text">
        <h1>What We Want</h1>
      </div>

      {/* Grid Container */}
      <div className="grid-container">
        <div className="grid-item" style={{ backgroundColor: "#1E90FF", color: "white" }}>
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

        <div className="grid-item" style={{  padding: '0'}}>
        <img src={bgImage4} alt="" />
        </div>

        <div className="grid-item" style={{  padding: '0'}}>
        <img src={bgImage5} alt="" />
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
