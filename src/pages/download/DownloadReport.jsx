import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { IconInfoCircle } from "@tabler/icons-react";
import { FormLabel } from "@mui/material";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { toast } from "sonner";
const status = [
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Inactive",
    label: "Inactive",
  },
];
const DownloadReport = () => {
  const [yearData, setYearData] = useState([]);

  const [report, setReport] = useState({
    student_year: "",
    status: "",
  });
  const onInputChange = (e) => {
    setReport({
      ...report,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const fetchYearData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-year-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setYearData(response.data?.year);
      } catch (error) {
        console.error("Error fetching holiday List data", error);
      }
    };
    fetchYearData();
  }, []);

  const handleDownload = (e) => {
    e.preventDefault();
    let data = {
      student_year: report.student_year,
      status: report.status,
    };

    e.preventDefault();
    console.log("Data : ", data);

    axios({
      url: BASE_URL + "/api/panel-download-student-details-report",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "student_details.csv");
        document.body.appendChild(link);
        link.click();
        toast.success("Student Details Downloaded Successfully");
        setReport({
          student_year: "",
          status: "",
        });
      })
      .catch((err) => {
        toast.error("Student Details is Not Downloaded");
      });
  };
  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
  const inputClassSelect =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-500";
  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-500";
  return (
    <Layout>
      <div className=" bg-[#FFFFFF] p-2  rounded-lg  ">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-red-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Download Report </span>
            </div>
          </h2>
        </div>
        <hr />
        <form
          onSubmit={handleDownload}
          className="w-full   rounded-lg mx-auto p-4 space-y-6"
        >
          <div className="grid grid-cols-1  md:grid-cols-2  gap-6">
            {/* present Date  */}
            <div>
              <FormLabel required>Year</FormLabel>
              <select
                name="student_year"
                value={report.student_year || ""}
                onChange={onInputChange}
                required
                className={inputClassSelect}
              >
                <option value="">Select Year</option>
                {yearData.map((option, index) => (
                  <option key={index} value={option.year_list}>
                    {option.year_list}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FormLabel required>Status</FormLabel>
              <select
                name="status"
                value={report.status || ""}
                onChange={onInputChange}
                required
                className={inputClassSelect}
              >
                <option value="">Select Status</option>
                {status.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              type="submit"
              className="text-center text-sm font-[400] cursor-pointer  w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
            >
              Download
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default DownloadReport;
