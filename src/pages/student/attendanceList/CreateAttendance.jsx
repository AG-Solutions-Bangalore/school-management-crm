import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import axios from "axios";
import { toast } from "sonner";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../../base/BaseUrl";

const CreateAttendance = () => {
  const navigate = useNavigate();
  const [attendace, setAttendance] = useState({
    studentAttendance_date: "",
    studentAttendance_class: "",
    studentAttendance_admission_no: "",
  });
  const [classList, setClassList] = useState([]);
  const [attendanceAdmission, setAttendanceAdmission] = useState([]);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onInputChange = (e) => {
    setAttendance({
      ...attendace,
      [e.target.name]: e.target.value,
    });
  };
  const fetchClassData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-classes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClassList(response.data.classes);
    } catch (error) {
      console.error("Error fetching classes data", error);
    }
  };
  const fetchAttendanceData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-student-attendance-admission-no/${attendace.studentAttendance_class}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAttendanceAdmission(response.data.student);
    } catch (error) {
      console.error("Error fetching student data", error);
    }
  };
  useEffect(() => {
    fetchClassData();
    if (attendace.studentAttendance_class) {
      fetchAttendanceData();
    }
  }, [attendace.studentAttendance_class]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = document.getElementById("addIndiv");
    if (!form.checkValidity()) {
      toast.error("Fill all required");
      setIsButtonDisabled(false);

      return;
    }
    const data = {
      studentAttendance_date: attendace.studentAttendance_date,
      studentAttendance_class: attendace.studentAttendance_class,
      studentAttendance_admission_no: attendace.studentAttendance_admission_no,
    };

    setIsButtonDisabled(true);
    axios({
      url: `${BASE_URL}/api/panel-create-student-attendance`,
      method: "POST",

      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.code == 200) {
        toast.success(res.data.msg);
      } else if (res.data.code == 400) {
        toast.error(res.data.msg);
      }
      navigate("/attendance-list");
    });
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
    <Layout>
      <div className=" bg-[#FFFFFF] p-2  rounded-lg  ">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-red-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Add Attendance </span>
            </div>
            <IconArrowBack
              onClick={() => navigate("/attendance-list")}
              className="cursor-pointer hover:text-red-600"
            />
          </h2>
        </div>
        <hr />
        <form
          onSubmit={handleSubmit}
          id="addIndiv"
          className="w-full   rounded-lg mx-auto p-4 space-y-6 "
        >
          <div className="grid grid-cols-1  md:grid-cols-1 lg:grid-cols-3   gap-6">
            <div>
              <FormLabel required>Attendance Date</FormLabel>
              <input
                type="date"
                name="studentAttendance_date"
                value={attendace.studentAttendance_date}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel required>Class</FormLabel>

              <select
                name="studentAttendance_class"
                value={attendace.studentAttendance_class || ""}
                onChange={(e) => onInputChange(e)}
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
            </div>
            <div>
              <FormLabel required>Admission No</FormLabel>

              <select
                name="studentAttendance_admission_no"
                value={attendace.studentAttendance_admission_no || ""}
                onChange={(e) => onInputChange(e)}
                required
                className={inputClassSelect}
              >
                <option value="">Select Admission No</option>
                {attendanceAdmission.map((option, idx) => (
                  <option key={idx} value={option.student_admission_no}>
                    {option.student_name} -{option.student_admission_no}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              type="submit"
              className="text-center text-sm font-[400] cursor-pointer  w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
              disabled={isButtonDisabled}
            >
              {isButtonDisabled ? "Creating..." : "Create"}
            </button>

            <button
              type="button"
              className="text-center text-sm font-[400] cursor-pointer  w-36 text-white bg-red-600 hover:bg-red-400 p-2 rounded-lg shadow-md"
              onClick={() => {
                navigate("/attendance-list");
              }}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateAttendance;
