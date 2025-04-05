import React, { useState } from "react";
import axios from "axios";

const CampaignForm = ({ onSave, onClose }) => {
  const [campaignName, setCampaignName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!campaignName) {
      alert("Please provide a campaign name.");
      return;
    }

    try {
      // Save campaign data to the backend
      const response = await axios.post("http://ec2-51-21-1-175.eu-north-1.compute.amazonaws.com:3000/api/campaign", {
        campaignName,
        toolType: "whatsapp-bulk-sender",
      });

      // Pass the saved campaign data back to the parent
      onSave(response.data);

      // Close the popup
      onClose();
    } catch (error) {
      console.error("Error saving campaign:", error);
      alert("Failed to save campaign.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-white">Create Campaign</h2>
      <div>
        <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700">
          Campaign Name:
        </label>
        <input
          id="campaignName"
          type="text"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm text-secondary"
        />
      </div>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="py-1 px-4 bg-gray-500 text-white rounded-md shadow-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="py-1 px-4 bg-third text-white rounded-md shadow-md"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default CampaignForm;