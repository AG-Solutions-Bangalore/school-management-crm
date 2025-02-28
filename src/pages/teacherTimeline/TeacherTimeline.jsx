import React, { useState, useEffect, useContext, useRef } from "react";
import Layout from "../../layout/Layout";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { ContextPanel } from "../../context/ContextPanel";
import { useReactToPrint } from "react-to-print";
import LoaderComponent from "../../components/common/LoaderComponent";
import { CreateButton } from "../../components/common/ButttonConfig";
import { TeacherTimeTablePrint } from "../../components/buttonIndex/ButtonComponents";

const Timetable = () => {
  const containerRef = useRef();
  const [timetableData, setTimetableData] = useState({
    teacher: [],
    teacherAssign: [],
    periods: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTeacher, setActiveTeacher] = useState(null);
  const { selectedYear } = useContext(ContextPanel);
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const cellWidth = "80px";
  const cellHeight = "40px";
  const dayColumnWidth = "100px";

  const handlePrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "teacher_timetable",
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

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-teacher-class-timetable/${selectedYear}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const periods = response.data.shool_period.map(
          (period) => period.school_period
        );
        const teachers = response.data.teacher;

        setTimetableData({
          teacher: teachers,
          teacherAssign: response.data.teacherAssign,
          periods,
        });

        if (teachers.length > 0 && !activeTeacher) {
          setActiveTeacher(teachers[0].teacher_ref);
        }
      } catch (error) {
        setError("Failed to fetch timetable data");
        console.error("Error fetching timetable data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [selectedYear]);

  const getClassSubjectForTeacherDayPeriod = (teacherRef, day, period) => {
    const assignment = timetableData.teacherAssign.find(
      (item) =>
        item.teacher_ref === teacherRef &&
        item.teachersub_on === day &&
        item.teachersub_period === period
    );

    return assignment
      ? `${assignment.teachersub_class} - ${assignment.teachersub_subject}`
      : "";
  };

  const handleTeacherChange = (event) => {
    setActiveTeacher(event.target.value);
  };

  if (loading)
    return (
      <Layout>
        <LoaderComponent />
      </Layout>
    );

  if (error)
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-red-600">{error}</div>
        </div>
      </Layout>
    );

  const activeTeacherName = timetableData.teacher.find(
    (t) => t.teacher_ref === activeTeacher
  )
    ? `${
        timetableData.teacher.find((t) => t.teacher_ref === activeTeacher)
          .teacher_title
      } ${
        timetableData.teacher.find((t) => t.teacher_ref === activeTeacher)
          .teacher_name
      }`
    : "";

  const totalWidth =
    parseInt(dayColumnWidth) +
    timetableData.periods.length * parseInt(cellWidth);

  const inputClassSelect =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-500";

  return (
    <Layout>
      <div className="p-4 w-full bg-white rounded-lg">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2">
          <h1 className="text-xl font-bold text-left text-black">
            Teacher Timetable {selectedYear}
          </h1>
          <div className="flex flex-wrap gap-2">
            <select
              value={activeTeacher || ""}
              onChange={handleTeacherChange}
              className={inputClassSelect}
            >
              <option value="">Select Teacher</option>
              {timetableData.teacher.map((teacherObj) => (
                <option
                  key={teacherObj.teacher_ref}
                  value={teacherObj.teacher_ref}
                >
                  {teacherObj.teacher_title} {teacherObj.teacher_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          {/* <button onClick={handlePrintPdf} className={CreateButton}>
            Print
          </button> */}
          <TeacherTimeTablePrint
            onClick={handlePrintPdf}
            className={CreateButton}
          ></TeacherTimeTablePrint>
        </div>
        <div ref={containerRef}>
          <div className="mb-6 mt-6">
            <h2 className="text-lg text-center font-semibold mb-2">
              {" "}
              Teacher: {activeTeacherName}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <div style={{ minWidth: `${totalWidth}px` }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                  border: "1px solid black",
                }}
              >
                <thead>
                  <tr>
                    <th
                      rowSpan="2"
                      className="text-center font-semibold p-2 text-black bg-white"
                      style={{
                        width: dayColumnWidth,
                        border: "1px solid black",
                        height: cellHeight,
                      }}
                    >
                      Day
                    </th>
                    {timetableData.periods.map((period) => (
                      <th
                        key={period}
                        colSpan="1"
                        className="text-center font-semibold p-2 text-black bg-white"
                        style={{
                          border: "1px solid black",
                          height: cellHeight,
                          width: cellWidth,
                        }}
                      >
                        {period}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {days.map((day) => (
                    <tr key={day}>
                      <td
                        className="text-center font-medium p-2 text-black bg-white"
                        style={{
                          width: dayColumnWidth,
                          border: "1px solid black",
                          height: cellHeight,
                        }}
                      >
                        {day}
                      </td>
                      {timetableData.periods.map((period) => {
                        const classSubject = activeTeacher
                          ? getClassSubjectForTeacherDayPeriod(
                              activeTeacher,
                              day,
                              period
                            )
                          : "";
                        return (
                          <td
                            key={`${activeTeacher}-${day}-${period}`}
                            className="text-center p-1 text-sm text-black bg-white"
                            style={{
                              width: cellWidth,
                              border: "1px solid black",
                              height: cellHeight,
                            }}
                          >
                            {classSubject}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Timetable;
