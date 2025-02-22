import React, { useState } from "react";
import "./EmailScrapper.css";

const EmailScrapper = () => {
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ask for campaign name
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
      const res = await fetch("http://localhost:3000/api/email-scraper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: combinedQuery, campaignName: campaignNameInput }),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const contentType = res.headers.get("Content-Type");

      if (contentType.includes("application/octet-stream")) {
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
      setError(error.message || "Failed to fetch data. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-[#121212] p-4 pt-[70px] border rounded-lg mt-5">
      <h2 className="text-[32px] font-semibold font-primary mb-4 flex justify-center text-primary">Mail Scraper</h2>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex">
            <label htmlFor="keyword" className="block font-secondary text-[14px] text-primary mt-1">Enter Keyword:</label>
            <input
              id="keyword"
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter the Niches:"
              className="border-gray-300 border p-1 rounded-md ml-2 text-secondary h-[30px]"
            />
          </div>
          <div className="flex">
            <label htmlFor="country" className="block font-secondary text-[14px] text-primary mt-1">Country:</label>
            <input
              id="country"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Enter country"
              className="border-gray-300 border p-1 rounded-md ml-2 text-secondary h-[30px]"
            />
          </div>
        </div>
        <div className="flex mt-2">
          <label htmlFor="city" className="block font-secondary text-[14px] text-primary mt-1">City:</label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            className="border-gray-300 border p-1 rounded-md ml-2 text-secondary h-[30px]"
          />
        </div>
        <div className="mt-4">
          <button
            type="submit"
            disabled={isDownloading}
            className={`bg-third text-[16px] text-primary px-12 py-2 rounded-md font-secondary whitespace-nowrap ${
              isDownloading ? "bg-gray-400 cursor-not-allowed" : "hover:bg-secondary"
            }`}
          >
            {isDownloading ? "Downloading..." : "Scrap Now"}
          </button>
        </div>
      </form>
      {response && <p className="mt-4 text-green-600">{response}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default EmailScrapper;
