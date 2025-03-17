import React, { useContext, useEffect, useMemo, useState } from "react";
import Layout from "../../../layout/Layout";
import { IconEdit, IconEye, IconPlus } from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import moment from "moment/moment";
import { toast } from "sonner";
import BASE_URL, {
  StudentImageUrl,
  StudentNoImageUrl,
} from "../../../base/BaseUrl";
import { encryptId } from "../../../components/common/EncryptionDecryption";
import LoaderComponent from "../../../components/common/LoaderComponent";
import {
  StudentAllStudentEdit,
  StudentAllStudentView,
} from "../../../components/buttonIndex/ButtonComponents";
import {
  CurrentStudentListByYear,
  UpdateStudentStatus,
} from "../../../components/common/UseApi";
import { ContextPanel } from "../../../context/ContextPanel";

const CurrentStudentList = () => {
  const [studentData, setStudentData] = useState(null);
  const [filteredStudentData, setFilteredStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeClass, setActiveClass] = useState("ALL");
  const navigate = useNavigate();
  const { selectedYear } = useContext(ContextPanel);

  const classList = [
    "ALL",
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

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      console.log("Fetching data for year:", selectedYear);

      const response = await CurrentStudentListByYear(selectedYear);

      if (response?.student) {
        setStudentData(response.student);
        setFilteredStudentData(response.student);
      } else {
        console.warn("No student data found in response.");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStudentData();
  }, []);

  const filterByClass = (className) => {
    setActiveClass(className);
    if (className === "ALL") {
      setFilteredStudentData(studentData);
    } else {
      const filtered = studentData.filter(
        (student) => student.studentClass_class === className
      );
      setFilteredStudentData(filtered);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await UpdateStudentStatus(id);
      if (response.code === 200) {
        toast.success(response.msg);
        fetchStudentData();
      } else {
        toast.error(response.msg);
      }
    } catch (error) {
      console.error("Error updating student status", error);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "student_photo",
        header: "Photo",
        size: 100,
        Cell: ({ row }) => {
          const imageUrl = row.original.student_photo
            ? `${StudentImageUrl}/${row.original.student_photo}`
            : StudentNoImageUrl;

          return (
            <img
              src={imageUrl}
              alt="Student"
              className="w-12 h-12 rounded-full object-cover border"
            />
          );
        },
      },

      {
        accessorKey: "combined",
        header: "Admission No/Date",
        size: 150,
        accessorFn: (row) =>
          `${row.student_admission_no} - ${row.student_admission_date}`,
        Cell: ({ row }) => (
          <div className="flex flex-col text-xs">
            <span className="text-black font-semibold">
              {row.original.student_admission_no}
            </span>
            <span className="text-black text-xs">
             {row.original.student_admission_date ? (moment(row.original.student_admission_date).format(
                            "DD-MM-YYYY"
                          )):""}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "combined1",
        header: "Name/Class",
        size: 150,
        accessorFn: (row) => `${row.student_name} - ${row.studentClass_class}`,
        Cell: ({ row }) => (
          <div className="flex flex-col text-xs">
            <span className="text-black font-semibold">
              {row.original.student_name}
            </span>
            <span className="text-black text-xs">
              {row.original.studentClass_class}
            </span>
          </div>
        ),
      },

      {
        accessorKey: "combined",
        header: "Gender /DOB",
        size: 150,
        accessorFn: (row) => `${row.student_gender} - ${row.student_dob}`,
        Cell: ({ row }) => (
          <div className="flex flex-col text-xs">
            <span className="text-black font-semibold">
              {row.original.student_gender}
            </span>
            <span className="text-black text-xs">
              {moment(row.original.student_dob).format("DD-MMM-YYYY")}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "student_father_mobile",
        header: "Father Mobile",
        size: 150,
      },
      {
        accessorKey: "student_status",
        header: "Status",
        size: 150,
        Cell: ({ row }) => {
          const { id, student_status } = row.original;
          return (
            <button
              onClick={() => toggleStatus(id)}
              className={`px-2 py-1 rounded transition-colors ${
                student_status === "Active"
                  ? "bg-green-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
            >
              {student_status}
            </button>
          );
        },
      },
      {
        id: "id",
        header: "Action",
        size: 20,
        enableHiding: false,
        Cell: ({ row }) => {
          const id = row.original.id;

          return (
            // <div className="flex gap-2">
            //   <div
            //     onClick={() => {
            //       const encryptedId = encryptId(id);

            //       navigate(
            //         `/student-list/editStudent/${encodeURIComponent(
            //           encryptedId
            //         )}`,
            //         { state: { from: "/current-student-list" } }
            //       );
            //     }}
            //     className="flex items-center space-x-2"
            //     title="Edit"
            //   >
            //     <IconEdit className="h-5 w-5 text-blue-500 cursor-pointer" />
            //   </div>
            //   <div
            //     onClick={() => {
            //       const encryptedId = encryptId(id);

            //       navigate(
            //         `/student-list/viewStudent/${encodeURIComponent(
            //           encryptedId
            //         )}`,
            //         { state: { from: "/current-student-list" } }
            //       );
            //     }}
            //     className="flex items-center space-x-2"
            //     title="View"
            //   >
            //     <IconEye className="h-5 w-5 text-blue-500 cursor-pointer" />
            //   </div>
            // </div>
            <div className="flex gap-2">
              <StudentAllStudentEdit
                onClick={() => {
                  const encryptedId = encryptId(id);

                  navigate(
                    `/student-list/editStudent/${encodeURIComponent(
                      encryptedId
                    )}`,
                    { state: { from: "/current-student-list" } }
                  );
                }}
                className="flex items-center space-x-2"
              ></StudentAllStudentEdit>
              <StudentAllStudentView
                onClick={() => {
                  const encryptedId = encryptId(id);

                  navigate(
                    `/student-list/viewStudent/${encodeURIComponent(
                      encryptedId
                    )}`,
                    { state: { from: "/current-student-list" } }
                  );
                }}
                className="flex items-center space-x-2"
              ></StudentAllStudentView>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: filteredStudentData || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableHiding: false,
    enableStickyHeader: true,
    enableStickyFooter: true,
    mantineTableContainerProps: { sx: { maxHeight: "400px" } },
    initialState: { columnVisibility: { address: false } },
  });

  return (
    <Layout>
      <div className="max-w-screen">
        <div className="bg-white p-4 mb-4 rounded-lg shadow-md">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-center md:text-left">
              Current Student List
            </h1>
          </div>

          {/* Class filter Section  */}
          <div className="flex flex-wrap gap-2">
            {classList.map((className) => (
              <button
                key={className}
                onClick={() => filterByClass(className)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  activeClass === className
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {className}
              </button>
            ))}
          </div>
        </div>

        <div className="shadow-md">
          {!filteredStudentData ? (
            <LoaderComponent />
          ) : (
            <MantineReactTable table={table} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CurrentStudentList;
