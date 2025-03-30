import React, { useState } from "react";
import { Mail, HelpCircle, Search, Download } from "lucide-react";
import countries from "./countries.json";

const EmailScraper = () => {
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [showCampaignNameInput, setShowCampaignNameInput] = useState(false);

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
      console.log("Sending request to:", `http://ec2-51-21-1-175.eu-north-1.compute.amazonaws.com:3000/api/scrape-emails`);
      console.log("Query:", combinedQuery);
      console.log("Campaign name:", campaignName);

      const res = await fetch(`http://ec2-51-21-1-175.eu-north-1.compute.amazonaws.com:3000/api/scrape-emails`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto bg-white rounded-lg shadow-md border border-gray-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-300">
          <div className="flex items-center space-x-2">
            <Mail className="text-third" size={40} />
            <h1 className="text-4xl font-semibold text-gray-900">Email Scraper</h1>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <HelpCircle size={16} className="text-third" />
            <span>Need help?</span>
            <a href="#" className="text-third underline">
              Watch tutorial
            </a>
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={handlePrepareSearch} className="space-y-6">
            <div className="space-y-4 p-6 border border-gray-400 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 gap-6">
                {/* Keyword Input */}
                <div className="space-y-2">
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
                {/* Country Dropdown */}
                <div className="space-y-2">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Country (Optional)
                  </label>
                  <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="py-2 px-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-third text-secondary"
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
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
              <div className="p-6 border border-gray-400 rounded-lg shadow-sm space-y-4">
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
                <Download className="h-5 w-5 mr-2" />
                {response}
              </div>
            )}
            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-3 rounded-lg text-white font-medium flex items-center ${
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
          {/* Features Description Section */}
          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-medium text-gray-800">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border border-gray-300 rounded-lg text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-third-light text-third mb-4">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium mb-2">Find Relevant Contacts</h3>
                <p className="text-gray-600 text-sm">
                  Search by industry, job title, and location to find targeted business emails.
                </p>
              </div>
              <div className="p-4 border border-gray-300 rounded-lg text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-third-light text-third mb-4">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium mb-2">Automated Email Collection</h3>
                <p className="text-gray-600 text-sm">
                  Our system intelligently searches across multiple sources to find valid email addresses.
                </p>
              </div>
              <div className="p-4 border border-gray-300 rounded-lg text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-third-light text-third mb-4">
                  <Download className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium mb-2">Export to CSV</h3>
                <p className="text-gray-600 text-sm">
                  Download your results as a CSV file for easy import into your email marketing platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailScraper;