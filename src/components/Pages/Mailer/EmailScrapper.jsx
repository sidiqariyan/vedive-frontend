import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import countries from "./countries.json";
import { Mail, Search, Download, HelpCircle, ChevronDown } from 'lucide-react';
import { Helmet } from 'react-helmet';

// Constants
const API_URL = process.env.REACT_APP_API_URL || "https://vedive.com:3000";
const MAX_DROPDOWN_ITEMS = 50; // Limit dropdown items for better performance

// Custom hooks
const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback]);
};

const useAuth = () => {
  const getToken = useCallback(() => {
    try {
      return localStorage.getItem("token");
    } catch (error) {
      console.warn("localStorage not available:", error);
      return null;
    }
  }, []);

  return { getToken };
};

// Utility functions
const createFileName = (contentDisposition, defaultName = 'emails.csv') => {
  if (!contentDisposition) return defaultName;
  
  const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
  return filenameMatch?.[1] || defaultName;
};

const downloadFile = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  
  // Use more reliable download method
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const EmailScraper = () => {
  // State management with better organization
  const [formData, setFormData] = useState({
    keyword: "",
    country: "",
    city: "",
    campaignName: ""
  });
  
  const [ui, setUi] = useState({
    response: "",
    error: "",
    isLoading: false,
    showCampaignNameInput: false,
    countrySearch: '',
    showCountryDropdown: false
  });

  const dropdownRef = useRef(null);
  const { getToken } = useAuth();

  // Memoized filtered countries for better performance
  const filteredCountries = useMemo(() => {
    if (!ui.countrySearch) return countries.slice(0, MAX_DROPDOWN_ITEMS);
    
    return countries
      .filter(country => 
        country.name.toLowerCase().includes(ui.countrySearch.toLowerCase())
      )
      .slice(0, MAX_DROPDOWN_ITEMS);
  }, [ui.countrySearch]);

  // Custom hook for click outside
  useClickOutside(dropdownRef, useCallback(() => {
    setUi(prev => ({ ...prev, showCountryDropdown: false }));
  }, []));

  // Memoized validation function
  const validateForm = useCallback(() => {
    if (!formData.keyword.trim()) {
      setUi(prev => ({ ...prev, error: "Keyword is required!" }));
      return false;
    }
    if (ui.showCampaignNameInput && !formData.campaignName.trim()) {
      setUi(prev => ({ ...prev, error: "Campaign name is required!" }));
      return false;
    }
    return true;
  }, [formData.keyword, formData.campaignName, ui.showCampaignNameInput]);

  // Optimized form handlers
  const updateFormData = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (ui.error) {
      setUi(prev => ({ ...prev, error: "" }));
    }
  }, [ui.error]);

  const updateUi = useCallback((updates) => {
    setUi(prev => ({ ...prev, ...updates }));
  }, []);

  // API call with better error handling
  const makeAPIRequest = useCallback(async (query, campaignName) => {
    const token = getToken();
    
    if (!token) {
      throw new Error("You need to be logged in to use this feature");
    }

    const response = await fetch(`${API_URL}/api/email-scraper`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ query, campaignName }),
    });

    if (!response.ok) {
      let errorMessage = "Failed to fetch data";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || `HTTP error! Status: ${response.status}`;
      } catch {
        errorMessage = `HTTP error! Status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return response;
  }, [getToken]);

  // Handle file download
  const handleFileDownload = useCallback(async (response) => {
    const blob = await response.blob();
    const contentDisposition = response.headers.get('Content-Disposition');
    const filename = createFileName(contentDisposition);
    
    downloadFile(blob, filename);
    
    return `Emails scraped successfully and downloaded as ${filename}`;
  }, []);

  // Main submit handler
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    updateUi({
      error: "",
      response: "",
      isLoading: true
    });

    try {
      const combinedQuery = [formData.keyword, formData.country, formData.city]
        .filter(Boolean)
        .join(" ");
      
      console.log("Sending request:", { query: combinedQuery, campaignName: formData.campaignName });

      const response = await makeAPIRequest(combinedQuery, formData.campaignName);
      
      const contentType = response.headers.get("Content-Type");
      let successMessage;

      if (contentType?.includes("application/octet-stream")) {
        successMessage = await handleFileDownload(response);
        // Reset form after successful download
        setFormData(prev => ({ ...prev, campaignName: "" }));
        updateUi({ showCampaignNameInput: false });
      } else {
        const jsonResponse = await response.json();
        successMessage = jsonResponse.message || "Data retrieved successfully but no downloadable file was produced.";
      }

      updateUi({ response: successMessage });
    } catch (error) {
      console.error("Error:", error);
      updateUi({ error: error.message || "Failed to fetch data. Please try again." });
    } finally {
      updateUi({ isLoading: false });
    }
  }, [validateForm, formData, makeAPIRequest, handleFileDownload, updateUi]);

  // Form preparation handler
  const handlePrepareSearch = useCallback((e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    if (!ui.showCampaignNameInput) {
      updateUi({ showCampaignNameInput: true });
      return;
    }
    
    handleSubmit();
  }, [validateForm, ui.showCampaignNameInput, handleSubmit, updateUi]);

  // Country selection handler
  const handleCountrySelect = useCallback((countryName) => {
    updateFormData('country', countryName);
    updateUi({
      countrySearch: countryName,
      showCountryDropdown: false
    });
  }, [updateFormData, updateUi]);

  // Country search handler
  const handleCountrySearch = useCallback((value) => {
    updateUi({
      countrySearch: value,
      showCountryDropdown: true
    });
  }, [updateUi]);

  return (
    <div className="min-h-screen bg-gray-50 p-0 sm:p-6 md:p-8">
      <Helmet>
        <title>Email Scraper Tool | Fast Email Extraction | Vedive</title>
        <meta name="description" content="Extract emails quickly with Vedive's email scraper tool. Scrape accurate email data from websites for marketing. Start now!"/>
      </Helmet>
      
      <div className="mx-auto max-w-6xl bg-white rounded-lg shadow-md border border-gray-300">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-b border-gray-300">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <Mail className="text-third hidden sm:block" size={40} />
            <Mail className="text-third sm:hidden" size={32} />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">
              Email Scraper
            </h1>
          </div>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
            <HelpCircle size={16} className="text-third" />
            <span>Need help?</span>
            <a href="#" className="text-third underline hover:text-third-dark transition-colors">
              Watch tutorial
            </a>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <form onSubmit={handlePrepareSearch} className="space-y-6">
            {/* Main form fields */}
            <section className="space-y-4 p-4 sm:p-6 border border-gray-400 rounded-lg shadow-sm">
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
                      value={formData.keyword}
                      onChange={(e) => updateFormData('keyword', e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-third text-secondary transition-all"
                      placeholder="e.g., web developer new york"
                      aria-describedby="keyword-help"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  <p id="keyword-help" className="text-xs text-gray-500">
                    Enter keywords to find business emails (job title, industry, location)
                  </p>
                </div>
                
                {/* Country Dropdown */}
                <div className="space-y-2" ref={dropdownRef}>
                  <label htmlFor="countrySearch" className="block text-sm font-medium text-gray-700">
                    Country (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="countrySearch"
                      value={ui.countrySearch}
                      onChange={(e) => handleCountrySearch(e.target.value)}
                      onFocus={() => updateUi({ showCountryDropdown: true })}
                      className="py-2 px-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-third text-secondary transition-all"
                      placeholder="Search countries..."
                      autoComplete="country"
                    />
                    <ChevronDown 
                      className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" 
                      onClick={() => updateUi({ showCountryDropdown: !ui.showCountryDropdown })}
                      aria-label="Toggle country dropdown"
                    />
                    
                    {ui.showCountryDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredCountries.length > 0 ? (
                          <ul className="py-1" role="listbox">
                            {filteredCountries.map((countryItem) => (
                              <li 
                                key={countryItem.code} 
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-secondary transition-colors"
                                onClick={() => handleCountrySelect(countryItem.name)}
                                role="option"
                              >
                                {countryItem.name}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="px-3 py-2 text-gray-500 text-sm">
                            No countries found
                          </div>
                        )}
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
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                    className="py-2 px-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-third text-secondary transition-all"
                    placeholder="e.g., San Francisco"
                    autoComplete="address-level2"
                  />
                </div>
              </div>
            </section>

            {/* Campaign Name Input */}
            {ui.showCampaignNameInput && (
              <section className="p-4 sm:p-6 border border-gray-400 rounded-lg shadow-sm space-y-4">
                <div className="space-y-2">
                  <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    id="campaignName"
                    value={formData.campaignName}
                    onChange={(e) => updateFormData('campaignName', e.target.value)}
                    className="py-2 px-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-third text-secondary transition-all"
                    placeholder="e.g., March 2025 Outreach"
                    aria-describedby="campaign-help"
                    autoFocus
                  />
                  <p id="campaign-help" className="text-xs text-gray-500">
                    Give your campaign a name for easier tracking
                  </p>
                </div>
              </section>
            )}

            {/* Error Message */}
            {ui.error && (
              <div className="p-4 bg-red-50 text-red-700 border border-red-300 rounded-lg" role="alert">
                {ui.error}
              </div>
            )}

            {/* Success Message */}
            {ui.response && (
              <div className="p-4 bg-green-50 text-green-700 border border-green-300 rounded-lg flex items-center" role="status">
                <Download className="h-5 w-5 mr-2 flex-shrink-0" />
                {ui.response}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={ui.isLoading}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white font-medium flex items-center transition-all duration-200 ${
                  ui.isLoading 
                    ? "bg-gray-500 cursor-not-allowed" 
                    : "bg-third hover:bg-third-dark active:scale-95 shadow-lg hover:shadow-xl"
                }`}
              >
                {ui.isLoading ? (
                  <>
                    <svg 
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    {ui.showCampaignNameInput ? (
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
        </main>
      </div>
    </div>
  );
};

export default EmailScraper;