import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import emailImg from "../assets/email(1) 1.svg";
import whatsappImg from "../assets/whatsapp 1.svg";
import dataImg from "../assets/data 1.svg";
import selfieImg from "../assets/selfie 1.svg";
import Navbar from "../Pages/Hero/Header-2";
import "./thirdstyles.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState(null);

  // Helper function to fetch data from the backend
  const fetchData = async (url, options = {}) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      console.error("Error fetching data:", err.message);
      setError(err.message);
      navigate("/login");
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
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

    // Fetch campaign data
    // const fetchCampaignData = async () => {
    //   const campaignData = await fetchData("http://localhost:3000/api/campaigns", {
    //     method: "GET",
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });
    //   if (campaignData) {
    //     setCampaigns(campaignData);
    //   }
    // };

    // Set specific styles for the Dashboard page
    document.body.style.backgroundColor = "#ffffff";

    fetchUserData();
    // fetchCampaignData();

    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [navigate]);

  if (error) {
    return <div className="error">An error occurred: {error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="Dashboard-contain">
        <div className="sidebar">
          <Link className="big-a" to="/dashboard">Dashboard</Link>
          <Link className="big-a" to="/campaigns">Campaigns</Link>
          <Link className="big-a" to="/account">Account</Link>
          <Link className="big-a" to="/billing">Billing</Link>
          <div className="big-a">Tools ▾</div>
          <Link className="small-a" to="/mail-sender">Mail Sender</Link>
          <Link className="small-a" to="/mail-scraper">Mail Scraper</Link>
          <Link className="small-a" to="/gmail-sender">Gmail Sender</Link>
          <Link className="small-a" to="/whatsapp-sender">WhatsApp Sender</Link>
          <Link className="small-a" to="/number-scraper">Number Scraper</Link>
        </div>
        <div className="main-content">
          <h1>Welcome {user?.name || "Guest"}</h1>
          <hr className="hr2" />
          <div className="cards">
            {/* {campaigns.map((campaign, index) => (
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
            ))} */}
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
