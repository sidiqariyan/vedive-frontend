import React, { useState, useEffect, useRef } from "react";
import countries from "./countries.json";
import { Search, DownloadCloud, HelpCircle, ChevronDown } from 'lucide-react';

const NumberScraper = () => {
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [showCampaignNameInput, setShowCampaignNameInput] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  
  // Create ref for dropdown
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
    }

    // Add event listener when dropdown is shown
    if (showCountryDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCountryDropdown]);

  // Clear previous results when component mounts
  useEffect(() => {
    setBusinesses([]);
    setDownloadUrl("");
  }, []);

  // Get auth token from localStorage
  const getAuthToken = () => localStorage.getItem("token");

  const validateForm = () => {
    if (!keyword.trim() && !country.trim() && !city.trim()) {
      setError("At least one field (Keyword, Country, or City) is required.");
      return false;
    }
    if (showCampaignNameInput && !campaignName.trim()) {
      setError("Campaign name is required!");
      return false;
    }
    return true;
  };

  const handlePrepareSearch = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!showCampaignNameInput) {
      setShowCampaignNameInput(true);
      return;
    }
    handleSubmit();
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setError("");
    setResponse("");
    setLoading(true);
    
    try {
      const token = getAuthToken();
      if (!token) {
        setError("Authentication required. Please login again.");
        setLoading(false);
        return;
      }
      
      const combinedQuery = [keyword, country, city].filter(Boolean).join(" ");
      console.log("Sending request to:", `https://vedive.com:3000/api/numberScraper`);
      console.log("Query:", combinedQuery);
      console.log("Campaign name:", campaignName);

      const res = await fetch(`https://vedive.com:3000/api/numberScraper`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        params: {
          query: combinedQuery,
          campaignName: campaignName
        }
      });

      if (!res.ok) {
        let errorMessage = "Failed to fetch data";
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || `HTTP error! Status: ${res.status}`;
        } catch (parseError) {
          errorMessage = `HTTP error! Status: ${res.status}`;
        }
        throw new Error(errorMessage);
      }

      const jsonResponse = await res.json();
      
      if (!jsonResponse.businesses || jsonResponse.businesses.length === 0) {
        setError("No results found.");
      } else {
        setBusinesses(jsonResponse.businesses);
        setDownloadUrl(jsonResponse.csvDownloadUrl);
        setResponse("Numbers scraped successfully. Click below to download.");
        setCampaignName("");
        setShowCampaignNameInput(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!downloadUrl) {
      setError("No file available for download.");
      return;
    }
    
    // Get auth token for download request
    const token = getAuthToken();
    if (!token) {
      setError("Authentication required for download. Please login again.");
      return;
    }
    
    try {
      const response = await fetch(downloadUrl, {
        headers: { 
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      // Optionally, extract filename from response headers
      const contentDisposition = response.headers.get("content-disposition");
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
      setError("Download failed. Please try again.");
    }
  };

  const handleReset = () => {
    setKeyword("");
    setCountry("");
    setCountrySearch("");
    setCity("");
    setError("");
    setResponse("");
    setBusinesses([]);
    setDownloadUrl("");
    setCampaignName("");
    setShowCampaignNameInput(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-0 sm:p-6 md:p-8">
      <div className="mx-auto max-w-6xl bg-white rounded-lg shadow-md border border-gray-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-b border-gray-300">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <Search className="text-third hidden sm:block" size={40} />
            <Search className="text-third sm:hidden" size={32} />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">Number Scraper</h1>
          </div>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
            <HelpCircle size={16} className="text-third" />
            <span>Need help?</span>
            <a href="#" className="text-third underline">
              Watch tutorial
            </a>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <form onSubmit={handlePrepareSearch} className="space-y-6">
            <div className="space-y-4 p-4 sm:p-6 border border-gray-400 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Keyword Input */}
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="keyword" className="block text-sm font-medium text-gray-700">
                    Enter Keyword
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="keyword"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-third text-secondary"
                      placeholder="e.g., restaurant chicago"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500">
                    Enter keywords to find business phone numbers (business type, location)
                  </p>
                </div>
                {/* Enhanced Country Dropdown with Click Outside Detection */}
                <div className="space-y-2" ref={dropdownRef}>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Country (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="countrySearch"
                      value={countrySearch}
                      onChange={(e) => {
                        setCountrySearch(e.target.value);
                        setShowCountryDropdown(true);
                      }}
                      onFocus={() => setShowCountryDropdown(true)}
                      className="py-2 px-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-third text-secondary"
                      placeholder="Search countries..."
                    />
                    <ChevronDown 
                      className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 cursor-pointer" 
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)} 
                    />
                    {showCountryDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-third text-secondary"
                            placeholder="Type to filter..."
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            // Stop propagation to prevent closing when clicking this input
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <ul className="py-1">
                          {countries
                            .filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()))
                            .map((countryItem) => (
                              <li 
                                key={countryItem.code} 
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-secondary"
                                onClick={() => {
                                  setCountry(countryItem.name);
                                  setCountrySearch(countryItem.name);
                                  setShowCountryDropdown(false);
                                }}
                              >
                                {countryItem.name}
                              </li>
                            ))
                          }
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                {/* City Input */}
                <div className="space-y-2">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City (Optional)
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="py-2 px-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-third text-secondary"
                    placeholder="e.g., San Francisco"
                  />
                </div>
              </div>
            </div>
            {/* Campaign Name Input */}
            {showCampaignNameInput && (
              <div className="p-4 sm:p-6 border border-gray-400 rounded-lg shadow-sm space-y-4">
                <div className="space-y-2">
                  <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    id="campaignName"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="py-2 px-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-third text-secondary"
                    placeholder="e.g., March 2025 Outreach"
                  />
                  <p className="text-xs text-gray-500">
                    Give your campaign a name for easier tracking
                  </p>
                </div>
              </div>
            )}
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 text-red-700 border border-red-300 rounded-lg">
                {error}
              </div>
            )}
            {/* Success Message */}
            {response && (
              <div className="p-4 bg-green-50 text-green-700 border border-green-300 rounded-lg flex items-center">
                <DownloadCloud className="h-5 w-5 mr-2" />
                {response}
              </div>
            )}
            {/* Buttons */}
            <div className="flex justify-center space-x-4">
              {downloadUrl && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white font-medium bg-green-600 hover:bg-green-700"
                >
                  <DownloadCloud className="inline h-5 w-5 mr-2" />
                  Download CSV
                </button>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-gray-700 font-medium border border-gray-300 hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white font-medium flex items-center ${
                  loading ? "bg-gray-500" : "bg-third hover:bg-third-dark"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    {showCampaignNameInput ? (
                      <>
                        <Search className="h-5 w-5 mr-2" />
                        Scrape Numbers
                      </>
                    ) : (
                      "Continue"
                    )}
                  </>
                )}
              </button>
            </div>
          </form>
          {/* Features Description Section */}
          <div className="mt-8 sm:mt-12 space-y-6">
            <h2 className="text-xl sm:text-2xl font-medium text-gray-800">How It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-4 border border-gray-300 rounded-lg text-center">
                <div className="inline-flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-third-light text-third mb-3 sm:mb-4">
                  <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-base sm:text-lg text-black font-medium mb-1 sm:mb-2">Find Business Numbers</h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Search by business type and location to find targeted phone numbers.
                </p>
              </div>
              <div className="p-4 border border-gray-300 rounded-lg text-center">
                <div className="inline-flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-third-light text-third mb-3 sm:mb-4">
                  <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-base sm:text-lg text-black font-medium mb-1 sm:mb-2">Automated Number Collection</h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Our system intelligently searches across multiple sources to find valid business phone numbers.
                </p>
              </div>
              <div className="p-4 border border-gray-300 rounded-lg text-center">
                <div className="inline-flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-third-light text-third mb-3 sm:mb-4">
                  <DownloadCloud className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-base sm:text-lg text-black font-medium mb-1 sm:mb-2">Export to CSV</h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Download your results as a CSV file for easy import into your CRM or outreach platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumberScraper;