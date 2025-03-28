import { Printer } from "lucide-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import moment from "moment/moment";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { StudentImageUrl, StudentNoImageUrl } from "../../../base/BaseUrl";
import {
  StudentAllStudentCreate,
  StudentAllStudentEdit,
  StudentAllStudentView,
} from "../../../components/buttonIndex/ButtonComponents";
import { CreateButton } from "../../../components/common/ButttonConfig";
import { encryptId } from "../../../components/common/EncryptionDecryption";
import LoaderComponent from "../../../components/common/LoaderComponent";
import {
  STUDENT_LIST,
  UPDATE_STUDENT_STATUS
} from "../../../components/common/UseApi";
import useApiToken from "../../../components/common/useApiToken";
import Layout from "../../../layout/Layout";

const StudentList = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = useApiToken();
  const fetchStudentData = async () => {
    setLoading(true);
    const response = await STUDENT_LIST(token);
    setStudentData(response?.student);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const toggleStatus = async (id) => {
    try {
      const response = await UPDATE_STUDENT_STATUS(id, token);
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
        accessorKey: "admission_details",
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
              {row.original.student_admission_date
                ? moment(row.original.student_admission_date).format(
                    "DD-MM-YYYY"
                  )
                : ""}
            </span>
          </div>
        ),
      },

      {
        accessorKey: "student_name",
        header: "Name",
        size: 150,
      },

      {
        accessorKey: "student_dob",
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
            <div className="flex gap-2">
              <div
                onClick={() => {
                  navigate(`/student-print/${id}`);
                }}
                className="flex items-center space-x-2"
                title="View"
              >
                <Printer className="h-4 w-4 text-indigo-600 cursor-pointer" />
              </div>
              {/* <div
                onClick={() => {
                  const encryptedId = encryptId(id);

                  navigate(
                    `/student-list/editStudent/${encodeURIComponent(
                      encryptedId
                    )}`,
                    { state: { from: "/student-list" } }
                  );
                }}
                className="flex items-center space-x-2"
                title="Edit"
              >
                <IconEdit className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div>
              <div
                onClick={() => {
                  const encryptedId = encryptId(id);

                  navigate(
                    `/student-list/viewStudent/${encodeURIComponent(
                      encryptedId
                    )}`,
                    { state: { from: "/student-list" } }
                  );
                }}
                className="flex items-center space-x-2"
                title="Edit"
              >
                <IconEye className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div> */}
              <StudentAllStudentEdit
                onClick={() => {
                  const encryptedId = encryptId(id);

                  navigate(
                    `/student-list/editStudent/${encodeURIComponent(
                      encryptedId
                    )}`,
                    { state: { from: "/student-list" } }
                  );
                }}
                className="flex items-center space-x-2"
              />
              <StudentAllStudentView
                onClick={() => {
                  const encryptedId = encryptId(id);

                  navigate(
                    `/student-list/viewStudent/${encodeURIComponent(
                      encryptedId
                    )}`,
                    { state: { from: "/student-list" } }
                  );
                }}
                className="flex items-center space-x-2"
              />
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: studentData || [],
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
              All Student
            </h1>
            <div className="flex gap-2">
              {/* <button
                onClick={() => navigate("/student-list/createStudent")}
                className={CreateButton}
                >
                <IconPlus className="w-4 h-4" /> Student
              </button> */}
              <StudentAllStudentCreate
                onClick={() => navigate("/student-list/createStudent")}
                className={CreateButton}
              />
            </div>
          </div>
        </div>

        <div className="shadow-md">
          {!studentData ? (
            <LoaderComponent />
          ) : (
            <MantineReactTable table={table} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudentList;
