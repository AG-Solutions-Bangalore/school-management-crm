import { Dialog, DialogContent, IconButton, Slide } from "@mui/material";
import { IconX } from "@tabler/icons-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BASE_URL from "../../../base/BaseUrl";
import { CREATE_TEACHER_ATTENDANCE } from "../../../components/common/UseApi";
import useApiToken from "../../../components/common/useApiToken";
const CreateTeacherAttendance = ({
  openCreateDialog,
  setOpenCreateDialog,
  fetchTeacherData,
}) => {
  const navigate = useNavigate();
  const [teacherRefData, setTeacherRefData] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useApiToken();
  const [createattendace, setCreateAttendance] = useState({
    teacher_ref: "",
    teacherAttendance_date: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onInputChange = (e) => {
    setCreateAttendance({
      ...createattendace,
      [e.target.name]: e.target.value,
    });
  };

  const fetchTeacherRefData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-teacher`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTeacherRefData(response.data?.teacher);
    } catch (error) {
      console.error("Error fetching student List data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (openCreateDialog) {
      fetchTeacherRefData();
    }
  }, [openCreateDialog]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = document.getElementById("addIndiv");

    if (!form.checkValidity()) {
      toast.error("Fill all required");
      setIsButtonDisabled(false);
      return;
    }

    const data = {
      teacher_ref: createattendace.teacher_ref,
      teacherAttendance_date: createattendace.teacherAttendance_date,
    };

    setIsButtonDisabled(true);

    try {
      const res = await CREATE_TEACHER_ATTENDANCE(data, token);

      if (res.code === 200) {
        toast.success(res.msg);
      } else if (res.code === 400) {
        toast.error(res.msg);
      }
      setOpenCreateDialog(false);
      fetchTeacherData();
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
      console.error("Error:", error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const inputClassSelect =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-500";
  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-500";
  return (
    <Dialog
      open={openCreateDialog}
      onClose={() => setOpenCreateDialog(false)}
      fullWidth
      maxWidth="sm"
      sx={{ backdropFilter: "blur(4px)" }}
      TransitionComponent={Slide}
      transitionDuration={500}
    >
      <DialogContent>
        <div className="mt-2">
          <div className="mb-4 flex justify-between">
            <h3 className="font-bold text-xl">Create Teacher Attendance</h3>
            <IconButton edge="end" onClick={() => setOpenCreateDialog(false)}>
              <IconX />
            </IconButton>
          </div>

          <form onSubmit={handleSubmit} id="addIndiv" className="space-y-6">
            <div>
              <FormLabel required>Techer</FormLabel>

              <select
                name="teacher_ref"
                value={createattendace.teacher_ref || ""}
                onChange={(e) => onInputChange(e)}
                required
                className={inputClassSelect}
              >
                <option value="">Select Teacher</option>
                {teacherRefData.map((option, idx) => (
                  <option key={idx} value={option.teacher_ref}>
                    {option.teacher_title}
                    {option.teacher_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FormLabel required>Date</FormLabel>
              <input
                type="date"
                name="teacherAttendance_date"
                value={createattendace.teacherAttendance_date}
                onChange={onInputChange}
                required
                className={inputClass}
              />
            </div>
            <div className="flex space-x-2 justify-center">
              <button
                type="submit"
                disabled={isButtonDisabled}
                className="text-center text-sm font-[400] cursor-pointer  w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
              >
                {isButtonDisabled ? "Creatting..." : "Create"}
              </button>
              <button
                type="button"
                className="text-center text-sm font-[400] cursor-pointer  w-36 text-white bg-red-600 hover:bg-red-400 p-2 rounded-lg shadow-md"
                onClick={() => setOpenCreateDialog(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTeacherAttendance;
