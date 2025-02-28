import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Layout from "../../../layout/Layout";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";

const FeeSummary = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState([
    "slNo",
    "admissionNo",
    "name",
    "totalAmount",
    "paidAmount",
    "balance",
    "paymentsCount",
  ]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectedYear = "2024-25";
  const containerRef = useRef();
  const dropdownRef = useRef();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-all-student-data/${selectedYear}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStudentData(response.data);
      } catch (error) {
        console.error("Error fetching student data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const toggleColumn = (column) => {
    setVisibleColumns((prev) =>
      prev.includes(column) ? prev.filter((col) => col !== column) : [...prev, column]
    );
  };




  
  const handlPrintPdf = useReactToPrint({
      content: () => containerRef.current,
      documentTitle: "fees_sumary",
      pageStyle: `
                  @page {
                  size: A4 landscape;
                  margin: 5mm;
                  
                }
                @media print {
                  body {
                    border: 0px solid #000;
                        font-size: 10px; 
                    margin: 0mm;
                    padding: 0mm;
                  }
                     table {
                     font-size: 11px;
                   }
                  .print-hide {
                    display: none;
                  }
                 
                }
                `,
    });

  if (loading) return <div>Loading...</div>;
  if (!studentData) return <div>No data available</div>;

  const { student, studentClass, studentFees } = studentData;

  const classGroupedData = studentClass.reduce((acc, cls) => {
    const studentInfo = student.find(
      (s) => s.student_admission_no === cls.studentClass_admission_no
    );
    const feesRecords = studentFees.filter(
      (fee) => fee.studentFees_admission_no === cls.studentClass_admission_no
    );
    const totalPaid = feesRecords.reduce((sum, fee) => sum + fee.studentFees_paid, 0);
    const balance = cls.studentClass_amount - totalPaid;

    if (!acc[cls.studentClass_class]) {
      acc[cls.studentClass_class] = [];
    }

    acc[cls.studentClass_class].push({
      slNo: acc[cls.studentClass_class].length + 1,
      admissionNo: cls.studentClass_admission_no,
      name: studentInfo ? studentInfo.student_name : "N/A",
      totalAmount: cls.studentClass_amount,
      paidAmount: totalPaid,
      balance: balance,
      paymentsCount: feesRecords.length,
    });

    return acc;
  }, {});
  console.log("class grouped data", classGroupedData)
  const csvDownload = async ()=>{
    const data = Object.keys(classGroupedData)
    const url = window.URL.createObjectURL(new Blob([data]))
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download","fee-summary.csv")
    document.body.appendChild(link)
    link.click()

  }
  return (
    <Layout>
      <div className="p-4 bg-white">
        <h2 className="text-xl font-bold mb-4">Fee Summary</h2>

        <div className="mb-4 print-hide relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-gray-200 px-4 py-2 rounded text-black"
          >
            Select Columns ▼
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg p-2 z-10">
              {["slNo", "admissionNo", "name", "totalAmount", "paidAmount", "balance", "paymentsCount"].map((col) => (
                <label key={col} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(col)}
                    onChange={() => toggleColumn(col)}
                    className="mr-2"
                  />
                  {col}
                </label>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handlPrintPdf}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 print-hide"
        >
          Print
        </button>
        <button
          onClick={csvDownload}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 print-hide"
        >
          CSV
        </button>

        <div ref={containerRef} className="overflow-x-auto">
          {Object.keys(classGroupedData).map((className) => (
            <div key={className} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Class: {className}</h3>
              <table className="w-full border-collapse border border-gray-300 min-w-max">
                <thead>
                  <tr className="bg-gray-200 text-left w-full">
                    {visibleColumns.includes("slNo") && <th className="border p-2 text-sm w-[5%] ">Sl No</th>}
                    {visibleColumns.includes("admissionNo") && <th className="border p-2 text-sm w-[15%]">Admission No</th>}
                    {visibleColumns.includes("name") && <th className="border p-2 text-sm w-[25%]">Name</th>}
                    {visibleColumns.includes("totalAmount") && <th className="border p-2 text-sm ">Total Amount</th>}
                    {visibleColumns.includes("paidAmount") && <th className="border p-2 text-sm ">Paid Amount</th>}
                    {visibleColumns.includes("balance") && <th className="border p-2 text-sm ">Balance</th>}
                    {visibleColumns.includes("paymentsCount") && <th className="border p-2 text-sm ">No. of Payments</th>}
                  </tr>
                </thead>
                <tbody>
                  {classGroupedData[className].map((student, index) => (
                    <tr key={index} className="border">
                      {visibleColumns.includes("slNo") && <td className="border p-2 text-sm">{student.slNo}</td>}
                      {visibleColumns.includes("admissionNo") && <td className="border p-2 text-sm">{student.admissionNo}</td>}
                      {visibleColumns.includes("name") && <td className="border p-2 text-sm">{student.name}</td>}
                      {visibleColumns.includes("totalAmount") && <td className="border p-2 text-sm">₹{student.totalAmount}</td>}
                      {visibleColumns.includes("paidAmount") && <td className="border p-2 text-sm">₹{student.paidAmount}</td>}
                      {visibleColumns.includes("balance") && <td className="border p-2 text-sm">₹{student.balance}</td>}
                      {visibleColumns.includes("paymentsCount") && <td className="border p-2 text-sm">{student.paymentsCount}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default FeeSummary;