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
import { ContextPanel } from "../../../context/ContextPanel";
import BASE_URL from "../../../base/BaseUrl";
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
  "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-blue-500";

// Add Fees Dialog Component
export const PendingFeesDialog = ({
  open,
  handleClose,
  studentData,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingSumbit, setLoadingSumbit] = useState(false);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const { selectedYear } = useContext(ContextPanel);
  const [formData, setFormData] = useState({
    studentFees_year: selectedYear || "",
    studentFees_admission_no: studentData?.student_admission_no || "",
    studentFees_class: studentData?.studentClass_class || "",
    studentFees_paid: studentData
      ? (studentData.total_amount - studentData.paid_amount).toString()
      : "",
    studentFees_pay_mode: "",
    studentFees_transactiondetails: "",
    studentFees_paid_date: getTodayDate(),
  });

  // Update form data when studentData changes
  useEffect(() => {
    if (studentData) {
      setFormData({
        ...formData,
        studentFees_year: selectedYear || "",
        studentFees_admission_no: studentData.student_admission_no || "",
        studentFees_class: studentData.studentClass_class || "",
        studentFees_paid:
          (studentData.total_amount - studentData.paid_amount).toString() || "",
      });
    }
  }, [studentData, selectedYear]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const paymentTypeResponse = await axios.get(
        `${BASE_URL}/api/panel-fetch-paymentType`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPaymentTypes(paymentTypeResponse.data?.paymentType || []);
    } catch (error) {
      console.error("Error fetching payment types", error);
      toast.error("Failed to fetch payment types");
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
        onSuccess(); // Refresh the data
        handleClose();
        setFormData({
          studentFees_year: selectedYear || "",
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
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{ backdropFilter: "blur(4px)" }}
      TransitionComponent={Slide}
      transitionDuration={500}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle className="flex flex-row items-center justify-between">
          <p className="text-start flex flex-row items-center gap-2">
            <span>Adm. No.</span>
            <span>{formData.studentFees_admission_no}</span>
          </p>
          <div className="flex flex-row items-center gap-2">
            <p>{formData.studentFees_year}</p>
            <p className="bg-blue-200 text-black px-3 py-1 rounded-md text-sm font-semibold">
              {formData.studentFees_class}
            </p>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <div className="flex flex-row items-center gap-2 justify-between mb-2">
            <div className="text-center text-xl"> Pending Fee Receipt</div>
            <div>
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
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
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
          <button onClick={handleClose} className={BackButton}>
            Cancel
          </button>
          <button
            type="submit"
            className={`${CreateButton} w-40`}
            disabled={loadingSumbit}
          >
            {loadingSumbit ? "Adding..." : "Add Pending Fees"}
          </button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
