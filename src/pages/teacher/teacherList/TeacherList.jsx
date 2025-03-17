import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../../layout/Layout";
import { IconEdit, IconEye, IconPlus } from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import moment from "moment/moment";
import { toast } from "sonner";
import { Eye } from "lucide-react";
import { encryptId } from "../../../components/common/EncryptionDecryption";
import LoaderComponent from "../../../components/common/LoaderComponent";
import { CreateButton } from "../../../components/common/ButttonConfig";
import {
  TeacherTeacherListCreate,
  TeacherTeacherListEdit,
  TeacherTeacherListView,
} from "../../../components/buttonIndex/ButtonComponents";
import {
  fetchTeacherList,
  updateTeacherStatus,
} from "../../../components/common/UseApi";
const TeacherList = () => {
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTeacherData = async () => {
    setLoading(true);
    const teachers = await fetchTeacherList();

    setTeacherData(teachers?.teacher);

    setLoading(false);
  };

  useEffect(() => {
    fetchTeacherData();
  }, []);
  const toggleStatus = async (id) => {
    try {
      const response = await updateTeacherStatus(id);
      console.log(response);
      if (response?.code === 200) {
        toast.success(response.msg);

        // Fetch updated teacher list
        const teachers = await fetchTeacherList();
        setTeacherData(teachers?.teacher);
      } else {
        toast.error(response?.msg || "Failed to update status");
      }
    } catch (error) {
      console.error(
        "Error updating teacher status:",
        error.response || error.message
      );
      toast.error(
        error.response?.msg || "Failed to update status. Please try again."
      );
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "combined",
        header: "Name",
        size: 150,
        accessorFn: (row) => `${row.teacher_title} - ${row.teacher_name}`,
        Cell: ({ row }) => (
          <div className="flex">
            <span className="text-black font-semibold mr-2">
              {row.original.teacher_title}
            </span>
            <span className="text-black">{row.original.teacher_name}</span>
          </div>
        ),
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
        Cell: ({ row }) => {
          const date = row.original.teacher_doj;
          return date ? moment(date).format("DD-MMM-YYYY") : "";
        },
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
              {/* <div
                onClick={() => {
                  const encryptedId = encryptId(id);

                  navigate(
                    `/teacher-list/editTeacher/${encodeURIComponent(
                      encryptedId
                    )}`
                  );
                }}
                className="flex items-center space-x-2"
                title="Edit"
              >
                <IconEdit className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div> */}
              <TeacherTeacherListEdit
                onClick={() => {
                  const encryptedId = encryptId(id);

                  navigate(
                    `/teacher-list/editTeacher/${encodeURIComponent(
                      encryptedId
                    )}`
                  );
                }}
                className="flex items-center space-x-2"
              ></TeacherTeacherListEdit>
              {/* <div
                onClick={() => {
                  const encryptedId = encryptId(id);

                  navigate(
                    `/teacher-list/viewTeacher/${encodeURIComponent(
                      encryptedId
                    )}`
                  );
                }}
                className="flex items-center space-x-2"
                title="View"
              >
                <Eye className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div> */}
              <TeacherTeacherListView
                onClick={() => {
                  const encryptedId = encryptId(id);

                  navigate(
                    `/teacher-list/viewTeacher/${encodeURIComponent(
                      encryptedId
                    )}`
                  );
                }}
                className="flex items-center space-x-2"
              ></TeacherTeacherListView>
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
              {/* <button
                onClick={() => navigate("/teacher-list/createTeacher")}
                className={CreateButton}
              >
                <IconPlus className="w-4 h-4" /> Teacher
              </button> */}
              <TeacherTeacherListCreate
                onClick={() => navigate("/teacher-list/createTeacher")}
                className={CreateButton}
              ></TeacherTeacherListCreate>
            </div>
          </div>
        </div>

        <div className=" shadow-md">
          {!teacherData ? (
            <LoaderComponent />
          ) : (
            <MantineReactTable table={table} />
          )}{" "}
        </div>
      </div>
    </Layout>
  );
};

export default TeacherList;
