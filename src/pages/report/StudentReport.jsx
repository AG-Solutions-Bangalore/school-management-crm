import { IconInfoCircle } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ReportStudentAll,
  ReportStudentCurrent,
} from "../../components/buttonIndex/ButtonComponents";
import {
  CreateButton,
  HeaderColor,
} from "../../components/common/ButttonConfig";
import {
  DOWNLOAD_STUDENT_CURRENT_DETAILS,
  DOWNLOAD_STUDENT_DETAILS,
  FETCH_CLASS_LIST,
  YearList,
} from "../../components/common/UseApi";
import useApiToken from "../../components/common/useApiToken";
import Layout from "../../layout/Layout";
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
const StudentReport = () => {
  const [yearData, setYearData] = useState([]);
  const [classList, setClassList] = useState([]);
  const token = useApiToken();
  const [report, setReport] = useState({
    student_year: "",
    status: "",

    student_class: "",
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
        const response = await YearList(token);
        setYearData(response?.year);
      } catch (error) {
        console.error("Error fetching holiday List data", error);
      }
    };
    const fetchClassData = async () => {
      try {
        const response = await FETCH_CLASS_LIST(token);
        setClassList(response?.classes);
      } catch (error) {
        console.error("Error fetching teacher data", error);
      }
    };
    fetchClassData();
    fetchYearData();
  }, []);

  const handleAllStudent = async (e) => {
    e.preventDefault();

    let data = {
      student_year: report.student_year,
      status: report.status,
      student_class: report.student_class,
    };

    try {
      const response = await DOWNLOAD_STUDENT_DETAILS(data, token);

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "allstudent_details.csv");
      document.body.appendChild(link);
      link.click();

      toast.success("All Student Details Downloaded Successfully");

      setReport({
        student_year: "",
        status: "",
        student_class: "",
      });
    } catch (error) {
      toast.error("All Student Details is Not Downloaded");
      console.error("Download error:", error);
    }
  };
  const handleCurrentStudent = async (e) => {
    e.preventDefault();

    let data = {
      student_year: report.student_year,
      status: report.status,
      student_class: report.student_class,
    };

    try {
      const response = await DOWNLOAD_STUDENT_CURRENT_DETAILS(data, token); // ✅ Pass data correctly

      const url = window.URL.createObjectURL(new Blob([response])); // ✅ Use response properly
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "currentstudent_details.csv");
      document.body.appendChild(link);
      link.click();

      toast.success("Current Student Details Downloaded Successfully");

      setReport({
        student_year: "",
        status: "",
        student_class: "",
      });
    } catch (err) {
      toast.error("Current Student Details is Not Downloaded");
      console.error("Download error:", err);
    }
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
              <IconInfoCircle className="w-4 h-4" />
              <span>Download Student Report </span>
            </div>
          </h2>
        </div>
        <hr />
        <form className="w-full   rounded-lg mx-auto p-4 space-y-6">
          <div className="grid grid-cols-1  md:grid-cols-3  gap-6">
            {/* present Date  */}
            <div>
              <FormLabel>Year</FormLabel>
              <select
                name="student_year"
                value={report.student_year || ""}
                onChange={onInputChange}
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
              <FormLabel>Status</FormLabel>
              <select
                name="status"
                value={report.status || ""}
                onChange={onInputChange}
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

            <div>
              <FormLabel>Class</FormLabel>
              <select
                name="student_class"
                value={report.student_class}
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

          {/* Form Actions */}
          <div className="flex flex-wrap gap-4 justify-center">
            {/* <button onClick={handleAllStudent} className={CreateButton}>
              All Student
            </button>
            <button
              onClick={handleCurrentStudent}
              className={`${CreateButton} w-40`}
            >
              Current Student
            </button> */}
            <ReportStudentAll
              onClick={handleAllStudent}
              className={CreateButton}
            >
              All Student
            </ReportStudentAll>
            <ReportStudentCurrent
              onClick={handleCurrentStudent}
              className={`${CreateButton} w-40`}
            >
              Current Student
            </ReportStudentCurrent>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default StudentReport;
