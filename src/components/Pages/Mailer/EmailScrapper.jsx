import React, { useState, useEffect, useRef } from "react";
import countries from "./countries.json";
import { Mail, Search, Download, HelpCircle, ChevronDown } from 'lucide-react';
import { Helmet } from 'react-helmet';

const EmailScraper = () => {
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [showCampaignNameInput, setShowCampaignNameInput] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  
  // Create ref for dropdown
  const dropdownRef = useRef(null);
  
  // API URL should come from environment or config
  const API_URL = "http://localhost:3000";

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

  const validateForm = () => {
    if (!keyword.trim()) {
      setError("Keyword is required!");
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
    setIsLoading(true);
    try {
      const combinedQuery = [keyword, country, city].filter(Boolean).join(" ");
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("You need to be logged in to use this feature");
        setIsLoading(false);
        return;
      }
      
      console.log("Sending request to:", `${API_URL}/api/email-scraper`);
      console.log("Query:", combinedQuery);
      console.log("Campaign name:", campaignName);

      const res = await fetch(`${API_URL}/api/email-scraper`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          query: combinedQuery, 
          campaignName
        }),
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

      const contentType = res.headers.get("Content-Type");
      if (contentType && contentType.includes("application/octet-stream")) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        const contentDisposition = res.headers.get('Content-Disposition');
        let filename = 'emails.csv';
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1];
          }
        }
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setResponse(`Emails scraped successfully and downloaded as ${filename}`);
        setCampaignName("");
        setShowCampaignNameInput(false);
      } else {
        const jsonResponse = await res.json();
        setResponse(jsonResponse.message || "Data retrieved successfully but no downloadable file was produced.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of component remains the same
  return (
    <div className="min-h-screen bg-gray-50 p-0 sm:p-6 md:p-8">
        <Helmet>
      <title>Email Scraper Tool | Fast Email Extraction | Vedive</title>
      <meta name="description" content="Extract emails quickly with Vedive's email scraper tool. Scrape accurate email data from websites for marketing. Start now!"/>
      </Helmet>
      {/* Component JSX remains unchanged */}
      <div className="mx-auto max-w-6xl bg-white rounded-lg shadow-md border border-gray-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-b border-gray-300">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <Mail className="text-third hidden sm:block" size={40} />
            <Mail className="text-third sm:hidden" size={32} />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">Email Scraper</h1>
          </div>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
            <HelpCircle size={16} className="text-third" />
            <span>Need help?</span>
            <a href="https://www.youtube.com/watch?v=0VbORIUTG1M&ab_channel=Vedive" className="text-third underline">
              Watch tutorial
            </a>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <form onSubmit={handlePrepareSearch} className="space-y-6">
            <div className="space-y-4 p-4 sm:p-6 border border-gray-400 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Form fields remain unchanged */}
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
                      placeholder="e.g., web developer new york"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500">
                    Enter keywords to find business emails (job title, industry, location)
                  </p>
                </div>
                
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
            {error && (
              <div className="p-4 bg-red-50 text-red-700 border border-red-300 rounded-lg">
                {error}
              </div>
            )}
            {response && (
              <div className="p-4 bg-green-50 text-green-700 border border-green-300 rounded-lg flex items-center">
                <Download className="h-5 w-5 mr-2" />
                {response}
              </div>
            )}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white font-medium flex items-center ${
                  isLoading ? "bg-gray-500" : "bg-third hover:bg-third-dark"
                }`}
              >
                {isLoading ? (
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
                        Scrape Emails
                      </>
                    ) : (
                      "Continue"
                    )}
                  </>
                )}
              </button>
            </div>
          </form>
          {/* Features section remains unchanged */}
        </div>
      </div>
    </div>
  );
};

export default EmailScraper;