import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import emailImg from "../assets/email(1) 1.svg";
import whatsappImg from "../assets/whatsapp 1.svg";
import dataImg from "../assets/data 1.svg";
import selfieImg from "../assets/selfie 1.svg";
import Navbar from "../Pages/Hero/Header-2";
import "./thirdstyles.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // State to store user data
  const [campaigns, setCampaigns] = useState([]); // State to store campaign data
  const [error, setError] = useState(null); // State to handle errors

  // Helper function to fetch data from the backend
  const fetchData = async (url, options = {}) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setError(error.message);
      navigate("/login"); // Redirect to login on critical errors
      return null;
    }
  };

  // Fetch user and campaign data when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login if no token exists
      return;
    }

    // Fetch user data
    const fetchUserData = async () => {
      const userData = await fetchData("http://localhost:3000/api/dashboard", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (userData?.user) {
        setUser(userData.user);
      }
    };

    // Fetch campaign data (example placeholder)
    const fetchCampaignData = async () => {
      const campaignData = await fetchData("http://localhost:3000/api/campaigns", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (campaignData) {
        setCampaigns(campaignData);
      }
    };

    // Apply specific styles for the body when the Dashboard page is mounted
    document.body.style.backgroundColor = "#ffffff"; // Example: Set background color

    // Fetch data
    fetchUserData();
    fetchCampaignData();

    // Clean up when the component is unmounted
    return () => {
      document.body.style.backgroundColor = ""; // Reset the background color
    };
  }, [navigate]);

  // Error state
  if (error) {
    return <div className="error">An error occurred: {error}</div>;
  }

  return (
    <>
      <Navbar /> {/* Header is placed outside of dashboard-contain */}
      <div className="Dashboard-contain">
        <div className="sidebar">
          <a className="big-a" href="#">
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
          {/* Dynamically display the user's name */}
          <h1>Welcome {user?.name || "Guest"}</h1>
          <hr className="hr2" />
          <div className="cards">
            {campaigns.map((campaign, index) => (
              <div className="card" key={index}>
                <img
                  src={
                    campaign.type === "email"
                      ? emailImg
                      : campaign.type === "whatsapp"
                      ? whatsappImg
                      : campaign.type === "data"
                      ? dataImg
                      : selfieImg
                  }
                  alt={`${campaign.type} Campaign`}
                />
                <div>
                  <h3>{campaign.name}</h3>
                  <p>{campaign.description}</p>
                </div>
              </div>
            ))}
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
                {campaigns.length > 0 ? (
                  campaigns.map((campaign, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{campaign.name || "N/A"}</td>
                      <td>{campaign.date || "N/A"}</td>
                      <td>{campaign.recipients || "N/A"}</td>
                      <td>{campaign.sentBy || "N/A"}</td>
                      <td>{campaign.status || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No recent campaigns available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;