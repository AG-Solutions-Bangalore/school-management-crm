import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import axios from "axios";
import { toast } from "sonner";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../../../base/BaseUrl";
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
const EditTeacher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacherdesignation, setTeacherDesignation] = useState([]);

  const [teacher, setTeacher] = useState({
    teacher_title: "",
    teacher_name: "",
    teacher_designation: "",
    teacher_qualification: "",
    teacher_dob: "",
    teacher_doj: "",
    teacher_adhar_no: "",
    teacher_pan_no: "",
    teacher_mobile: "",
    teacher_email_id: "",
    teacher_address: "",
    teacher_bank_name: "",
    teacher_acct_no: "",
    teacher_ifsc: "",
    teacher_branch: "",
    teacher_pf_no: "",
    teacher_uan_no: "",
    teacher_emergency_no: "",
    teacher_status: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const fetchTeacherDataByid = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-teacher-by-id/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data && response.data.teacher) {
        setTeacher({
          teacher_title: response.data.teacher.teacher_title || "",
          teacher_name: response.data.teacher.teacher_name || "",
          teacher_designation: response.data.teacher.teacher_designation || "",
          teacher_qualification:
            response.data.teacher.teacher_qualification || "",
          teacher_dob: response.data.teacher.teacher_dob || "",
          teacher_doj: response.data.teacher.teacher_doj || "",
          teacher_adhar_no: response.data.teacher.teacher_adhar_no || "",
          teacher_pan_no: response.data.teacher.teacher_pan_no || "",
          teacher_mobile: response.data.teacher.teacher_mobile || "",
          teacher_email_id: response.data.teacher.teacher_email_id || "",
          teacher_address: response.data.teacher.teacher_address || "",
          teacher_bank_name: response.data.teacher.teacher_bank_name || "",
          teacher_acct_no: response.data.teacher.teacher_acct_no || "",
          teacher_ifsc: response.data.teacher.teacher_ifsc || "",
          teacher_branch: response.data.teacher.teacher_branch || "",
          teacher_pf_no: response.data.teacher.teacher_pf_no || "",
          teacher_uan_no: response.data.teacher.teacher_uan_no || "",
          teacher_emergency_no:
            response.data.teacher.teacher_emergency_no || "",
          teacher_status: response.data.teacher.teacher_status || "",
        });
      }
    } catch (error) {
      console.error("Error fetching teacher data", error);
    }
  };
  const fetchTeacherData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-usertypes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTeacherDesignation(response.data.userType);
    } catch (error) {
      console.error("Error fetching teacher data", error);
    }
  };

  useEffect(() => {
    fetchTeacherData();
    fetchTeacherDataByid();
  }, [id]);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "teacher_adhar_no") {
      newValue = value.replace(/\D/g, "");
      if (newValue.length > 12) return;
    }

    if (name === "teacher_pan_no") {
      newValue = newValue.replace(/[^A-Z0-9]/g, "");

      if (newValue.length > 10) return;

      let formattedValue = "";
      if (newValue.length <= 5) {
        formattedValue = newValue.replace(/[^A-Z]/g, "");
      } else if (newValue.length <= 9) {
        formattedValue =
          newValue.substring(0, 5) +
          newValue.substring(5).replace(/[^0-9]/g, "");
      } else {
        formattedValue =
          newValue.substring(0, 9) +
          newValue.substring(9).replace(/[^A-Z]/g, "");
      }

      newValue = formattedValue;
    }
    if (name === "teacher_mobile") {
      newValue = value.replace(/\D/g, "");
      if (newValue.length > 10) return;
    }
    if (name === "teacher_acct_no") {
      newValue = value.replace(/\D/g, "");
      if (newValue.length > 16) return;
    }
    if (name === "teacher_emergency_no") {
      newValue = value.replace(/\D/g, "");
      if (newValue.length > 10) return;
    }
    console.log(name, newValue);
    setTeacher((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = document.getElementById("addTeacher");
    if (!form.checkValidity()) {
      toast.error("Please fill all required fields");
      return;
    }

    const data = {
      ...teacher,
    };

    setIsButtonDisabled(true);
    try {
      const response = await axios.put(
        `${BASE_URL}/api/panel-update-teacher/${id}`,
        data,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.code === 200) {
        toast.success(response.data.msg);
        navigate("/teacher-list");
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      toast.error("Error creating teacher record");
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
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-blue-500";
  return (
    <Layout>
      <div className="bg-white p-2 rounded-lg">
        <div className="sticky top-0 p-2 mb-4 border-b-2 border-red-500 bg-[#E1F5FA] rounded-lg">
          <h2 className="px-5 text-black text-lg flex justify-between items-center rounded-xl p-2">
            <div className="flex items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Edit Teacher</span>
            </div>
            <IconArrowBack
              onClick={() => navigate("/teacher-list")}
              className="cursor-pointer hover:text-red-600"
            />
          </h2>
        </div>
        <form
          onSubmit={handleSubmit}
          id="addTeacher"
          className="w-full rounded-lg mx-auto p-4 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            <div>
              <FormLabel required>Teacher Title</FormLabel>
              <input
                type="text"
                name="teacher_title"
                value={teacher.teacher_title}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
                disabled
              />
            </div>
            <div>
              <FormLabel required>Teacher Name</FormLabel>
              <input
                type="text"
                name="teacher_name"
                value={teacher.teacher_name}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
                disabled
              />
            </div>
            <div>
              <FormLabel required>Designation</FormLabel>
              <select
                name="teacher_designation"
                value={teacher.teacher_designation || ""}
                onChange={onInputChange}
                required
                className={inputClassSelect}
              >
                <option value="">Select Designation</option>
                {teacherdesignation.map((option, index) => (
                  <option key={index} value={option.user_position}>
                    {option.user_position}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FormLabel required>Qualification</FormLabel>
              <input
                type="text"
                name="teacher_qualification"
                value={teacher.teacher_qualification}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel required>DOB</FormLabel>
              <input
                type="date"
                name="teacher_dob"
                value={teacher.teacher_dob}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel required>DOJ</FormLabel>
              <input
                type="date"
                name="teacher_doj"
                value={teacher.teacher_doj}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel required>Adhar Number</FormLabel>
              <input
                type="text"
                name="teacher_adhar_no"
                value={teacher.teacher_adhar_no}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel required>Pan Number</FormLabel>
              <input
                type="text"
                name="teacher_pan_no"
                value={teacher.teacher_pan_no}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
                maxLength="10"
                placeholder="Enter PAN Num (e.g., AAAPA1234A)"
              />
            </div>
            <div>
              <FormLabel required>Mobile Number</FormLabel>
              <input
                type="text"
                name="teacher_mobile"
                value={teacher.teacher_mobile}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
                disabled
              />
            </div>
            <div>
              <FormLabel required>Email</FormLabel>
              <input
                type="email"
                name="teacher_email_id"
                value={teacher.teacher_email_id}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
                disabled
              />
            </div>
            <div>
              <FormLabel required>Address</FormLabel>
              <textarea
                type="text"
                name="teacher_address"
                value={teacher.teacher_address}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel required>Bank Name</FormLabel>
              <input
                type="text"
                name="teacher_bank_name"
                value={teacher.teacher_bank_name}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel required>Account Number</FormLabel>
              <input
                type="text"
                name="teacher_acct_no"
                value={teacher.teacher_acct_no}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel required>IFSC CODE</FormLabel>
              <input
                type="text"
                name="teacher_ifsc"
                value={teacher.teacher_ifsc}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel required>Branch</FormLabel>
              <input
                type="text"
                name="teacher_branch"
                value={teacher.teacher_branch}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel required>Pf No</FormLabel>
              <input
                type="text"
                name="teacher_pf_no"
                value={teacher.teacher_pf_no}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel required>UAN No</FormLabel>
              <input
                type="text"
                name="teacher_uan_no"
                value={teacher.teacher_uan_no}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel required>Emergency No</FormLabel>
              <input
                type="text"
                name="teacher_emergency_no"
                value={teacher.teacher_emergency_no}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel required>Status</FormLabel>
              <select
                name="teacher_status"
                value={teacher.teacher_status || ""}
                onChange={(e) => onInputChange(e)}
                required
                className={inputClassSelect}
              >
                <option value="">Select Status</option>

                {status.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              type="submit"
              className="w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
              disabled={isButtonDisabled}
            >
              {isButtonDisabled ? "Updatting..." : "Update"}
            </button>
            <button
              type="button"
              className="w-36 text-white bg-red-600 hover:bg-red-400 p-2 rounded-lg shadow-md"
              onClick={() => navigate("/teacher-list")}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditTeacher;
