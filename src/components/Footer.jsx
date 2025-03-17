import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Popover, Button, useTheme } from "@mui/material";
import { toast } from "sonner";

const Footer = () => {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
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

    // Create Overlay (Glassmorphism Effect)
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(255, 255, 255, 0.1)";
    overlay.style.backdropFilter = "blur(15px)";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.fontFamily = "Arial, sans-serif";
    overlay.style.zIndex = "9999";

    // Keyframes for floating and pulsing animations
    const styleSheet = document.createElement("style");
    styleSheet.innerHTML = `
        @keyframes float {
            from { transform: translateY(0px); }
            to { transform: translateY(10px); }
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 10px rgba(0, 123, 255, 0.2); }
            50% { box-shadow: 0 0 20px rgba(0, 123, 255, 0.5); }
            100% { box-shadow: 0 0 10px rgba(0, 123, 255, 0.2); }
        }
    `;
    document.head.appendChild(styleSheet);

    // Logo Image
    const animation = document.createElement("img");
    animation.src = "http://bhsppvn.site/public/assets/letterHead/ppvn.png";
    animation.style.width = "150px";
    animation.style.height = "150px";
    animation.style.marginBottom = "20px";
    animation.style.animation = "pulse 2s infinite";

    // Loading Message
    const message = document.createElement("p");
    message.style.fontSize = "22px";
    message.style.color = "#333";
    message.style.fontWeight = "bold";
    message.style.marginBottom = "15px";
    message.innerText = "Updating Year! Preparing your dashboard...";

    // Progress Bar Container
    const progressBarContainer = document.createElement("div");
    progressBarContainer.style.width = "300px";
    progressBarContainer.style.height = "8px";
    progressBarContainer.style.borderRadius = "10px";
    progressBarContainer.style.background = "rgba(0, 0, 0, 0.1)";
    progressBarContainer.style.overflow = "hidden";
    progressBarContainer.style.boxShadow = "0px 0px 8px rgba(0, 0, 0, 0.1)";

    // Progress Bar
    const progressBar = document.createElement("div");
    progressBar.style.width = "0%";
    progressBar.style.height = "100%";
    progressBar.style.borderRadius = "10px";
    progressBar.style.background =
      "linear-gradient(to right, #007bff, #00c6ff)";
    progressBar.style.transition = "width 0.3s ease-in-out";
    progressBar.style.boxShadow = "0px 0px 5px rgba(0, 123, 255, 0.5)";

    // Append progress bar inside the container
    progressBarContainer.appendChild(progressBar);

    // Progress Text
    const percentageText = document.createElement("p");
    percentageText.style.fontSize = "22px";
    percentageText.style.fontWeight = "bold";
    percentageText.style.color = "#007bff";
    percentageText.innerText = "Processing... 1%";

    overlay.appendChild(animation);
    overlay.appendChild(message);
    overlay.appendChild(progressBarContainer);
    overlay.appendChild(percentageText);
    document.body.appendChild(overlay);

    let progress = 1;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        percentageText.innerText = "Processing... 100%";
        progressBar.style.width = "100%";

        setTimeout(() => {
          document.body.innerHTML = "";
          document.body.appendChild(overlay);
          window.location.replace("/home");
        }, 700);
      } else {
        progressBar.style.width = `${progress}%`;
        percentageText.innerText = `Processing... ${progress}%`;
      }
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
        className={`hover:underline text-sm font-medium`}
        style={{ color: theme.palette.text.secondary }}
      >
        Change Year
      </button>
      <p className="text-gray-500 text-sm">
        Handcrafted with ❤️ by
        <Link
          to="https://ag-solutions.in/"
          target="_blank"
          className={`hover:underline text-sm font-medium`}
          style={{ color: theme.palette.text.secondary }}
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
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </Popover>
    </footer>
  );
};

export default Footer;
