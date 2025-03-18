import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
} from "react";
import Layout from "../../../layout/Layout";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { useReactToPrint } from "react-to-print";
import LoaderComponent from "../../../components/common/LoaderComponent";
import { ContextPanel } from "../../../context/ContextPanel";
import ExcelJS from "exceljs";
import { FETCH_ALL_STUDENT_DATA } from "../../../components/common/UseApi";
import useApiToken from "../../../components/common/useApiToken";
const FeeSummary = () => {
  const containerRef = useRef();
  const { selectedYear } = useContext(ContextPanel);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feeFilter, setFeeFilter] = useState("all");
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [showClassFilter, setShowClassFilter] = useState(false);
  const [showFeeFilter, setShowFeeFilter] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    slNo: true,
    admissionNo: true,
    name: true,
    totalAmount: true,
    paidAmount: true,
    balance: true,
    paymentsCount: true,
  });
  const token = useApiToken();
  const [showColumnFilter, setShowColumnFilter] = useState(false);
  const classOptions = [
    "NURSERY",
    "LKG",
    "UKG",
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
  ];

  // Close dropdowns when clicking outside
  const closeDropdowns = useCallback((e) => {
    if (
      !e.target.closest("#classFilterDropdown") &&
      !e.target.closest(".class-filter-button")
    ) {
      setShowClassFilter(false);
    }
    if (
      !e.target.closest("#feeFilterDropdown") &&
      !e.target.closest(".fee-filter-button")
    ) {
      setShowFeeFilter(false);
    }
    if (
      !e.target.closest("#columnFilterDropdown") &&
      !e.target.closest(".column-filter-button")
    ) {
      setShowColumnFilter(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdowns);
    return () => {
      document.removeEventListener("mousedown", closeDropdowns);
    };
  }, [closeDropdowns]);

  const handlPrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "fee_summary",
    pageStyle: `
      @page {
        size: A4 portrait;
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

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const response = await FETCH_ALL_STUDENT_DATA(selectedYear, token);
      setStudentData(response);
    } catch (error) {
      console.error("Error fetching student data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  if (loading)
    return (
      <Layout>
        <LoaderComponent />
      </Layout>
    );

  if (!studentData)
    return (
      <Layout>
        <div className="flex justify-center items-center h-64 text-gray-500">
          No data available
        </div>
      </Layout>
    );

  const { student, studentClass, studentFees } = studentData;

  const classGroupedData = studentClass.reduce((acc, cls) => {
    const studentInfo = student.find(
      (s) => s.student_admission_no === cls.studentClass_admission_no
    );
    const feesRecords = studentFees.filter(
      (fee) => fee.studentFees_admission_no === cls.studentClass_admission_no
    );
    const totalPaid = feesRecords.reduce(
      (sum, fee) => sum + fee.studentFees_paid,
      0
    );
    const totalPayments = feesRecords.length;
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
      paymentsCount: totalPayments,
      className: cls.studentClass_class,
    });

    return acc;
  }, {});

  const sortedClasses = classOptions.filter(
    (className) => classGroupedData[className]
  );
  const toggleColumn = (column) => {
    setVisibleColumns({
      ...visibleColumns,
      [column]: !visibleColumns[column],
    });
  };

  const toggleClassSelection = (className) => {
    setSelectedClasses((prevSelected) => {
      if (prevSelected.includes(className)) {
        return prevSelected.filter((c) => c !== className);
      } else {
        return [...prevSelected, className];
      }
    });
  };

  const applyFilters = (students, className) => {
    // First apply class filter
    if (selectedClasses.length > 0 && !selectedClasses.includes(className)) {
      return [];
    }

    // Then apply fee filter
    switch (feeFilter) {
      case "zeroPay":
        return students.filter((student) => student.paidAmount === 0);
      case "onePay":
        return students.filter((student) => student.paymentsCount === 1);
      case "paid":
        return students.filter((student) => student.balance === 0);
      case "pending":
        return students.filter((student) => student.balance > 0);
      default:
        return students;
    }
  };

  const renderFilterBadge = (count) => {
    return count > 0 ? (
      <span className="ml-1 inline-flex items-center justify-center px-2 py-1 text-sm font-bold leading-none text-white bg-indigo-600 rounded-full">
        {count}
      </span>
    ) : null;
  };

  const getColumnVisibilityCount = () => {
    return Object.values(visibleColumns).filter((v) => !v).length;
  };

  const downloadCSV = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Fee Summary");

    sortedClasses.forEach((className) => {
      if (selectedClasses.length === 0 || selectedClasses.includes(className)) {
        const filteredStudents = applyFilters(
          classGroupedData[className],
          className
        );
        if (filteredStudents.length === 0) return;

        // No. of visible columns
        const columnCount =
          Object.values(visibleColumns).filter(Boolean).length;

        // Create a merged row for the class header
        const headerText = `Class ${className} (${filteredStudents.length} students)`;
        const headerRow = worksheet.addRow([headerText]);

        // Merge the header row across visible columns
        worksheet.mergeCells(
          headerRow.number,
          1,
          headerRow.number,
          columnCount
        );
        headerRow.getCell(1).alignment = {
          horizontal: "center",
          vertical: "middle",
        };
        headerRow.getCell(1).font = { bold: true, size: 9 };

        // Header styling
        const headers = [];
        if (visibleColumns.slNo) headers.push("Sl No");
        if (visibleColumns.admissionNo) headers.push("Admission No");
        if (visibleColumns.name) headers.push("Name");
        if (visibleColumns.totalAmount) headers.push("Total");
        if (visibleColumns.paidAmount) headers.push("Paid");
        if (visibleColumns.balance) headers.push("Balance");
        if (visibleColumns.paymentsCount) headers.push("No. of Payments");

        const headerRowInstance = worksheet.addRow(headers);
        headerRowInstance.eachCell((cell) => {
          cell.font = { bold: true };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFF00" },
          };
          cell.alignment = { horizontal: "center" };
        });

        // Student data
        filteredStudents.forEach((student, index) => {
          const row = [];
          if (visibleColumns.slNo) row.push(index + 1);
          if (visibleColumns.admissionNo) row.push(student.admissionNo);
          if (visibleColumns.name) row.push(student.name);
          if (visibleColumns.totalAmount) row.push(student.totalAmount);
          if (visibleColumns.paidAmount) row.push(student.paidAmount);
          if (visibleColumns.balance) row.push(student.balance);
          if (visibleColumns.paymentsCount) row.push(student.paymentsCount);
          worksheet.addRow(row);
        });

        const blankRow1 = worksheet.addRow([""]);
        const blankRow2 = worksheet.addRow([""]);
        worksheet.mergeCells(
          blankRow1.number,
          1,
          blankRow1.number,
          columnCount
        );
        worksheet.mergeCells(
          blankRow2.number,
          1,
          blankRow2.number,
          columnCount
        );
      }
    });

    // Generate and download Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fee_summary_${selectedYear}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className="text-xl font-bold text-gray-800">
            Fee Summary{" "}
            <span className="text-gray-500 text-base font-normal">
              {selectedYear}
            </span>
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handlPrintPdf}
              className="bg-indigo-600 text-white px-3 py-1.5 text-sm rounded shadow hover:bg-indigo-700 print:hidden flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z"
                ></path>
              </svg>
              Print
            </button>
            <button
              onClick={downloadCSV}
              className="bg-green-600 text-white px-3 py-1.5 text-sm rounded shadow hover:bg-green-700 print:hidden flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                ></path>
              </svg>
              Download CSV
            </button>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          {/* Class Filter */}
          <div className="relative">
            <button
              onClick={() => setShowClassFilter(!showClassFilter)}
              className="class-filter-button flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50 focus:outline-none"
            >
              Class Filter{" "}
              {selectedClasses.length > 0 &&
                renderFilterBadge(selectedClasses.length)}
              <svg
                className="w-3 h-3 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            {showClassFilter && (
              <div
                id="classFilterDropdown"
                className="absolute left-0 z-10 mt-1 w-44 bg-white rounded shadow-lg border border-gray-100"
              >
                <div className="p-2">
                  <div className="mb-1 flex justify-between">
                    <button
                      onClick={() => setSelectedClasses([])}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setSelectedClasses([...classOptions])}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      Select All
                    </button>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {classOptions.map((className) => (
                      <label
                        key={className}
                        className="flex items-center px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedClasses.includes(className)}
                          onChange={() => toggleClassSelection(className)}
                          className="mr-2 h-3 w-3 text-indigo-600  border-gray-300 rounded focus:ring-indigo-500"
                        />
                        {className}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Fee Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFeeFilter(!showFeeFilter)}
              className="fee-filter-button flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50 focus:outline-none"
            >
              Fees Filter {feeFilter !== "all" && renderFilterBadge(1)}
              <svg
                className="w-3 h-3 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            {showFeeFilter && (
              <div
                id="feeFilterDropdown"
                className="absolute left-0 z-10 mt-1 w-40 bg-white rounded shadow-lg border border-gray-100"
              >
                <div className="py-1">
                  <button
                    onClick={() => {
                      setFeeFilter("all");
                      setShowFeeFilter(false);
                    }}
                    className={`block w-full text-left px-3 py-1 text-sm ${
                      feeFilter === "all"
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    All Students
                  </button>
                  <button
                    onClick={() => {
                      setFeeFilter("zeroPay");
                      setShowFeeFilter(false);
                    }}
                    className={`block w-full text-left px-3 py-1 text-sm ${
                      feeFilter === "zeroPay"
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    No Payment
                  </button>
                  <button
                    onClick={() => {
                      setFeeFilter("onePay");
                      setShowFeeFilter(false);
                    }}
                    className={`block w-full text-left px-3 py-1 text-sm ${
                      feeFilter === "onePay"
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    1 Time Pay
                  </button>
                  <button
                    onClick={() => {
                      setFeeFilter("paid");
                      setShowFeeFilter(false);
                    }}
                    className={`block w-full text-left px-3 py-1 text-sm ${
                      feeFilter === "paid"
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Paid
                  </button>
                  <button
                    onClick={() => {
                      setFeeFilter("pending");
                      setShowFeeFilter(false);
                    }}
                    className={`block w-full text-left px-3 py-1 text-sm ${
                      feeFilter === "pending"
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Pending
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Column Filter */}
          <div className="relative">
            <button
              onClick={() => setShowColumnFilter(!showColumnFilter)}
              className="column-filter-button flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50 focus:outline-none"
            >
              Column Filter{" "}
              {getColumnVisibilityCount() > 0 &&
                renderFilterBadge(getColumnVisibilityCount())}
              <svg
                className="w-3 h-3 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            {showColumnFilter && (
              <div
                id="columnFilterDropdown"
                className="absolute left-0 z-10 mt-1 w-40 bg-white rounded shadow-lg border border-gray-100"
              >
                <div className="py-1">
                  {Object.keys(visibleColumns).map((column) => (
                    <label
                      key={column}
                      className="flex items-center px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns[column]}
                        onChange={() => toggleColumn(column)}
                        className="mr-2 h-3 w-3 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      {column === "slNo"
                        ? "Sl No"
                        : column === "admissionNo"
                        ? "Admission No"
                        : column === "paymentsCount"
                        ? "No. of Payments"
                        : column.charAt(0).toUpperCase() +
                          column.slice(1).replace(/([A-Z])/g, " $1")}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active Filter Indicators */}
        {(feeFilter !== "all" || selectedClasses.length > 0) && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {feeFilter !== "all" && (
              <span className="inline-flex items-center px-2 py-1 bg-indigo-50 text-indigo-700 text-sm rounded">
                {feeFilter === "zeroPay"
                  ? "No Payment"
                  : feeFilter === "onePay"
                  ? "1 Time Pay"
                  : feeFilter === "paid"
                  ? "Paid"
                  : "Pending"}
                <button
                  onClick={() => setFeeFilter("all")}
                  className="ml-1 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  ✕
                </button>
              </span>
            )}

            {selectedClasses.length > 0 && (
              <span className="inline-flex items-center px-2 py-1 bg-indigo-50 text-indigo-700 text-sm rounded">
                {selectedClasses.length === 1
                  ? `Class: ${selectedClasses[0]}`
                  : `Classes: ${selectedClasses.length}`}
                <button
                  onClick={() => setSelectedClasses([])}
                  className="ml-1 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
        )}

        <div ref={containerRef} className="print:text-sm">
          {sortedClasses.map((className) => {
            const filteredStudents = applyFilters(
              classGroupedData[className],
              className
            );

            if (filteredStudents.length === 0) return null;

            // Calculate summary data
            const totalFees = filteredStudents.reduce(
              (sum, student) => sum + student.totalAmount,
              0
            );
            const totalPaid = filteredStudents.reduce(
              (sum, student) => sum + student.paidAmount,
              0
            );
            const totalBalance = filteredStudents.reduce(
              (sum, student) => sum + student.balance,
              0
            );

            return (
              <div
                key={className}
                className="mb-4 overflow-hidden bg-white border border-gray-200 rounded shadow-sm"
              >
                <div className="flex justify-between items-center px-3 py-2 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-800">
                    Class {className}
                    <span className="ml-2 text-sm font-normal text-gray-700">
                      ({filteredStudents.length} students)
                    </span>
                  </h3>
                  <div className="text-sm flex gap-3 text-gray-800">
                    <span>Total: ₹{totalFees.toLocaleString()}</span>
                    <span className="text-green-800">
                      Paid: ₹{totalPaid.toLocaleString()}
                    </span>
                    <span className="text-red-800">
                      Balance: ₹{totalBalance.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse table-auto text-sm">
                    <thead>
                      <tr className="bg-indigo-600">
                        {visibleColumns.slNo && (
                          <th className="border-b border-gray-200 p-2 text-sm w-[5%] font-medium text-white print:text-gray-700  text-left">
                            Sl No
                          </th>
                        )}
                        {visibleColumns.admissionNo && (
                          <th className="border-b border-gray-200 p-2 text-sm w-[15%]  font-medium text-white print:text-gray-700 text-left">
                            Adm No
                          </th>
                        )}
                        {visibleColumns.name && (
                          <th className="border-b border-gray-200 p-2 text-sm w-[20%] font-medium text-white print:text-gray-700 text-left">
                            Name
                          </th>
                        )}
                        {visibleColumns.totalAmount && (
                          <th className="border-b border-gray-200 p-2 text-sm w-[15%] font-medium text-white print:text-gray-700 text-right">
                            Total
                          </th>
                        )}
                        {visibleColumns.paidAmount && (
                          <th className="border-b border-gray-200 p-2 text-sm w-[15%] font-medium text-white print:text-gray-700 text-right">
                            Paid
                          </th>
                        )}
                        {visibleColumns.balance && (
                          <th className="border-b border-gray-200 p-2 text-sm w-[15%] font-medium text-white print:text-gray-700 text-right">
                            Balance
                          </th>
                        )}
                        {visibleColumns.paymentsCount && (
                          <th className="border-b border-gray-200 p-2 text-sm w-[15%] font-medium text-white print:text-gray-700 text-center">
                            Payments
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          {visibleColumns.slNo && (
                            <td className="p-2 text-sm text-gray-600">
                              {index + 1}
                            </td>
                          )}
                          {visibleColumns.admissionNo && (
                            <td className="p-2 text-sm text-gray-600">
                              {student.admissionNo}
                            </td>
                          )}
                          {visibleColumns.name && (
                            <td className="p-2 text-sm text-gray-800 font-medium">
                              {student.name}
                            </td>
                          )}
                          {visibleColumns.totalAmount && (
                            <td className="p-2 text-sm text-gray-600 text-right">
                              ₹{student.totalAmount.toLocaleString()}
                            </td>
                          )}
                          {visibleColumns.paidAmount && (
                            <td className="p-2 text-sm text-right">
                              <span
                                className={`${
                                  student.paidAmount === 0
                                    ? "text-red-800"
                                    : "text-green-800"
                                }`}
                              >
                                ₹{student.paidAmount.toLocaleString()}
                              </span>
                            </td>
                          )}
                          {visibleColumns.balance && (
                            <td className="p-2 text-sm text-right">
                              <span
                                className={`${
                                  student.balance > 0
                                    ? "text-red-800"
                                    : "text-green-800"
                                }`}
                              >
                                ₹{student.balance.toLocaleString()}
                              </span>
                            </td>
                          )}
                          {visibleColumns.paymentsCount && (
                            <td className="p-2 text-sm text-center">
                              <span
                                className={`inline-flex items-center justify-center px-1.5 py-0.5 text-sm font-medium rounded
                                ${
                                  student.paymentsCount === 0
                                    ? "bg-red-50 text-red-600"
                                    : student.balance === 0
                                    ? "bg-green-50 text-green-600"
                                    : "bg-yellow-50 text-yellow-600"
                                }`}
                              >
                                {student.paymentsCount}
                              </span>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>

        {/* If no data after filtering */}
        {Object.keys(classGroupedData).length > 0 &&
          Object.keys(classGroupedData).every(
            (className) =>
              applyFilters(classGroupedData[className], className).length === 0
          ) && (
            <div className="flex justify-center items-center h-24 bg-gray-50 rounded-lg text-gray-500 text-sm">
              No students match the selected filters
            </div>
          )}
      </div>
    </Layout>
  );
};
export default FeeSummary;
