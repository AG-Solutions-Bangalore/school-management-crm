import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { IconInfoCircle } from "@tabler/icons-react";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  BackButton,
  CreateButton,
  HeaderColor,
} from "../../../components/common/ButttonConfig";
import {
  ReportPendingFeesDownload,
  ReportPendingFeesView,
} from "../../../components/buttonIndex/ButtonComponents";
import {
  DownloadStudentPending,
  fetchClassList,
  YearList,
} from "../../../components/common/UseApi";
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
const PendingFeesReport = () => {
  const [yearData, setYearData] = useState([]);
  const [classList, setClassList] = useState([]);
  const navigate = useNavigate();
  const [pendingreport, setPendingReport] = useState({
    student_year: "",
    student_class: "",
  });
  const onInputChange = (e) => {
    setPendingReport({
      ...pendingreport,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const fetchYearData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await YearList();

        setYearData(response?.year);
      } catch (error) {
        console.error("Error fetching holiday List data", error);
      }
    };
    const fetchClassData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetchClassList();
        setClassList(response.classes);
      } catch (error) {
        console.error("Error fetching teacher data", error);
      }
    };
    fetchClassData();
    fetchYearData();
  }, []);

  const handlePendingFees = async (e) => {
    e.preventDefault(); 

    if (!pendingreport.student_year) {
      toast.warning("Year is Required");
      return;
    }

    let data = {
      student_year: pendingreport.student_year,
      student_class: pendingreport.student_class,
    };

    try {
      const response = await DownloadStudentPending(data); // ✅ Ensure API receives data if required

      const url = window.URL.createObjectURL(new Blob([response])); // ✅ Use response properly
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "pending_details.csv");
      document.body.appendChild(link);
      link.click();

      toast.success("Pending Details Downloaded Successfully");

      setPendingReport({
        // ✅ Reset correct fields related to pending fees
        student_year: "",
        student_class: "",
      });
    } catch (error) {
      toast.error("Pending Details is Not Downloaded");
      console.error("Download error:", error);
    }
  };

  const handleNavigate = () => {
    if (!pendingreport.student_year) {
      // toast.warning("Year is Required");
      return;
    }

    let data = {
      student_year: pendingreport.student_year,
      student_class: pendingreport.student_class,
    };

    navigate("/report-pending/download-view", { state: data });
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
        <div className={HeaderColor}>
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4 " />
              <span>Download Pending Report</span>
            </div>
          </h2>
        </div>
        <hr />
        <form className="w-full   rounded-lg mx-auto p-4 space-y-6">
          <div className="grid grid-cols-1  md:grid-cols-3  gap-6">
            {/* present Date  */}
            <div>
              <FormLabel required>Year</FormLabel>
              <select
                name="student_year"
                value={pendingreport.student_year || ""}
                onChange={onInputChange}
                className={inputClassSelect}
                required
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
              <FormLabel>Class</FormLabel>
              <select
                name="student_class"
                value={pendingreport.student_class}
                onChange={(e) => onInputChange(e)}
                className={inputClassSelect}
              >
                <option value="">Select Class</option>
                {classList.map((option, index) => (
                  <option key={index} value={option.classes}>
                    {option.classes}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            {/* <button onClick={handlePendingFees} className={CreateButton}>
              Download
            </button>
            <button onClick={handleNavigate} className={CreateButton}>
              View
            </button> */}
            <ReportPendingFeesDownload
              onClick={handlePendingFees}
              className={CreateButton}
            >
              Download
            </ReportPendingFeesDownload>
            <ReportPendingFeesView
              onClick={handleNavigate}
              className={CreateButton}
            >
              View
            </ReportPendingFeesView>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default PendingFeesReport;
