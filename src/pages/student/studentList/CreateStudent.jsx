import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  BackButton,
  CreateButton,
  HeaderColor,
} from "../../../components/common/ButttonConfig";
import {
  CREATE_STUDENT_LIST,
  FETCH_CLASS_LIST,
  FETCH_SUBJECT_LIST,
  STUDENT_ADMISSION_NO,
  YearList,
} from "../../../components/common/UseApi";
import Layout from "../../../layout/Layout";
import useApiToken from "../../../components/common/useApiToken";
const Gender = [
  {
    value: "Male",
    label: "Male",
  },
  {
    value: "Female",
    label: "Female",
  },
];
const CreateStudent = () => {
  const navigate = useNavigate();
  const [classList, setClassList] = useState([]);
  const [subject, setSubject] = useState([]);
  const [year, setYear] = useState([]);
  const [admission, setAdmission] = useState([]);

  const useTemplate = {
    teachersub_class: "",
    teachersub_subject: "",
  };

  const [users, setUsers] = useState([{ ...useTemplate }]);

  const [student, setStudent] = useState({
    student_year: "",
    student_no: "",
    student_name: "",
    student_gender: "",
    student_admission_no: "",
    student_admission_date: "",
    student_stats_no: "",
    student_dob: "",
    student_adhar_no: "",
    student_primary_no: "",
    student_email: "",
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
    student_class: "",
    student_photo: null,
    student_adhar_copy: null,
  });
  const token = useApiToken();

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const fetchYearData = async () => {
    try {
      const response = await YearList(token);
      setYear(response.year);
    } catch (error) {
      console.error("Error fetching teacher data", error);
    }
  };
  const fetchAdmissionData = async () => {
    try {
      const data = student.student_year;
      const response = await STUDENT_ADMISSION_NO(data, token);
      setAdmission(response.admissionNo);
    } catch (error) {
      console.error("Error fetching teacher data", error);
    }
  };

  const fetchClassData = async () => {
    try {
      const response = await FETCH_CLASS_LIST(token);
      setClassList(response.classes);
    } catch (error) {
      console.error("Error fetching teacher data", error);
    }
  };
  const fetchSubjectData = async () => {
    try {
      const response = await FETCH_SUBJECT_LIST();
      setSubject(response.subject);
    } catch (error) {
      console.error("Error fetching teacher data", error);
    }
  };

  useEffect(() => {
    fetchClassData();
    fetchSubjectData();
    fetchYearData();

    if (student.student_year) {
      fetchAdmissionData();
    }
  }, [student.student_year]);
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

    formData.append("student_year", student.student_year);
    formData.append("student_no", student.student_no);
    formData.append("student_name", student.student_name);
    formData.append("student_gender", student.student_gender);
    formData.append("student_admission_no", student.student_admission_no);
    formData.append("student_admission_date", student.student_admission_date);
    formData.append("student_stats_no", student.student_stats_no);
    formData.append("student_dob", student.student_dob);
    formData.append("student_adhar_no", student.student_adhar_no);
    formData.append("student_primary_no", student.student_primary_no);
    formData.append("student_email", student.student_email);
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
    formData.append("student_class", student.student_class);

    if (student.student_photo) {
      formData.append("student_photo", student.student_photo);
    }
    if (student.student_adhar_copy) {
      formData.append("student_adhar_copy", student.student_adhar_copy);
    }

    setIsButtonDisabled(true);
    try {
      const response = await CREATE_STUDENT_LIST(formData, token);

      if (response.code === 200) {
        toast.success(response.msg);
        navigate("/student-list");
      } else {
        toast.error(response.msg);
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
        <div className={HeaderColor}>
          <h2 className="px-5 text-black text-lg flex justify-between items-center rounded-xl p-2">
            <div className="flex items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Add Student</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            <div>
              <FormLabel required>Year</FormLabel>
              <select
                name="student_year"
                value={student.student_year || ""}
                onChange={onInputChange}
                required
                className={inputClassSelect}
              >
                <option value="">Select Year</option>
                {year.map((option, index) => (
                  <option key={index} value={option.year_list}>
                    {option.year_list}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FormLabel required>Student No</FormLabel>
              <select
                name="student_no"
                value={student.student_no || ""}
                onChange={onInputChange}
                required
                className={inputClassSelect}
              >
                <option value="">Select Student No</option>
                {admission.map((option, index) => {
                  return (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <FormLabel required>Student Name</FormLabel>
              <input
                type="text"
                name="student_name"
                value={student.student_name}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel required>Gender</FormLabel>
              <select
                name="student_gender"
                value={student.student_gender || ""}
                onChange={onInputChange}
                required
                className={inputClassSelect}
              >
                <option value="">Select Gender</option>
                {Gender.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <FormLabel required>Student Admission No</FormLabel>
              <input
                type="text"
                name="student_admission_no"
                value={student.student_admission_no}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                readOnly
                required
              />
            </div>
            <div>
              <FormLabel required>Admission Date</FormLabel>
              <input
                type="date"
                name="student_admission_date"
                value={student.student_admission_date}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
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
              <FormLabel required>Email</FormLabel>
              <input
                type="email"
                name="student_email"
                value={student.student_email}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
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
              <FormLabel required> Caste Catergory</FormLabel>
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
              <FormLabel required>Class</FormLabel>
              <select
                name="student_class"
                value={student.student_class}
                onChange={(e) => onInputChange(e)}
                required
                className={inputClassSelect}
              >
                <option value="">Select Class</option>
                {classList.map((option, index) => (
                  <option key={index} value={option.classes}>
                    {option.classes}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FormLabel required>Student Photo</FormLabel>
              <input
                type="file"
                name="student_photo"
                // value={student.student_photo}
                onChange={onFileChange}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel required>Student Adhar</FormLabel>
              <input
                type="file"
                name="student_adhar_copy"
                // value={student.student_adhar_copy}
                onChange={onFileChange}
                className={inputClass}
                required
              />
            </div>
            <div className="col-span-3">
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

export default CreateStudent;
