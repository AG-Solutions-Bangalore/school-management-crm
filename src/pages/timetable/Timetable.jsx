import React, { useState, useEffect, useContext } from 'react';
import Layout from '../../layout/Layout';
import axios from 'axios';
import BASE_URL from '../../base/BaseUrl';
import { ContextPanel } from '../../context/ContextPanel';

const Timetable = () => {
  const [timetableData, setTimetableData] = useState({
    classes: [],
    teacherAssign: [],
    periods: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {selectedYear}= useContext(ContextPanel)
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const cellWidth = '80px';
  const cellHeight = '40px';
  const classColumnWidth = '100px';

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-student-class-timetable/${selectedYear}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      
        const periods = response.data.shool_period.map(period => period.school_period);

        setTimetableData({
          classes: response.data.classes,
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

  const getSubjectForClassDayPeriod = (classValue, day, period) => {
    const assignment = timetableData.teacherAssign.find(
      item => 
        item.teachersub_class === classValue &&
        item.teachersub_on === day &&
        item.teachersub_period === period
    );
    
    return assignment ? assignment.teachersub_subject : '';
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

 
  const totalWidth = parseInt(classColumnWidth) + (days.length * timetableData.periods.length * parseInt(cellWidth));

  return (
    <Layout>
      <div className="p-4 max-w-7xl mx-auto bg-white rounded-lg">
        <h1 className="text-2xl font-bold text-center text-black mb-6">Class Timetable 2024-25</h1>
        
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
                      width: classColumnWidth, 
                      border: '1px solid black',
                      height: cellHeight
                    }}
                  >
                    Class
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
                {timetableData.classes.map(classObj => (
                  <tr key={classObj.classes}>
                    <td 
                      className="text-center font-medium p-2 text-black bg-white" 
                      style={{ 
                        width: classColumnWidth,
                        border: '1px solid black',
                        height: cellHeight
                      }}
                    >
                      {classObj.classes}
                    </td>
                    {days.map(day =>
                      timetableData.periods.map(period => {
                        const subject = getSubjectForClassDayPeriod(classObj.classes, day, period);
                        return (
                          <td
                            key={`${classObj.classes}-${day}-${period}`}
                            className="text-center p-1 text-sm text-black bg-white"
                            style={{ 
                              width: cellWidth,
                              border: '1px solid black',
                              height: cellHeight
                            }}
                          >
                            {subject}
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
