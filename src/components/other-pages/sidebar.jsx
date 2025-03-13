import { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  return (
    <div className="sidebar bg-zinc-900" style={{backgroundColor: "#fff"}}>
      <NavLink
        className={({ isActive }) => (isActive ? "big-a active" : "big-a")}
        style={({ isActive }) => ({ color: isActive ? "#1E90FF" : "#000"  })}
        to="/dashboard"
      >
        Dashboard
      </NavLink>
      <NavLink className="big-a" to="#">
        Campaigns
      </NavLink>
      <NavLink
        className={({ isActive }) => (isActive ? "big-a active" : "big-a")}
        style={({ isActive }) => ({ color: isActive ? "#1E90FF" : "#000" })}
        to="/account"
      >
        Account
      </NavLink>
      <NavLink className="big-a" to="#">
        Billing
      </NavLink>
      {/* Dropdown for Tools */}
      <div className="dropdown">
        <button className="big-a dropdown-btn" onClick={() => setIsToolsOpen(!isToolsOpen)}>
          Tools ▾
        </button>
        {isToolsOpen && (
          <div className="dropdown-content">
            <NavLink className="small-a" to="#">
              Mail Sender
            </NavLink>
            <NavLink className="small-a" to="#">
              Mail Scraper
            </NavLink>
            <NavLink className="small-a" to="#">
              Gmail Sender
            </NavLink>
            <NavLink className="small-a" to="#">
              WhatsApp Sender
            </NavLink>
            <NavLink className="small-a" to="#">
              Number Scraper
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;