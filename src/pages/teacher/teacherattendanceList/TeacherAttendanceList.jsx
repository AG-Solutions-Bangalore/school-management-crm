import { Dialog, DialogContent, IconButton, Slide } from "@mui/material";
import { IconX } from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../layout/Layout";

import moment from "moment";
import { toast } from "sonner";
import {
  TeacherAttendanceListCreate,
  TeacherAttendanceListDelete,
} from "../../../components/buttonIndex/ButtonComponents";
import { CreateButton } from "../../../components/common/ButttonConfig";
import LoaderComponent from "../../../components/common/LoaderComponent";
import {
  DELETE_TEACHERATTENDANCE_LIST,
  TEACHER_ATTENDANCE_LIST,
  TEACHER_ATTENDANCELIST_BY_ID,
  UPDATE_TEACHERATTENDANCE_LIST
} from "../../../components/common/UseApi";
import useApiToken from "../../../components/common/useApiToken";
import { ContextPanel } from "../../../context/ContextPanel";
import CreateTeacherAttendance from "./CreateAttendance";

const TeacherAttendanceList = () => {
  const [teacherAttendanceData, setTeacherAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { selectedYear } = useContext(ContextPanel);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [attendanceid, setAttendanceId] = useState("");
  const navigate = useNavigate();
  const [attendace, setAttendance] = useState({
    teacherAttendance_date: "",
  });
  const token = useApiToken();
  const fetchTeacherData = async () => {
    setLoading(true);

    const response = await TEACHER_ATTENDANCE_LIST(selectedYear, token);

    setTeacherAttendanceData(response?.teacherAttendance);

    setLoading(false);
  };

  useEffect(() => {
    fetchTeacherData();
  }, [selectedYear]);

  useEffect(() => {
    const fetchAttendanceDataId = async () => {
      if (!attendanceid) return;

      try {
        const response = await TEACHER_ATTENDANCELIST_BY_ID(
          attendanceid,
          token
        );

        setAttendance({
          teacherAttendance_date:
            response.teacherAttendance?.teacherAttendance_date || "",
        });
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendanceDataId();
  }, [attendanceid, openDialog, openDeleteDialog]);

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
      teacherAttendance_date: attendace.teacherAttendance_date,
    };

    setIsButtonDisabled(true);

    const response = await UPDATE_TEACHERATTENDANCE_LIST(
      attendanceid,
      data,
      token
    );

    if (response.code === 200) {
      toast.success(response.msg);
      setOpenDialog(false);
      fetchTeacherData();
      setAttendance({
        teacherAttendance_date: "",
      });
      setIsButtonDisabled(false);
    } else if (response.code === 400) {
      toast.error(response.msg);
    }
  };
  const handleDelete = async (e) => {
    e.preventDefault();

    setIsButtonDisabled(true);

    const response = await DELETE_TEACHERATTENDANCE_LIST(attendanceid, token);

    if (response.code === 200) {
      toast.success(response.msg);
      setOpenDeleteDialog(false);
      fetchTeacherData();
    } else if (response.code === 400) {
      toast.error(response.msg);
    }
    setIsButtonDisabled(false);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "teacher_name",
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "teacher_mobile",
        header: "Mobile",
        size: 150,
      },

      {
        accessorKey: "teacherAttendance_date",
        header: "Date",
        size: 150,
        Cell: ({ row }) => {
          const date = row.original.teacherAttendance_date;
          return date ? moment(date).format("DD-MMM-YYYY") : "";
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
                  setAttendanceId(id);
                  setOpenDialog(true);
                }}
                className="flex items-center space-x-2"
                title="Edit"
              >
                <Edit className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div> */}
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
              <TeacherAttendanceListDelete
                onClick={() => {
                  setAttendanceId(id);
                  setOpenDeleteDialog(true);
                }}
                className="flex items-center space-x-2"
              ></TeacherAttendanceListDelete>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: teacherAttendanceData || [],
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
                Teacher Attendance List
              </h1>
              <TeacherAttendanceListCreate
                onClick={() => navigate("/teacher-viewAttendance")}
                // onClick={() => setOpenCreateDialog(true)}
                className={CreateButton}
              ></TeacherAttendanceListCreate>
            </div>
          </div>

          <div className="shadow-md">
            {!teacherAttendanceData ? (
              <LoaderComponent />
            ) : (
              <MantineReactTable table={table} />
            )}
          </div>
        </div>
      </Layout>
      <CreateTeacherAttendance
        openCreateDialog={openCreateDialog}
        setOpenCreateDialog={setOpenCreateDialog}
        fetchTeacherData={fetchTeacherData}
      />

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

            <form onSubmit={handleSubmit} id="addIndiv" className="space-y-2">
              <FormLabel required>Date</FormLabel>
              <input
                type="date"
                name="teacherAttendance_date"
                value={attendace.teacherAttendance_date}
                onChange={onInputChange}
                required
                className={inputClass}
              />

              <div className="flex space-x-2 justify-center">
                <button
                  type="submit"
                  disabled={isButtonDisabled}
                  className="text-center text-sm font-[400] cursor-pointer  w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                >
                  {isButtonDisabled ? "Updating..." : "Update"}
                </button>
                <button
                  type="button"
                  className="text-center text-sm font-[400] cursor-pointer  w-36 text-white bg-red-600 hover:bg-red-400 p-2 rounded-lg shadow-md"
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
                className="text-center text-sm font-medium cursor-pointer w-36 
                     text-white bg-blue-600 hover:bg-blue-700 p-2 rounded-lg shadow-md"
              >
                {isButtonDisabled ? "Deleting..." : "Delete"}
              </button>
              <button
                type="button"
                className="text-center text-sm font-medium cursor-pointer w-36 
                     text-white bg-red-600 hover:bg-red-700 p-2 rounded-lg shadow-md"
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

export default TeacherAttendanceList;
