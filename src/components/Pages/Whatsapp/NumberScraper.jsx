import React, { useState } from "react";
import axios from "axios";

const NumberScraper = () => {
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (event) => {
    event.preventDefault();
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
      const response = await axios.get("http://localhost:3000/api/numberScraper", {
        params: { query: combinedQuery, campaignName: campaignNameInput }, // Include campaign name in the request
      });

      // Extract businesses and csvFileName from the response
      const { businesses, csvFileName } = response.data;

      if (!businesses || businesses.length === 0) {
        setError("No results found.");
      } else {
        setBusinesses(businesses); // Set the businesses array
        localStorage.setItem("csvFileName", csvFileName); // Save the file name for download
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const csvFileName = localStorage.getItem("csvFileName");
    if (!csvFileName) {
      alert("No file available for download.");
      return;
    }
    window.open(`http://localhost:3000/api/download?filename=${csvFileName}`);
  };

  return (
    <div className="bg-[#121212] p-4 pt-[60px] border rounded-lg absolute mt-5 -ml-8">
      <div className="">
        {/* How-to Section */}
        <div className="how-to-sec overflow-wrap break-word">
          <span className="text-primary flex text-base">
            <svg className="mr-2 ml-2" width="12" height="15" viewBox="0 0 20 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="12.069" r="10" fill="#FFE100" />
              <path d="M9.63863 7.45658C9.35173 7.45658 9.10897 7.35727 8.91035 7.15865C8.71173 6.96003 8.61242 6.71727 8.61242 6.43037C8.61242 6.14348 8.71173 5.90072 8.91035 5.7021C9.10897 5.50348 9.35173 5.40417 9.63863 5.40417C9.91449 5.40417 10.1462 5.50348 10.3338 5.7021C10.5324 5.90072 10.6317 6.14348 10.6317 6.43037C10.6317 6.71727 10.5324 6.96003 10.3338 7.15865C10.1462 7.35727 9.91449 7.45658 9.63863 7.45658ZM10.3669 8.92969V18H8.86069V8.92969H10.3669Z" fill="#0F0E0D" />
            </svg>
            <span className="text-[12px] mt-[-4px]">How to do? (</span>
            <a href="#" className="underline text-third text-[12px] mt-[-4px]">
              Click Here - Video
            </a>{" "}
            <span className="text-[12px] mt-[-4px]">)</span>
          </span>
        </div>
        {/* Main Heading */}
        <h2 className="text-[32px] font-semibold font-primary mb-4 -mt-4 flex justify-center text-primary">Number Scraper</h2>
        {/* Form */}
        <form className="space-y-4" onSubmit={handleSearch}>
          <div className="flex gap-4">
            <div className="flex">
              <label htmlFor="" className="block font-secondary text-[14px] text-primary mt-1">
                Enter Keyword:
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Enter keyword"
                className="border-gray-300 border p-1 ml-2 rounded-md text-secondary"
                style={{ height: "30px" }}
              />
            </div>
            <div className="flex">
              <label htmlFor="" className="block font-secondary text-[14px] text-primary mt-1">
                Country:
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Enter country"
                className="border-gray-300 border p-1 ml-2 rounded-md text-secondary"
                style={{ height: "30px" }}
              />
            </div>
          </div>
          <div className="flex ml-[70px]">
            <label htmlFor="" className="block font-secondary text-[14px] text-primary mt-1">
              City:
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city"
              className="border-gray-300 border p-1 ml-2 rounded-md text-secondary"
              style={{ height: "30px" }}
            />
          </div>
          <div className="flex justify-center mt-[20px]">
            <button
              type="submit"
              className="mt-4 bg-third text-[16px] text-primary px-12 py-2 rounded-md font-secondary whitespace-nowrap flex items-center justify-center"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>
        {/* Error Message */}
        {error && <p className="text-red-400 text-center mt-4">{error}</p>}
        {/* Download Button */}
        {localStorage.getItem("csvFileName") && (
          <div className="mt-6">
            <button
              onClick={handleDownload}
              className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition duration-300"
            >
              Download CSV
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NumberScraper;