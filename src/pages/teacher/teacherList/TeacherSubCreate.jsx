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
const TeacherSubCreate = ({
  openDialog,
  setOpenDialog,
  teacherData,
  fetchStudentData,
}) => {
  const [classList, setClassList] = useState([]);
  const [periodList, setPeriodList] = useState([]);
  const [subject, setSubject] = useState([]);
  const [className, setClassName] = useState(null);

  const useTemplate = {
    teachersub_class: "",
    teachersub_subject: "",
    teachersub_on: "",
    teachersub_period: "",
  };

  const [users, setUsers] = useState([{ ...useTemplate }]);

  const [teachersub, setTeacherSub] = useState({
    teacher_ref: "",
  });

  //   console.log(teachersub.teacher_ref);
  const resetForm = () => {
    setUsers([{ ...useTemplate }]);
    setTeacherSub({ teacher_ref: "" });
    setClassName(null); //
    setSubject([]); //
  };
  const handleClose = () => {
    resetForm();
    setOpenDialog(false);
  };
  console.log(className);
  useEffect(() => {
    if (openDialog) {
      setTeacherSub((prev) => ({
        ...prev,
        teacher_ref: teacherData.teacher.teacher_ref,
      }));
    }
  }, [openDialog, teacherData]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-classes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClassList(response.data.classes);
      } catch (error) {
        console.error("Error fetching teacher data", error);
      }
    };

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
    if (openDialog) {
      fetchClassData();
      fetchPeriodData();
    }
  }, [openDialog]);

  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-subject-by-class/${className}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSubject(response.data.subject);
      } catch (error) {
        console.error("Error fetching teacher data", error);
      }
    };
    if (className) {
      fetchSubjectData();
    }
  }, [className]);
  const addItem = () => {
    setUsers([...users, useTemplate]);
  };
  const removeItem = (index) => {
    setUsers(users.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    console.log(value);
    setUsers((prevUsers) => {
      const updatedUsers = [...prevUsers];
      updatedUsers[index] = { ...updatedUsers[index], [name]: value };
      return updatedUsers;
    });
    if (name === "teachersub_class") {
      setClassName(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = document.getElementById("addTeacher");
    if (!form.checkValidity()) {
      toast.error("Please fill all required fields");
      return;
    }

    const data = {
      ...teachersub,
      teacher_data: users,
    };

    setIsButtonDisabled(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/panel-create-teacher-subject-assign`,
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

  const inputClassSelect =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-500";

  return (
    <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      fullWidth
      maxWidth="md"
      sx={{ backdropFilter: "blur(4px)" }}
      TransitionComponent={Slide}
      transitionDuration={500}
    >
      <DialogContent>
        <div className="mt-2">
          <div className="mb-4 flex justify-between">
            <h3 className="font-bold text-xl">Create Teacher Assign Subject</h3>
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
                      Weekdays <span className="text-red-500">*</span>
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center">
                      Period <span className="text-red-500">*</span>
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center">
                      Class <span className="text-red-500">*</span>
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center">
                      Subject <span className="text-red-500">*</span>
                    </th>

                    <th className="border border-gray-300 px-4 py-2 text-center">
                      <div className="flex flex-row items-center justify-center space-x-4">
                        <span>Actions</span>
                        <button
                          onClick={addItem}
                          type="button"
                          className={`${CreateButton} w-[40px]`}
                        >
                          <SquarePlus />
                        </button>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index} className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        <select
                          name="teachersub_on"
                          value={user.teachersub_on || ""}
                          onChange={(e) => handleInputChange(index, e)}
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
                          value={user.teachersub_period || ""}
                          onChange={(e) => handleInputChange(index, e)}
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
                          name="teachersub_class"
                          value={user.teachersub_class || ""}
                          onChange={(e) => handleInputChange(index, e)}
                          required
                          className={inputClassSelect}
                        >
                          <option value="">Select Class</option>
                          {classList.map((option, idx) => (
                            <option key={idx} value={option.classes}>
                              {option.classes}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="border border-gray-300 px-4 py-2">
                        <select
                          name="teachersub_subject"
                          value={user.teachersub_subject || ""}
                          onChange={(e) => handleInputChange(index, e)}
                          required
                          className={inputClassSelect}
                        >
                          <option value="">Select Subject</option>
                          {subject.map((option, idx) => (
                            <option key={idx} value={option.subject}>
                              {option.subject}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="border border-gray-300 px-4 py-2 text-center flex justify-center">
                        {!user.id && (
                          <button
                            onClick={() => removeItem(index)}
                            type="button"
                            className={`${BackButton} w-[40px]`}
                          >
                            <CircleMinus />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                type="submit"
                className={CreateButton}
                disabled={isButtonDisabled}
              >
                {isButtonDisabled ? "Creating..." : "Create"}
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

export default TeacherSubCreate;
