        {/* {attendanceData && (
          <div className="mt-6">
            <h3 className="text-lg font-bold">Attendance List</h3>
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
                      <th className="border border-gray-300 p-2">Student</th>
                      {dates.map((date) => (
                        <th
                          key={date.date}
                          className="border border-gray-300 p-2"
                        >
                          {moment(date.date).format("DD")}
                        </th>
                      ))}
                    </tr>
                  </thead>
                                   {/* <tbody>
                    {attendanceData.student.map((student) => (
                      <tr key={student.student_name}>
                        <td className="border border-gray-300 p-2">
                          {student.student_name}
                        </td>
                        {dates.map((date) => (
                          <td
                            key={date.date}
                            className="border border-gray-300 p-2"
                          >
                            {date.holiday_for
                              ? date.holiday_for
                              : student.attendance_dates.includes(date.date)
                              ? "Absent"
                              : ""}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody> */}
        //         </table>
        //       </div>
        //     ))}
        //   </div>
        // )} */}
