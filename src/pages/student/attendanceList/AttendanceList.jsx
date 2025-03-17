import React, { useContext, useEffect, useMemo, useState } from "react";
import Layout from "../../../layout/Layout";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogContent,
  FormLabel,
  IconButton,
  Slide,
} from "@mui/material";
import { IconX } from "@tabler/icons-react";

import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import moment from "moment";
import { toast } from "sonner";
import { ContextPanel } from "../../../context/ContextPanel";
import { Trash } from "lucide-react";
import LoaderComponent from "../../../components/common/LoaderComponent";
import {
  BackButton,
  CreateButton,
} from "../../../components/common/ButttonConfig";
import {
  StudentAttendanceListCreate,
  StudentAttendanceListDelete,
} from "../../../components/buttonIndex/ButtonComponents";
import {
  DeleteStudentAttendanceLisyById,
  StudentAttendanceLisyById,
  StudentAttendanceLisyByYear,
  UpdateStudentAttendanceLisyById,
} from "../../../components/common/UseApi";

const AttendanceList = () => {
  const [studentAttendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { selectedYear } = useContext(ContextPanel);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [attendanceid, setAttendanceId] = useState("");
  const [attendace, setAttendance] = useState({
    studentAttendance_date: "",
  });

  const navigate = useNavigate();

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await StudentAttendanceLisyByYear(selectedYear);
      setAttendanceData(response?.studentClassAttendance);
    } catch (error) {
      console.error("Error fetching student List data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStudentData();
  }, [selectedYear]);

  useEffect(() => {
    const fetchAttendanceDataId = async () => {
      if (!attendanceid) return;

      try {
        const token = localStorage.getItem("token");
        const response = await StudentAttendanceLisyById(attendanceid);

        setAttendance({
          studentAttendance_date:
            response.studentClassAttendance.studentAttendance_date || "",
        });
      } catch (error) {
        console.error("Error fetching studentClassAttendance data", error);
      }
    };

    fetchAttendanceDataId();
  }, [attendanceid]);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onInputChange = (e) => {
    setAttendance({
      ...attendace,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = document.getElementById("addIndiv");
    if (!form.checkValidity()) {
      toast.error("Fill all required fields");
      setIsButtonDisabled(false);
      return;
    }
    const data = {
      studentAttendance_date: attendace.studentAttendance_date,
    };

    setIsButtonDisabled(true);
    try {
      const response = await UpdateStudentAttendanceLisyById(
        attendanceid,
        data
      );
      console.log(response);
      if (response?.code === 200) {
        toast.success(response?.msg);
        setOpenDialog(false);
        fetchStudentData();
        setAttendance({
          studentAttendance_date: "",
        });
      } else if (response?.code === 400) {
        toast.error(response?.msg);
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      toast.error("Something went wrong! Please try again.");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    setIsButtonDisabled(true);
    try {
      const response = await DeleteStudentAttendanceLisyById(attendanceid);
      if (response?.code == 200) {
        toast.success(response?.msg);
        setOpenDeleteDialog(false);
        fetchStudentData();
        setAttendance({
          studentAttendance_date: "",
        });
      } else if (response?.code === 400) {
        toast.error(response?.msg);
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      toast.error("Something went wrong! Please try again.");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "studentAttendance_admission_no",
        header: "Admission No",
        size: 150,
      },
      {
        accessorKey: "student_name",
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "student_gender",
        header: "Gender",
        size: 150,
      },

      {
        accessorKey: "studentAttendance_date",
        header: "Date",
        size: 150,
        Cell: ({ row }) => {
          const date = row.original.studentAttendance_date;
          return date ? moment(date).format("DD-MMM-YYYY") : "";
        },
      },
      {
        accessorKey: "studentAttendance_class",
        header: "Class",
        size: 150,
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
                  setAttendanceId(id);
                  setOpenDeleteDialog(true);
                }}
                className="flex items-center space-x-2"
                title="Delete"
              >
                <Trash className="h-5 w-5 text-red-500 cursor-pointer" />
              </div> */}
              <StudentAttendanceListDelete
                onClick={() => {
                  setAttendanceId(id);
                  setOpenDeleteDialog(true);
                }}
                className="flex items-center space-x-2"
              ></StudentAttendanceListDelete>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: studentAttendanceData || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableHiding: false,
    enableStickyHeader: true,
    enableStickyFooter: true,
    mantineTableContainerProps: { sx: { maxHeight: "400px" } },
  });
  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-500";
  return (
    <>
      <Layout>
        <div className="max-w-screen">
          <div className="bg-white p-4 mb-4 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
              <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-center md:text-left">
                Student Attendance List
              </h1>
              {/* <button
                onClick={() => navigate("/attendance-list/viewAttendance")}
                className={CreateButton}
              >
                <IconPlus className="w-4 h-4" /> Attendance
              </button> */}
              <StudentAttendanceListCreate
                onClick={() => navigate("/attendance-list/viewAttendance")}
                className={CreateButton}
              >
                <IconPlus className="w-4 h-4" /> Attendance
              </StudentAttendanceListCreate>
            </div>
          </div>

          <div className="shadow-md">
            {!studentAttendanceData ? (
              <LoaderComponent />
            ) : (
              <MantineReactTable table={table} />
            )}
          </div>
        </div>
      </Layout>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
        sx={{ backdropFilter: "blur(4px)" }}
        TransitionComponent={Slide}
        transitionDuration={500}
      >
        <DialogContent>
          <div className="mt-2">
            <div className="mb-4 flex justify-between">
              <h3 className="font-bold text-xl">Edit Attendance</h3>
              <IconButton edge="end" onClick={() => setOpenDialog(false)}>
                <IconX />
              </IconButton>
            </div>

            <form onSubmit={handleSubmit} id="addIndiv" className="space-y-6">
              <FormLabel required>Attendance Date</FormLabel>
              <input
                type="date"
                name="studentAttendance_date"
                value={attendace.studentAttendance_date}
                onChange={onInputChange}
                required
                className={inputClass}
              />

              <div className="flex space-x-2 justify-center">
                <button
                  type="submit"
                  disabled={isButtonDisabled}
                  className={CreateButton}
                >
                  {isButtonDisabled ? "Updating..." : "Update"}
                </button>
                <button
                  type="button"
                  className={BackButton}
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
      {/* //for delete */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        fullWidth
        maxWidth="sm"
        sx={{ backdropFilter: "blur(4px)" }}
        TransitionComponent={Slide}
        transitionDuration={500}
      >
        <DialogContent>
          <div className="mt-2">
            {/* Header */}
            <div className="mb-4 flex justify-between items-center">
              <h3 className="font-bold text-xl">Delete Attendance</h3>
              <IconButton edge="end" onClick={() => setOpenDeleteDialog(false)}>
                <IconX />
              </IconButton>
            </div>

            {/* Confirmation Text */}
            <div className="mb-4 text-center text-gray-700">
              Are you sure you want to delete the attendance?
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 justify-center">
              <button
                onClick={handleDelete}
                disabled={isButtonDisabled}
                className={CreateButton}
              >
                {isButtonDisabled ? "Deleting..." : "Delete"}
              </button>
              <button
                type="button"
                className={BackButton}
                onClick={() => setOpenDeleteDialog(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AttendanceList;
