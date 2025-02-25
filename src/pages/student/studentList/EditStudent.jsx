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
const EditStudent = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [student, setStudent] = useState({
    student_stats_no: "",
    student_dob: "",
    student_adhar_no: "",
    student_primary_no: "",
    student_father_name: "",
    student_father_mobile: "",
    student_father_pan_no: "",
    student_father_adhar_no: "",
    student_mother_name: "",
    student_mother_mobile: "",
    student_mother_pan_no: "",
    student_mother_adhar_no: "",
    student_category: "",
    student_caste: "",
    student_cc_no: "",
    student_address: "",
    student_status: "",
    student_photo: null,
    student_adhar_copy: null,
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const fetchTeacherDataByid = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-student-by-id/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data && response.data.student) {
        setStudent({
          student_stats_no: response.data.student.student_stats_no || "",
          student_dob: response.data.student.student_dob || "",
          student_adhar_no: response.data.student.student_adhar_no || "",
          student_primary_no: response.data.student.student_primary_no || "",
          student_father_name: response.data.student.student_father_name || "",
          student_father_mobile:
            response.data.student.student_father_mobile || "",
          student_father_pan_no:
            response.data.student.student_father_pan_no || "",
          student_father_adhar_no:
            response.data.student.student_father_adhar_no || "",
          student_mother_name: response.data.student.student_mother_name || "",
          student_mother_mobile:
            response.data.student.student_mother_mobile || "",
          student_mother_pan_no:
            response.data.student.student_mother_pan_no || "",
          student_mother_adhar_no:
            response.data.student.student_mother_adhar_no || "",
          student_category: response.data.student.student_category || "",
          student_caste: response.data.student.student_caste || "",
          student_cc_no: response.data.student.student_cc_no || "",
          student_address: response.data.student.student_address || "",
          student_status: response.data.student.student_status || "",
          student_photo: response.data.student.student_photo || null, // Ensuring it's null if not provided
          student_adhar_copy: response.data.student.student_adhar_copy || null, // Ensuring it's null if not provided
        });
      }
    } catch (error) {
      console.error("Error fetching teacher data", error);
    }
  };

  useEffect(() => {
    fetchTeacherDataByid();
  }, [id]);
  const onInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value.trim();
    if (type === "checkbox") {
      if (name === "student_primary_no") {
        newValue = checked ? value : "";
      } else {
        newValue = checked ? "Yes" : "No";
      }
    }

    console.log(value);
    if (
      [
        "student_adhar_no",
        "student_father_adhar_no",
        "student_mother_adhar_no",
      ].includes(name)
    ) {
      newValue = newValue.replace(/\D/g, "");
      if (newValue.length > 12) return;
    }

    if (["student_father_pan_no", "student_mother_pan_no"].includes(name)) {
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

    if (["student_father_mobile", "student_mother_mobile"].includes(name)) {
      newValue = newValue.replace(/\D/g, "");
      if (newValue.length > 10) return;
    }

    console.log(name, newValue);
    setStudent((prevState) => {
      const updatedState = {
        ...prevState,
        [name]: newValue,
      };

      if (name === "student_year" || name === "student_no") {
        updatedState.student_admission_no = `${
          updatedState.student_year || ""
        }-${updatedState.student_no || ""}`;
      }

      return updatedState;
    });
  };
  const onFileChange = (e) => {
    const { name, files } = e.target;
    console.log(name);
    setStudent((prevState) => ({
      ...prevState,
      [name]: files[0] || null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = document.getElementById("addTeacher");
    if (!form.checkValidity()) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();

    formData.append("student_stats_no", student.student_stats_no);
    formData.append("student_dob", student.student_dob);
    formData.append("student_adhar_no", student.student_adhar_no);
    formData.append("student_primary_no", student.student_primary_no);
    formData.append("student_father_name", student.student_father_name);
    formData.append("student_father_mobile", student.student_father_mobile);
    formData.append("student_father_pan_no", student.student_father_pan_no);
    formData.append("student_father_adhar_no", student.student_father_adhar_no);
    formData.append("student_mother_name", student.student_mother_name);
    formData.append("student_mother_mobile", student.student_mother_mobile);
    formData.append("student_mother_pan_no", student.student_mother_pan_no);
    formData.append("student_mother_adhar_no", student.student_mother_adhar_no);
    formData.append("student_category", student.student_category);
    formData.append("student_caste", student.student_caste);
    formData.append("student_cc_no", student.student_cc_no);
    formData.append("student_address", student.student_address);
    formData.append("student_status", student.student_status);

    if (student.student_photo) {
      formData.append("student_photo", student.student_photo);
    }
    if (student.student_adhar_copy) {
      formData.append("student_adhar_copy", student.student_adhar_copy);
    }

    setIsButtonDisabled(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/panel-update-student/${id}?_method=PUT`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.code === 200) {
        toast.success(response.data.msg);
        navigate("/student-list");
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
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-500";
  return (
    <Layout>
      <div className="bg-white p-2 rounded-lg">
        <div className="sticky top-0 p-2 mb-4 border-b-2 border-red-500 bg-[#E1F5FA] rounded-lg">
          <h2 className="px-5 text-black text-lg flex justify-between items-center rounded-xl p-2">
            <div className="flex items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Edit Student</span>
            </div>
            <IconArrowBack
              onClick={() => navigate("/student-list")}
              className="cursor-pointer hover:text-red-600"
            />
          </h2>
        </div>
        <form
          onSubmit={handleSubmit}
          id="addTeacher"
          className="w-full rounded-lg mx-auto p-4 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <div>
              <FormLabel required>SATS No</FormLabel>
              <input
                type="text"
                name="student_stats_no"
                value={student.student_stats_no}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <FormLabel required>DOB</FormLabel>
              <input
                type="date"
                name="student_dob"
                value={student.student_dob}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel required>Aadhar Number</FormLabel>
              <input
                type="text"
                name="student_adhar_no"
                value={student.student_adhar_no}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <FormLabel required>Student Primary</FormLabel>

              <div className="flex space-x-4">
                <div>
                  <input
                    type="checkbox"
                    name="student_primary_no"
                    value="Yes"
                    checked={student.student_primary_no === "Yes"}
                    onChange={(e) => onInputChange(e, "Yes")}
                    required={student.student_primary_no === ""}
                  />
                </div>

                <div>
                  <input
                    type="checkbox"
                    name="student_primary_no"
                    value="No"
                    checked={student.student_primary_no === "No"}
                    onChange={(e) => onInputChange(e, "No")}
                    required={student.student_primary_no === ""}
                  />
                </div>
              </div>

              <span className="text-sm text-red-500">
                {student.student_primary_no === "Yes"
                  ? "Father is the Primary Number"
                  : student.student_primary_no === "No"
                  ? "Mother is the Primary Number"
                  : ""}
              </span>
            </div>
            <div>
              <FormLabel required>Father Name</FormLabel>
              <input
                type="text"
                name="student_father_name"
                value={student.student_father_name}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel required>Father Mobile</FormLabel>
              <input
                type="text"
                name="student_father_mobile"
                value={student.student_father_mobile}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <FormLabel required>Father PAN</FormLabel>
              <input
                type="text"
                name="student_father_pan_no"
                value={student.student_father_pan_no}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
                placeholder="Enter PAN Num (e.g., AAAPA1234A)"
              />
            </div>
            <div>
              <FormLabel required>Father Aadhar No</FormLabel>
              <input
                type="text"
                name="student_father_adhar_no"
                value={student.student_father_adhar_no}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel required>Mother Name</FormLabel>
              <input
                type="text"
                name="student_mother_name"
                value={student.student_mother_name}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <FormLabel required>Mother Mobile</FormLabel>
              <input
                type="text"
                name="student_mother_mobile"
                value={student.student_mother_mobile}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel required>Mother PAN</FormLabel>
              <input
                type="text"
                name="student_mother_pan_no"
                value={student.student_mother_pan_no}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
                placeholder="Enter PAN Num (e.g., AAAPA1234A)"
              />
            </div>
            <div>
              <FormLabel required>Mother Aadhar No</FormLabel>
              <input
                type="text"
                name="student_mother_adhar_no"
                value={student.student_mother_adhar_no}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel required>Catergory</FormLabel>
              <input
                type="text"
                name="student_category"
                value={student.student_category}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel required>Caste</FormLabel>
              <input
                type="text"
                name="student_caste"
                value={student.student_caste}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel required>CC No</FormLabel>
              <input
                type="text"
                name="student_cc_no"
                value={student.student_cc_no}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <FormLabel required>Status</FormLabel>
              <select
                name="student_status"
                value={student.student_status || ""}
                onChange={(e) => onInputChange(e)}
                required
                className={inputClassSelect}
              >
                <option value="">Select Status</option>
                {status.map((option, idx) => (
                  <option key={idx} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FormLabel>Student Photo</FormLabel>
              <input
                type="file"
                name="student_photo"
                // value={student.student_photo}
                onChange={onFileChange}
                className={inputClass}
              />
              {typeof student.student_photo === "string" && (
                <span className="text-sm text-red-500">
                  {student.student_photo}
                </span>
              )}
            </div>
            <div>
              <FormLabel>Student Adhar</FormLabel>
              <input
                type="file"
                name="student_adhar_copy"
                // value={student.student_adhar_copy}
                onChange={onFileChange}
                className={inputClass}
              />
              {typeof student.student_adhar_copy === "string" && (
                <span className="text-sm text-red-500">
                  {student.student_adhar_copy}
                </span>
              )}
            </div>

            <div className="col-span-2">
              <FormLabel required>Address</FormLabel>
              <textarea
                type="text"
                name="student_address"
                value={student.student_address}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className="flex gap-4 justify-start">
            <button
              type="submit"
              className="w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
              disabled={isButtonDisabled}
            >
              {isButtonDisabled ? "updatting..." : "Update"}
            </button>
            <button
              type="button"
              className="w-36 text-white bg-red-600 hover:bg-red-400 p-2 rounded-lg shadow-md"
              onClick={() => navigate("/student-list")}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditStudent;
