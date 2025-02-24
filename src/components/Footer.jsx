import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Popover, Button } from "@mui/material";
import { toast } from "sonner";

const Footer = () => {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const storedYears = localStorage.getItem("years");
    if (storedYears) {
      setYears(JSON.parse(storedYears));
    }

    const defaultYear = localStorage.getItem("default_year");
    if (defaultYear) {
      setSelectedYear(defaultYear);
    }
  }, []);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  
  const handleSubmit = () => {
    localStorage.setItem("default_year", selectedYear);
    toast.success("Year has been changed Successfully");
   


    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "white";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.fontFamily = "Arial, sans-serif";
    overlay.style.zIndex = "9999";
  
  
    const message = document.createElement("p");
    message.style.fontSize = "18px";
    message.style.color = "#333";
    message.style.marginBottom = "10px";
    message.innerText = "Year has been changed! Preparing your dashboard, please wait...";
  
   
    const percentageText = document.createElement("p");
    percentageText.style.fontSize = "22px";
    percentageText.style.fontWeight = "bold";
    percentageText.style.color = "#007bff"; 
    percentageText.innerText = "Processing... 1%";
  
    overlay.appendChild(message);
    overlay.appendChild(percentageText);
    document.body.appendChild(overlay);
  
   
    let progress = 1;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5; 
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          window.location.href = "/home"; 
        }, 500);
      }
      percentageText.innerText = `Processing... ${progress}%`;
    }, 180); 
  };
  
  

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <footer className="bg-white shadow-md rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between text-gray-700 text-sm">
      <p className="text-gray-500">
        Current Year:{" "}
        <span className="font-medium">
          {localStorage.getItem("default_year")}
        </span>
      </p>
      <button
        onClick={handleOpen}
        className="text-blue-600 hover:underline text-sm font-medium"
      >
        Change Year
      </button>
      <p className="text-gray-500 text-sm">
        Handcrafted with ❤️ by
        <Link
          to="https://ag-solutions.in/"
          target="_blank"
          className="text-blue-600 font-medium ml-1"
        >
          AG Solutions
        </Link>
      </p>

      {/* Year Selection Popover */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <div className="p-4 w-56">
          <select
            id="year-select"
            value={selectedYear}
            onChange={handleYearChange}
            required
            className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
          >
            <option value="">Select Year</option>
            {years.map((yearObj) => (
              <option key={yearObj.year_list} value={yearObj.year_list}>
                {yearObj.year_list}
              </option>
            ))}
          </select>
          <div className="mt-2 flex justify-end gap-2">
            <Button onClick={handleClose} className="text-gray-600">
              Cancel
            </Button>
            <button
              className="w-full px-0 py-1 text-sm border text-white bg-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
            
            onClick={handleSubmit} >
              Submit
            </button>
          </div>
        </div>
      </Popover>
    </footer>
  );
};

export default Footer;
