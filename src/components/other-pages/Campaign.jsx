import React from 'react'

function Campaign() {
  return (
    <div className="recent-campaigns">
          <h2>Recent Campaigns</h2>
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Date</th>
                <th>Recipients</th>
                <th>Tool Used</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.length ? (
                campaigns.map((campaign, index) => (
                  <tr key={campaign._id}>
                    <td>{index + 1}</td>
                    <td>{campaign.campaignName || "N/A"}</td>
                    <td>{new Date(campaign.createdAt).toLocaleDateString() || "N/A"}</td>
                    <td>{campaign.recipients?.length || "N/A"}</td>
                    <td>{campaign.toolType || "N/A"}</td>
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
  )
}

export default Campaign