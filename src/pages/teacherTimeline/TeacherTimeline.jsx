import React, { useState, useEffect } from 'react';
import Layout from '../../layout/Layout';
import axios from 'axios';
import BASE_URL from '../../base/BaseUrl';

const Timetable = () => {
  const [timetableData, setTimetableData] = useState({
    teacher: [],
    teacherAssign: [],
    periods: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const cellWidth = '80px';
  const cellHeight = '40px';
  const teacherColumnWidth = '150px';

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-teacher-class-timetable/2024-25`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const periods = response.data.shool_period.map(period => period.school_period);

        setTimetableData({
          teacher: response.data.teacher,
          teacherAssign: response.data.teacherAssign,
          periods
        });
      } catch (error) {
        setError('Failed to fetch timetable data');
        console.error("Error fetching timetable data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTimetable();
  }, []);

  const getClassSubjectForTeacherDayPeriod = (teacherRef, day, period) => {
    const assignment = timetableData.teacherAssign.find(
      item => 
        item.teacher_ref === teacherRef &&
        item.teachersub_on === day &&
        item.teachersub_period === period
    );
    
    return assignment ? `${assignment.teachersub_class} - ${assignment.teachersub_subject}` : '';
  };

  if (loading) return (
    <Layout>
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-black">Loading timetable data...</div>
      </div>
    </Layout>
  );

  if (error) return (
    <Layout>
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    </Layout>
  );

  const totalWidth = parseInt(teacherColumnWidth) + (days.length * timetableData.periods.length * parseInt(cellWidth));

  return (
    <Layout>
      <div className="p-4 max-w-7xl mx-auto bg-white rounded-lg">
        <h1 className="text-2xl font-bold text-center text-black mb-6">Teacher Timetable 2024-25</h1>
        
        <div className="overflow-x-auto">
          <div style={{ minWidth: `${totalWidth}px` }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse', 
              tableLayout: 'fixed', 
              border: '1px solid black'
            }}>
              <thead>
                <tr>
                  <th 
                    rowSpan="2" 
                    className="text-center font-semibold p-2 text-black bg-white" 
                    style={{ 
                      width: teacherColumnWidth, 
                      border: '1px solid black',
                      height: cellHeight
                    }}
                  >
                    Teacher
                  </th>
                  {days.map(day => (
                    <th 
                      key={day} 
                      colSpan={timetableData.periods.length} 
                      className="text-center font-semibold p-2 text-black bg-white" 
                      style={{ 
                        border: '1px solid black',
                        height: cellHeight
                      }}
                    >
                      {day}
                    </th>
                  ))}
                </tr>
                <tr>
                  {days.map(day =>
                    timetableData.periods.map(period => (
                      <th 
                        key={`${day}-${period}`} 
                        className="text-center text-sm p-1 text-black bg-white" 
                        style={{ 
                          width: cellWidth, 
                          border: '1px solid black',
                          height: cellHeight
                        }}
                      >
                        {period}
                      </th>
                    ))
                  )}
                </tr>
              </thead>
              <tbody>
                {timetableData.teacher.map(teacherObj => (
                  <tr key={teacherObj.teacher_ref}>
                    <td 
                      className="text-center font-medium p-2 text-black bg-white" 
                      style={{ 
                        width: teacherColumnWidth,
                        border: '1px solid black',
                        height: cellHeight
                      }}
                    >
                      {teacherObj.teacher_title} {teacherObj.teacher_name}
                    </td>
                    {days.map(day =>
                      timetableData.periods.map(period => {
                        const classSubject = getClassSubjectForTeacherDayPeriod(teacherObj.teacher_ref, day, period);
                        return (
                          <td
                            key={`${teacherObj.teacher_ref}-${day}-${period}`}
                            className="text-center p-1 text-xs text-black bg-white"
                            style={{ 
                              width: cellWidth,
                              border: '1px solid black',
                              height: cellHeight
                            }}
                          >
                            {classSubject}
                          </td>
                        );
                      })
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Timetable;