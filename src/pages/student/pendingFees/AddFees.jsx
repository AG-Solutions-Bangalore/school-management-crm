import React, { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slide,
} from "@mui/material";
import axios from "axios";
import { toast } from "sonner";
import BASE_URL from "../../../base/BaseUrl";
import { ContextPanel } from "../../../context/ContextPanel";
import Select from "react-select";
import { getTodayDate } from "../../../utils/currentDate";
import {
  BackButton,
  CreateButton,
} from "../../../components/common/ButttonConfig";

const FormLabel = ({ children, required }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

const inputClassSelect =
  "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-500";
const inputClass =
  "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-500";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    width: "100%",
    fontSize: "0.75rem",
    padding: "0rem",
    border: "1px solid #3b82f6",
    borderRadius: "0.5rem",
    boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
    "&:hover": {
      borderColor: "#3b82f6",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: "0.75rem",
    padding: "0.15rem 0.5rem",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.5rem",
    border: "1px solid #3b82f6", // border-blue-500
  }),
};
export const AddFees = ({ open, handleOpen }) => {
  const [loading, setLoading] = useState(false);
  const [loadingSumbit, setLoadingSumbit] = useState(false);
  const [years, setYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [students, setStudents] = useState([]);
  const [pendingFeesData, setPendingFeesData] = useState(null);
  const { selectedYear } = useContext(ContextPanel);
  const [formData, setFormData] = useState({
    studentFees_year: selectedYear,
    studentFees_admission_no: "",
    studentFees_class: "",
    studentFees_paid: "",
    studentFees_pay_mode: "",
    studentFees_transactiondetails: "",
    studentFees_paid_date: getTodayDate(),
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const [yearResponse, classesResponse, paymentTypeResponse] =
        await Promise.all([
          axios.get(`${BASE_URL}/api/panel-fetch-year-list`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/api/panel-fetch-classes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/api/panel-fetch-paymentType`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      setYears(yearResponse.data?.year || []);
      setClasses(classesResponse.data?.classes || []);
      setPaymentTypes(paymentTypeResponse.data?.paymentType || []);
    } catch (error) {
      console.error("Error fetching data", error);
      toast.error("Failed to fetch required data");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (selectedClass) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-student/${selectedYear}/${selectedClass}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStudents(response.data?.student || []);
    } catch (error) {
      console.error("Error fetching students", error);
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingFees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Only fetch if we have all required data
      if (
        !formData.studentFees_year ||
        !formData.studentFees_class ||
        !formData.studentFees_admission_no
      ) {
        setPendingFeesData(null);
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/api/panel-fetch-student-pending-class-fees-for-create`,
        {
          studentFees_year: formData.studentFees_year,
          studentFees_class: formData.studentFees_class,
          studentFees_admission_no: formData.studentFees_admission_no,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (
        response.data &&
        response.data.student &&
        response.data.student.length > 0
      ) {
        setPendingFeesData(response.data.student[0]);
      } else {
        setPendingFeesData(null);
      }
    } catch (error) {
      console.error("Error fetching pending fees", error);
      toast.error("Failed to fetch pending fees data");
      setPendingFeesData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  useEffect(() => {
    if (formData.studentFees_class) {
      fetchStudents(formData.studentFees_class);
    }
  }, [formData.studentFees_class]);

  useEffect(() => {
    if (formData.studentFees_admission_no && formData.studentFees_class) {
      fetchPendingFees();
    }
  }, [formData.studentFees_admission_no]);
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoadingSumbit(true);
      const token = localStorage.getItem("token");
      const formattedData = {
        ...formData,
        studentFees_paid: parseInt(formData.studentFees_paid, 10) || 0,
      };
      console.log("data", formattedData);
      const response = await axios.post(
        `${BASE_URL}/api/panel-create-student-class-fees`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 200) {
        toast.success(response.data.msg);

        handleOpen();
        setFormData({
          studentFees_year: selectedYear,
          studentFees_admission_no: "",
          studentFees_class: "",
          studentFees_paid: "",
          studentFees_pay_mode: "",
          studentFees_transactiondetails: "",
          studentFees_paid_date: getTodayDate(),
        });
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      console.error("Error creating student fees", error);
      toast.error("Failed to create student fees");
    } finally {
      setLoadingSumbit(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleOpen}
      maxWidth="sm"
      fullWidth
      sx={{ backdropFilter: "blur(4px)" }}
      TransitionComponent={Slide}
      transitionDuration={500}
    >
      <form onSubmit={handleSubmit} className="p-1">
        <DialogTitle className="flex flex-col md:flex-row items-center justify-between">
          <div className="  flex flex-row items-center justify-between gap-2">
            <div>
              <FormLabel required>Class</FormLabel>
              <select
                name="studentFees_class"
                value={formData.studentFees_class}
                onChange={handleInputChange}
                required
                className={inputClassSelect}
              >
                <option value="">Select Class</option>
                {classes.map((option) => (
                  <option key={option.classes} value={option.classes}>
                    {option.classes}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <FormLabel required>Student</FormLabel>
              {/* <select
                name="studentFees_admission_no"
                value={formData.studentFees_admission_no}
                onChange={handleInputChange}
                required
                className={inputClassSelect}
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.student_admission_no} value={student.student_admission_no}>
                    {student.student_name} ({student.student_admission_no})
                  </option>
                ))}
              </select> */}
              <Select
                name="studentFees_admission_no"
                value={
                  students.find(
                    (student) =>
                      student.student_admission_no ===
                      formData.studentFees_admission_no
                  )
                    ? {
                        value: formData.studentFees_admission_no,
                        label: `${
                          students.find(
                            (student) =>
                              student.student_admission_no ===
                              formData.studentFees_admission_no
                          ).student_name
                        } (${formData.studentFees_admission_no})`,
                      }
                    : null
                }
                onChange={(selectedOption) => {
                  setFormData({
                    ...formData,
                    studentFees_admission_no: selectedOption
                      ? selectedOption.value
                      : "",
                  });
                }}
                options={students.map((student) => ({
                  value: student.student_admission_no,
                  label: `${student.student_name} (${student.student_admission_no})`,
                }))}
                placeholder="Select Student"
                styles={customStyles}
                isSearchable={true}
                required
              />
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-right">{selectedYear}</p>
            <div>
              <input
                type="date"
                name="studentFees_paid_date"
                className={inputClass}
                value={formData.studentFees_paid_date}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <div className="flex items-center justify-between mb-3 border-b pb-2">
            <div className="text-base font-medium  text-black">Fee Receipt</div>
            <div className="flex flex-row items-center gap-3 text-xs">
              {loading ? (
                <span className="text-gray-500">Loading...</span>
              ) : pendingFeesData ? (
                <>
                  <span>
                    Total: <b>₹{pendingFeesData.total_amount}</b>
                  </span>
                  <span className="text-green-600">
                    Paid: <b>₹{pendingFeesData.paid_amount}</b>
                  </span>
                  <span className="text-red-600">
                    Balance:{" "}
                    <b>
                      ₹
                      {pendingFeesData.total_amount -
                        pendingFeesData.paid_amount}
                    </b>
                  </span>
                  {pendingFeesData.van_required === "Yes" && (
                    <span>
                      Van: <b>₹{pendingFeesData.van_amount}</b>
                    </span>
                  )}
                </>
              ) : (
                formData.studentFees_admission_no && (
                  <span className="text-gray-500">No data</span>
                )
              )}
            </div>
          </div>

          <div className="space-y-4 ">
            <div className=" grid  grid-cols-1 lg:grid-cols-2 gap-2">
              <div>
                <FormLabel required>Paid Amount</FormLabel>
                <input
                  type="number"
                  name="studentFees_paid"
                  className={inputClass}
                  value={formData.studentFees_paid}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <FormLabel required>Payment Mode</FormLabel>
                <select
                  name="studentFees_pay_mode"
                  value={formData.studentFees_pay_mode}
                  onChange={handleInputChange}
                  required
                  className={inputClassSelect}
                >
                  <option value="">Select Payment Mode</option>
                  {paymentTypes.map((type) => (
                    <option key={type.paymentType} value={type.paymentType}>
                      {type.paymentType}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <FormLabel>Transaction Details</FormLabel>
              <input
                type="text"
                name="studentFees_transactiondetails"
                className={inputClass}
                value={formData.studentFees_transactiondetails}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button onClick={handleOpen} className={BackButton}>
            Cancel
          </button>

          <button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loadingSumbit}
            className={CreateButton}
          >
            {loadingSumbit ? "Adding..." : "Add Fees"}
          </button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
