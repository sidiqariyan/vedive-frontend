import React, { useState } from "react";
import "./EmailScrapper.css";
import { useAuth } from "./UseAuth"; // Import the login check utility

const EmailScrapper = () => {
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadReady, setIsDownloadReady] = useState(false);
  const { isLoggedIn } = useAuth(); // Check login status

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Please log in to use this feature.");
      return;
    }

    setError("");
    setResponse("");
    setIsDownloading(true);

    try {
      const combinedQuery = [keyword, country, city].filter((item) => item.trim()).join(" ");
      const res = await fetch("http://localhost:3000/api/email-scraper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: combinedQuery }),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      if (res.headers.get("Content-Type") === "application/octet-stream") {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "emails.csv";
        link.click();
        window.URL.revokeObjectURL(url);
        setResponse("CSV file downloaded successfully!");
      } else {
        setResponse(await res.json());
      }
    } catch (error) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-[#121212] p-4 pt-[70px] border rounded-lg mt-5">
      <div>
        <div className="how-to-sec">
          <span className="text-primary flex text-base mt-1">
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
        <h2 className="text-[32px] font-semibold font-primary mb-4 -mt-4 flex justify-center text-primary">Mail Scraper</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex">
              <label htmlFor="keyword" className="block font-secondary text-[14px] text-primary mt-1">
                Enter Keyword:
              </label>
              <input
                id="keyword"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Enter the Niches:"
                className="border-gray-300 border p-1 rounded-md ml-2 text-secondary"
                style={{ height: "30px" }}
              />
            </div>
            <div className="flex mt-1.5 ml-6">
              <label htmlFor="country" className="block font-secondary text-[14px] text-primary -mt-1">
                Country:
              </label>
              <input
                id="country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Enter country"
                className="border-gray-300 border p-1 rounded-md ml-2 text-secondary -mt-2"
                style={{ height: "30px" }}
              />
            </div>
          </div>
          <div className="flex mt-2 ml-[70px]">
            <label htmlFor="city" className="block font-secondary text-[14px] mt-1 text-primary">
              City:
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city"
              className="border-gray-300 border p-1 ml-2 rounded-md text-secondary"
              style={{ height: "30px" }}
            />
          </div>
          <div className="scrap-btn">
            <button
              type="submit"
              disabled={!isLoggedIn || isDownloading}
              className={`bg-third text-[16px] text-primary px-12 py-2 rounded-md font-secondary whitespace-nowrap flex items-center justify-center ${
                !isLoggedIn ? "bg-gray-400 cursor-not-allowed" : isDownloading ? "bg-gray-400 cursor-not-allowed" : "bg-third hover:bg-secondary"
              }`}
            >
              {!isLoggedIn ? "Login to Scrap" : isDownloading ? "Downloading..." : "Scrap Now"}
            </button>
          </div>
        </form>
        {response && <p className="mt-4 text-green-600">{response}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default EmailScrapper;