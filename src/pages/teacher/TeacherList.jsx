import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../layout/Layout";
import { IconEdit, IconEye, IconPlus } from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
const TeacherList = () => {
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-teacher-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTeacherData(response.data?.teacher);
    } catch (error) {
      console.error("Error fetching teacher List data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, []);
  const toggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${BASE_URL}/api/panel-update-teacher-status/${id}`,
        {}, // Empty body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        fetchTeacherData();
      }
    } catch (error) {
      console.error("Error updating student status", error);
    }
  };
  const columns = useMemo(
    () => [
      {
        accessorKey: "teacher_name",
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "teacher_designation",
        header: "Designation",
        size: 150,
      },
      {
        accessorKey: "teacher_mobile",
        header: "Mobile",
        size: 150,
      },
      {
        accessorKey: "teacher_doj",
        header: "DOJ",
        size: 150,
      },

      {
        accessorKey: "teacher_status",
        header: "Status",
        size: 150,
        Cell: ({ row }) => {
          const { id, teacher_status } = row.original;
          return (
            <button
              onClick={() => toggleStatus(id, teacher_status)}
              className={`px-2 py-1 rounded transition-colors ${
                teacher_status === "Active"
                  ? "bg-green-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
            >
              {teacher_status}
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
            <div className="flex gap-2">
              <div
                onClick={() => navigate(`/teacher-list/editTeacher/${id}`)}
                className="flex items-center space-x-2"
                title="Edit"
              >
                <IconEdit className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: teacherData || [],
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
          <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
            <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-center md:text-left">
              Teacher List
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/teacher-list/createTeacher")}
                className=" flex flex-row items-center gap-1 text-center text-sm font-[400] cursor-pointer  w-[7rem] text-white bg-blue-600 hover:bg-red-700 p-2 rounded-lg shadow-md"
              >
                <IconPlus className="w-4 h-4" /> Teacher
              </button>
            </div>
          </div>
        </div>

        <div className=" shadow-md">
          <MantineReactTable table={table} />
        </div>
      </div>
    </Layout>
  );
};

export default TeacherList;
