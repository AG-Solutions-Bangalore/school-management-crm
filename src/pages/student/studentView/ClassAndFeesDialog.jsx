import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import axios from "axios";
import { toast } from "sonner";
import BASE_URL from "../../../base/BaseUrl";

const FormLabel = ({ children, required }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

const inputClassSelect =
"w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-500";
const inputClass =
"w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-blue-500";

// Add Class Dialog Form
export const AddClassDialog = ({ open, handleOpen,studentData }) => {
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    studentClass_admission_no: "",
    studentClass_class: "",
    studentClass_van: "No"
  });
useEffect(() => {
    if (studentData?.student?.student_admission_no) {
      setFormData(prev => ({
        ...prev,
        studentClass_admission_no: studentData.student.student_admission_no
      }));
    }
  }, [studentData]);
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-classes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClasses(response.data?.classes || []);
    } catch (error) {
      console.error("Error fetching classes data", error);
      toast.error("Failed to fetch classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchClasses();
    }
  }, [open]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/panel-create-student-class`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 200) {
        toast.success(response.data.msg);
        handleOpen();
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      console.error("Error creating student class", error);
      toast.error("Failed to create student class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleOpen} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add Class</DialogTitle>
        <DialogContent dividers>
          <div className="space-y-4 p-2">
            <div>
              <FormLabel required>Admission No</FormLabel>
              <input
                type="text"
                name="studentClass_admission_no"
                className={`${inputClass} cursor-not-allowed`}
                value={formData.studentClass_admission_no}
                onChange={handleInputChange}
                required
                readOnly
              />
            </div>

            <div>
              <FormLabel required>Class</FormLabel>
              <select
                name="studentClass_class"
                value={formData.studentClass_class}
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
              <FormLabel required>Van</FormLabel>
              <select
                name="studentClass_van"
                value={formData.studentClass_van}
                onChange={handleInputChange}
                required
                className={inputClassSelect}
              >
                <option value="">Select Van Option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOpen} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? "Adding..." : "Add Class"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Add Fees Dialog Form
export const AddFeesDialog = ({ open, handleOpen,studentData }) => {
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [formData, setFormData] = useState({
    studentFees_year: "",
    studentFees_admission_no: "",
    studentFees_class: "",
    studentFees_paid: "",
    studentFees_pay_mode: "",
    studentFees_transactiondetails: ""
  });
 useEffect(() => {
    if (studentData?.student?.student_admission_no) {
      setFormData(prev => ({
        ...prev,
        studentFees_admission_no: studentData.student.student_admission_no
      }));
    }
  }, [studentData]);
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const [yearResponse, classesResponse, paymentTypeResponse] = await Promise.all([
        axios.get(`${BASE_URL}/api/panel-fetch-year-list`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/api/panel-fetch-classes`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/api/panel-fetch-paymentType`, {
          headers: { Authorization: `Bearer ${token}` },
        })
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

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formattedData = {
        ...formData,
        studentFees_paid: parseInt(formData.studentFees_paid, 10) || 0, 
      };
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
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      console.error("Error creating student fees", error);
      toast.error("Failed to create student fees");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleOpen} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add Fees</DialogTitle>
        <DialogContent dividers>
          <div className="space-y-4 p-2">
            <div>
              <FormLabel required>Year</FormLabel>
              <select
                name="studentFees_year"
                value={formData.studentFees_year}
                onChange={handleInputChange}
                required
                className={inputClassSelect}
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year.year_list} value={year.year_list}>
                    {year.year_list}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <FormLabel required>Admission No</FormLabel>
              <input
                type="text"
                name="studentFees_admission_no"
                className={inputClass}
                value={formData.studentFees_admission_no}
                onChange={handleInputChange}
                required
              />
            </div>

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

            <div>
              <FormLabel required>Transaction Details</FormLabel>
              <input
                type="text"
                name="studentFees_transactiondetails"
                className={inputClass}
                value={formData.studentFees_transactiondetails}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOpen} color="inherit">
            Cancel
          </Button>
          <Button type="submit"variant="contained" color="primary" disabled={loading}>
            {loading ? "Adding..." : "Add Fees"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};