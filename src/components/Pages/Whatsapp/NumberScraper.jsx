import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, DownloadCloud } from "lucide-react"; // Import icons for consistency

const NumberScraper = () => {
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  // Get auth token from localStorage
  const getAuthToken = () => localStorage.getItem("token");

  // Clear previous results when component mounts
  useEffect(() => {
    setBusinesses([]);
    setDownloadUrl("");
  }, []);

  const handleSearch = async (event) => {
    if (event) event.preventDefault();
    
    // Prompt user to enter campaign name
    const campaignNameInput = prompt("Please name your campaign:");
    if (!campaignNameInput || campaignNameInput.trim() === "") {
      alert("Campaign name is required!");
      return;
    }
    
    const combinedQuery = [keyword, country, city].filter(Boolean).join(" ").trim();
    if (!combinedQuery) {
      setError("At least one field (Keyword, Country, or City) is required.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const token = getAuthToken();
      if (!token) {
        setError("Authentication required. Please login again.");
        setLoading(false);
        return;
      }
      
      const response = await axios.get("http://ec2-51-21-1-175.eu-north-1.compute.amazonaws.com:3000/api/numberScraper", {
        params: { query: combinedQuery, campaignName: campaignNameInput },
        headers: { Authorization: `Bearer ${token}` }
      });

      // Extract businesses and download URL from the response
      const { businesses, csvDownloadUrl } = response.data;

      if (!businesses || businesses.length === 0) {
        setError("No results found.");
      } else {
        setBusinesses(businesses);
        setDownloadUrl(csvDownloadUrl); // Store the full download URL
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.error || "Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Updated handleDownload using axios with responseType 'blob'
  const handleDownload = async () => {
    if (!downloadUrl) {
      alert("No file available for download.");
      return;
    }
    
    // Get auth token for download request
    const token = getAuthToken();
    if (!token) {
      alert("Authentication required for download. Please login again.");
      return;
    }
    
    try {
      const response = await axios.get(downloadUrl, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Create a blob URL and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      
      // Optionally, extract filename from response headers
      const contentDisposition = response.headers["content-disposition"];
      let filename = "businesses.csv";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download error:", err);
      alert("Download failed. Please try again.");
    }
  };

  const handleReset = () => {
    setKeyword("");
    setCountry("");
    setCity("");
    setError("");
    setBusinesses([]);
    setDownloadUrl("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto bg-white rounded-lg shadow-md border border-gray-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-300">
          <div className="flex items-center space-x-2">
            <Search className="text-third" size={40} />
            <h1 className="text-[40px] font-semibold text-gray-900">Number Scraper</h1>
          </div>
          <div className="flex items-center space-x-4">
            {downloadUrl && (
              <button className="text-gray-500 hover:text-gray-700" onClick={handleDownload}>
                <DownloadCloud size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Search Configuration */}
          <div className="space-y-4 p-6 border border-gray-300 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <Search className="text-third" size={20} />
              <h2 className="text-lg font-medium text-gray-900">Search Configuration</h2>
            </div>
            <form onSubmit={handleSearch} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keyword</label>
                <input
                  type="text"
                  id="keyword"
                  placeholder="Enter keyword"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg  text-secondary"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  id="country"
                  placeholder="Enter country"
                  className="w-full px-3 py-2 border border-gray-300  text-secondary"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  id="city"
                  placeholder="Enter city"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-secondary"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              
              {/* Submit button inside the form */}
              <div className="col-span-2 flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={handleReset}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-third hover:bg-blue-700"
                  }`}
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Download Button */}
          {downloadUrl && businesses.length > 0 && (
            <div className="flex justify-end">
              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-500 hover:bg-green-700"
              >
                Download CSV
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NumberScraper;
