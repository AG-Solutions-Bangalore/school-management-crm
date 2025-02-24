import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../base/BaseUrl";

const Footer = () => {
  // const [yearData, setYearData] = useState(null);

  // useEffect(() => {
  //   const fetchYearData = async () => {
  //     try {
  //       const response = await axios.get(`${BASE_URL}/api/web-fetch-year`, {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       });
  //       setYearData(response.data?.year || {});
  //     } catch (error) {
  //       console.error("Error fetching year data:", error);
  //     }
  //   };
  //   fetchYearData();
  // }, []);

  // const currentYear = useMemo(() => yearData?.current_year || "N/A", [yearData]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-xs text-gray-600">
          Current Year: {localStorage.getItem("school_detils")}
        </h2>
        <p className="text-xs text-gray-600">
          Handcrafted with love by{" "}
          <Link
            to="https://ag-solutions.in/"
            target="_blank"
            className="text-blue-800"
          >
            AG Solutions
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default Footer;
