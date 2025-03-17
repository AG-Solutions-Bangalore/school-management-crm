import React, { useEffect, useRef, useState } from "react";
import Layout from "../../../layout/Layout";
import axios from "axios";
import { toast } from "sonner";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../../base/BaseUrl";
import moment from "moment/moment";
import { useReactToPrint } from "react-to-print";
import {
  CreateButton,
  HeaderColor,
} from "../../../components/common/ButttonConfig";
import { StudentAttendanceView } from "../../../components/buttonIndex/ButtonComponents";
import {
  CreateStudentAttendance,
  DeleteStudentAttendanceLisyById,
  fetchClassList,
  FetchStudentAttendance,
} from "../../../components/common/UseApi";

const AttendanceView = () => {
  const navigate = useNavigate();
  const Fromdate = moment().startOf("month").format("YYYY-MM-DD");
  const Todate = moment().format("YYYY-MM-DD");
  const componentRef = useRef();

  const [attendance, setAttendance] = useState({
    from_date: Fromdate,
    to_date: Todate,
    from_class: "",
  });

  const [classList, setClassList] = useState([]);
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);

  const onInputChange = (e) => {
    setAttendance({
      ...attendance,
      [e.target.name]: e.target.value,
    });
  };

  const fetchClassData = async () => {
    try {
      const response = await fetchClassList();
      setClassList(response.classes);
    } catch (error) {
      console.error("Error fetching classes data", error);
    }
  };

  useEffect(() => {
    fetchClassData();
  }, []);

  const handleSubmit = async (e, showToast = true) => {
    e.preventDefault();
    const form = document.getElementById("addIndiv");
    if (!form || !form.checkValidity()) {
      toast.error("Fill all required fields");
      return;
    }

    setLoading(true);
    const data = {
      from_date: attendance?.from_date,
      to_date: attendance?.to_date,
      from_class: attendance?.from_class,
    };

    try {
      const res = await FetchStudentAttendance(data);

      if (res.weekdays && res.student) {
        setAttendanceData(res);
        if (showToast) {
          toast.success("Attendance data fetched successfully!");
        }
      } else {
        toast.error("Invalid response from server");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = async (student, date) => {
    // if the date is a holiday

    const isHoliday = attendanceData.weekdays.find(
      (day) => day.date === date.date && day.holiday_for
    );
    if (isHoliday) return;

    const isAbsent = student.attendance_dates.includes(date.date);

    try {
      setLoading(true);
      // if the date is Absent
      if (isAbsent) {
        const attendanceIndex = student.attendance_dates.indexOf(date.date);
        const attendanceId = student.id[attendanceIndex];

        // await axios({
        //   url: `${BASE_URL}/api/panel-delete-student-attendance/${attendanceId}`,
        //   method: "DELETE",
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem("token")}`,
        //   },
        // });
        const respose = await DeleteStudentAttendanceLisyById(attendanceId);
        toast.success(
          `${student.student_name} marked present for ${moment(
            date.date
          ).format("DD MMM YYYY")}`
        );
      } else {
        const data = {
          studentAttendance_date: date.date,
          studentAttendance_class: attendance.from_class,
          studentAttendance_admission_no: student.student_admission_no,
        };
        // else if the date is P
        // await axios({
        //   url: `${BASE_URL}/api/panel-create-student-attendance`,
        //   method: "POST",
        //   data,
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem("token")}`,
        //   },
        // });
        const res = await CreateStudentAttendance(data);

        toast.success(
          `${student.student_name} marked absent for ${moment(date.date).format(
            "DD MMM YYYY"
          )}`
        );
      }

      handleSubmit(new Event("submit"), false);
    } catch (error) {
      console.error("Error toggling attendance:", error);
      toast.error("Failed to update attendance");
    } finally {
      setLoading(false);
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
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-blue-500";
  const handlPrintPdf = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Attendance",
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
                      min-height: 100vh;
                    }
                       table {
                       font-size: 11px;
                     }
                    .print-hide {
                      display: none;
                    }
                    .attendance-cell {
                      pointer-events: none !important;
                    }
                   
                  }
                  `,
  });
  return (
    <Layout>
      <div className="bg-[#FFFFFF] p-2 rounded-lg">
        <div className={HeaderColor}>
          <h2 className="px-5 text-[black] text-lg flex flex-row justify-between items-center rounded-xl p-2">
            <div className="flex items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Student Attendance</span>
            </div>
            <IconArrowBack
              onClick={() => navigate("/attendance-list")}
              className="cursor-pointer hover:text-red-600"
            />
          </h2>
        </div>
        <hr />
        <form
          onSubmit={handleSubmit}
          id="addIndiv"
          className="w-full rounded-lg mx-auto p-4 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <FormLabel required>From Date</FormLabel>
              <input
                type="date"
                name="from_date"
                value={attendance.from_date}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel required>To Date</FormLabel>
              <input
                type="date"
                name="to_date"
                value={attendance.to_date}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel required>Class</FormLabel>
              <select
                name="from_class"
                value={attendance.from_class || ""}
                onChange={(e) => onInputChange(e)}
                required
                className={inputClassSelect}
              >
                <option value="">Select Class</option>
                {classList.map((option, idx) => (
                  <option key={idx} value={option.classes}>
                    {option.classes}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {/* <button type="submit" disabled={loading} className={CreateButton}>
              {loading ? "Loading..." : "View"}
            </button> */}
            <StudentAttendanceView
              type="submit"
              loading={loading}
              className={CreateButton}
            ></StudentAttendanceView>
          </div>
        </form>
        {attendanceData && (
          <div className="mt-6">
            <div className="flex justify-between">
              <h3 className="text-lg font-bold">Attendance List</h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 text-xs">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                  <span>Present</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                  <span>Absent</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full"></span>
                  <span>Holiday</span>
                </div>
                <button
                  onClick={handlPrintPdf}
                  className={CreateButton}
                  type="button"
                >
                  Print
                </button>
              </div>
            </div>
            {/* <div className="text-xs text-gray-600 mt-1 mb-3 print-hide">
              Click on cells to toggle attendance status
            </div> */}
            <div ref={componentRef}>
              <h3 className="text-lg font-bold print:block hidden text-center">
                Attendance List
              </h3>
              {Object.entries(
                attendanceData.weekdays.reduce((acc, item) => {
                  const month = moment(item.date).format("MMMM YYYY");
                  acc[month] = acc[month] || [];
                  acc[month].push(item);
                  return acc;
                }, {})
              ).map(([month, dates]) => (
                <div key={month} className="mt-4">
                  <h4 className="text-md font-semibold">{month}</h4>
                  <table className="w-full border-collapse border border-gray-300 mt-2">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 px-2 text-xs p-1">
                          Student
                        </th>
                        {dates.map((date) => (
                          <th
                            key={date.date}
                            className="border border-gray-300 text-xs p-1"
                          >
                            {moment(date.date).format("DD")}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {attendanceData.student.map((student, studentIndex) => (
                        <tr key={student.student_name}>
                          <td className="border border-gray-300 text-center text-xs p-1">
                            {student.student_name}
                          </td>

                          {dates.map((date, dateIndex) => {
                            if (studentIndex === 0 && date.holiday_for) {
                              return (
                                <td
                                  key={date.date}
                                  className="border border-gray-300 p-1 text-center align-middle font-bold bg-yellow-400 text-xs"
                                  rowSpan={attendanceData.student.length}
                                  style={{
                                    writingMode: "vertical-rl",
                                    textOrientation: "upright",
                                  }}
                                >
                                  {date.holiday_for}
                                </td>
                              );
                            }

                            if (date.holiday_for) {
                              return null;
                            }

                            const isAbsent = student.attendance_dates.includes(
                              date.date
                            );

                            return (
                              <td
                                key={date.date}
                                onClick={() => toggleAttendance(student, date)}
                                className={`border border-gray-300 p-1 text-center font-bold text-xs cursor-pointer hover:bg-gray-100 attendance-cell ${
                                  loading
                                    ? "opacity-50 pointer-events-none"
                                    : ""
                                }`}
                              >
                                {isAbsent ? (
                                  <span className="text-red-500">A</span>
                                ) : (
                                  <span className="text-green-500">P</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AttendanceView;
