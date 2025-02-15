import React, { useEffect } from "react"; // Importing necessary hooks
import { Link } from "react-router-dom"; // Import Link for routing
import "./secondarystyles.css"; // Assuming styles for the page are in this CSS file
import Vedive from "../assets/Vedive.png";

const Passreset = () => {
  useEffect(() => {
    // Handle focus and blur for input fields (similar to the provided JS)
    document.querySelectorAll(".input-login-field").forEach((input) => {
      if (input.value) {
        input.nextElementSibling.classList.add("active");
      }

      input.addEventListener("focus", () => {
        input.nextElementSibling.classList.add("active");
      });

      input.addEventListener("blur", () => {
        if (!input.value) {
          input.nextElementSibling.classList.remove("active");
        }
      });
    });
  }, []); // Empty dependency array to run this effect only once after the first render

  return (
    <div>
      <header className="login-header">
        <img src={Vedive} alt="logo" />
      </header>
      <div className="login-container">
        <h2>Trouble with logging in?</h2>
        <p>
          Enter your email address, phone number, or username, and we’ll send
          you a link to get back into your account.
        </p>
        <hr className="login-hr" />
        <div className="input-login-group">
          <input
            type="text"
            className="input-login-field"
            id="recovery"
            placeholder=" "
          />
          <label className="input-login-label" htmlFor="recovery">
            Email or Phone Number
          </label>
        </div>
        <button className="login-btn">Send Login Link</button>
        <div className="links">
          <Link to="/login" style={{ borderBottom: "solid 1px #0059FF" }}>
            Back to Login
          </Link>
          <p>
            No Account? <Link to="/signup">Create One</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Passreset;