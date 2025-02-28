import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../../base/BaseUrl";
import { CircleMinus, SquarePlus } from "lucide-react";
import { Dialog, DialogContent, IconButton, Slide } from "@mui/material";
import { IconX } from "@tabler/icons-react";
import Weekday from "../../../components/common/data.json";
import {
  BackButton,
  CreateButton,
} from "../../../components/common/ButttonConfig";
const status = [
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Inactive",
    label: "Inactive",
  },
];
const TeacherSubEdit = ({
  openEditDialog,
  setOpenEditDialog,
  fetchStudentData,
  selectedTeacherSubId,
}) => {
  const [periodList, setPeriodList] = useState([]);
  const [teachersub, setTeacherSub] = useState({
    teachersub_class: "",
    teachersub_subject: "",
    teachersub_on: "",
    teachersub_period: "",
    teachersub_status: "",
  });
  const onInputChange = (e) => {
    setTeacherSub({
      ...teachersub,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setTeacherSub({ teacher_ref: "" });
  };
  const handleClose = () => {
    resetForm();
    setOpenEditDialog(false);
  };

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  useEffect(() => {
    const fetchPeriodData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-school-period`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPeriodList(response.data.schoolPeriod);
      } catch (error) {
        console.error("Error fetching period data", error);
      }
    };
    const fetchTeacherSubIdData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-teacher-subject-assign-by-id/${selectedTeacherSubId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTeacherSub((prev) => ({
          ...prev,
          teachersub_on: response.data.teacherSubject.teachersub_on,
          teachersub_period: response.data.teacherSubject.teachersub_period,
          teachersub_status: response.data.teacherSubject.teachersub_status,
          teachersub_class: response.data.teacherSubject.teachersub_class,
          teachersub_subject: response.data.teacherSubject.teachersub_subject,
        }));
      } catch (error) {
        console.error("Error fetching period data", error);
      }
    };
    if (openEditDialog && selectedTeacherSubId) {
      fetchPeriodData();
      fetchTeacherSubIdData();
    }
  }, [openEditDialog, selectedTeacherSubId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = document.getElementById("addTeacher");
    if (!form.checkValidity()) {
      toast.error("Please fill all required fields");
      return;
    }

    const data = {
      ...teachersub,
    };

    setIsButtonDisabled(true);
    try {
      const response = await axios.put(
        `${BASE_URL}/api/panel-update-teacher-subject-assign/${selectedTeacherSubId}`,
        data,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.code === 200) {
        toast.success(response.data.msg);
        handleClose();
        fetchStudentData();
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      toast.error("Error creating teacher subjecrr assign record");
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
      open={openEditDialog}
      onClose={() => setOpenEditDialog(false)}
      fullWidth
      maxWidth="md"
      sx={{ backdropFilter: "blur(4px)" }}
      TransitionComponent={Slide}
      transitionDuration={500}
    >
      <DialogContent>
        <div className="mt-2">
          <div className="mb-4 flex justify-between">
            <h3 className="font-bold text-xl">Edit Teacher Assign Subject</h3>
            <IconButton edge="end" onClick={handleClose}>
              <IconX />
            </IconButton>
          </div>
          <form
            onSubmit={handleSubmit}
            id="addTeacher"
            className="w-full rounded-lg mx-auto p-4 space-y-6"
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-center">
                      Subject <span className="text-red-500">*</span>
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center">
                      Class <span className="text-red-500">*</span>
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center">
                      Weekdays <span className="text-red-500">*</span>
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center">
                      Period <span className="text-red-500">*</span>
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center">
                      Status <span className="text-red-500">*</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        name="teachersub_class"
                        value={teachersub.teachersub_class || ""}
                        className={inputClass}
                        required
                        readOnly
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        name="teachersub_subject"
                        value={teachersub.teachersub_subject || ""}
                        className={inputClass}
                        required
                        readOnly
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <select
                        name="teachersub_on"
                        value={teachersub.teachersub_on || ""}
                        onChange={(e) => onInputChange(e)}
                        required
                        className={inputClassSelect}
                      >
                        <option value="">Select Weekday</option>
                        {Weekday?.Weekday?.map((option, idx) => (
                          <option key={option.id} value={option.title}>
                            {option.title}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <select
                        name="teachersub_period"
                        value={teachersub.teachersub_period || ""}
                        onChange={(e) => onInputChange(e)}
                        required
                        className={inputClassSelect}
                      >
                        <option value="">Select Period</option>
                        {periodList.map((option, idx) => (
                          <option key={idx} value={option.school_period}>
                            {option.school_period}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <select
                        name="teachersub_status"
                        value={teachersub.teachersub_status || ""}
                        onChange={(e) => onInputChange(e)}
                        required
                        className={inputClassSelect}
                      >
                        <option value="">Select Class</option>
                        {status.map((option, idx) => (
                          <option key={idx} value={option.label}>
                            {option.value}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                type="submit"
                className={CreateButton}
                disabled={isButtonDisabled}
              >
                {isButtonDisabled ? "Updatting..." : "Update"}
              </button>
              <button
                type="button"
                className={BackButton}
                onClick={handleClose}
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherSubEdit;
