import React, { useState, useEffect } from "react";
import { Mail, HelpCircle, Search } from 'lucide-react';
import countries from './countries.json';

const EmailScraper = () => {
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [token, setToken] = useState("");

  // Load token when component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate keyword is entered
    if (!keyword.trim()) {
      setError("Keyword is required!");
      return;
    }

    // Validate if token exists
    if (!token) {
      setError("You must be logged in to use this feature!");
      return;
    }

    const campaignNameInput = prompt("Please name your campaign:")?.trim();
    if (!campaignNameInput) {
      alert("Campaign name is required!");
      return;
    }

    setError("");
    setResponse("");
    setIsDownloading(true);

    try {
      const combinedQuery = [keyword, country, city].filter(Boolean).join(" ");
      const res = await fetch("http://localhost:3000/api/scrape-emails", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`  // Add token to the request
        },
        body: JSON.stringify({ 
          query: combinedQuery, 
          campaignName: campaignNameInput 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! Status: ${res.status}`);
      }

      const contentType = res.headers.get("Content-Type");

      if (contentType && contentType.includes("application/octet-stream")) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "emails.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setResponse("CSV file downloaded successfully!");
      } else {
        const jsonResponse = await res.json();
        setResponse(jsonResponse.message || "Data retrieved successfully.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Failed to fetch data. Please try again.");
      
      // Handle authentication errors
      if (error.message.includes("401") || error.message.toLowerCase().includes("unauthorized")) {
        setError("Authentication failed. Please log in again.");
        // Optionally redirect to login page
        // window.location.href = "/login";
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto bg-white rounded-lg shadow-md border border-gray-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-300">
          <div className="flex items-center space-x-2">
            <Mail className="text-indigo-500" size={40} />
            <h1 className="text-4xl font-semibold text-third">Email Scraper</h1>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <HelpCircle size={16} className="text-indigo-500" />
            <span>Need help?</span>
            <a href="#" className="text-indigo-500 underline">
              Watch tutorial
            </a>
          </div>
        </div>

        <div className="p-6">
          {!token && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
              <p className="text-sm text-yellow-700">You need to be logged in to use this feature. Please log in first.</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
                      className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pl-10 text-gray-700"
                      placeholder="Enter the niche or keyword"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      required
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Country Dropdown */}
                <div className="space-y-2">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Select Country
                  </label>
                  <select
                    id="country"
                    className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value="" className="text-gray-700">Select a country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.name} className="text-gray-700">
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City Input */}
                <div className="space-y-2">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    Enter City
                  </label>
                  <input
                    type="text"
                    id="city"
                    className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isDownloading || !token}
                className={`px-8 py-3 rounded-lg text-sm font-medium text-white flex items-center ${
                  isDownloading || !token
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                <Search className="mr-2 h-4 w-4" />
                {isDownloading ? 'Downloading...' : 'Scrape Emails'}
              </button>
            </div>
          </form>

          {/* Status Messages */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-300 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          {response && (
            <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg">
              <p className="text-sm text-green-600">{response}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailScraper;