import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import axios from "axios";
import { toast } from "sonner";
import BASE_URL from "../../../base/BaseUrl";
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

export const EditClassDialog = ({ open, handleOpen, classId }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentClass_van_amount: "",
    studentClass_van: "",
  });

  useEffect(() => {
    if (open && classId) {
      fetchClassData();
    }
  }, [open, classId]);

  const fetchClassData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-student-class-by-id/${classId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        setFormData({
          studentClass_van: response?.data.studentClass.studentClass_van || "",
          studentClass_van_amount:
            response?.data.studentClass.studentClass_van_amount || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching class data", error);
      toast.error("Failed to fetch class data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const updatedFormData = {
        ...formData,
        studentClass_van_amount:
          formData.studentClass_van === "No"
            ? 0
            : formData.studentClass_van_amount,
      };

      const response = await axios.put(
        `${BASE_URL}/api/panel-update-student-class/${classId}`,
        updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 200) {
        toast.success(response.data.msg || "Class updated successfully");
        handleOpen();
      } else {
        toast.error(response.data.msg || "Failed to update class");
      }
    } catch (error) {
      console.error("Error updating class", error);
      toast.error("Failed to update class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !loading && handleOpen()}
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Van Details</DialogTitle>
        <DialogContent dividers>
          <div className="space-y-4 p-2">
            <div>
              <FormLabel required>Van</FormLabel>
              <select
                name="studentClass_van"
                value={formData.studentClass_van}
                onChange={handleInputChange}
                required
                className={inputClassSelect}
                disabled={loading}
              >
                <option value="">Select Van Option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            {formData.studentClass_van == "Yes" && (
              <div>
                <FormLabel required>Van Amount</FormLabel>
                <input
                  type="number"
                  name="studentClass_van_amount"
                  className={inputClass}
                  value={formData.studentClass_van_amount}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  min="0"
                />
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleOpen}
            className={BackButton}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            className={CreateButton}
          >
            {loading ? "Updating..." : "Update Van"}
          </button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export const EditFeesDialog = ({ open, handleOpen, feesId }) => {
  const [loading, setLoading] = useState(false);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [formData, setFormData] = useState({
    studentFees_paid: "",
    studentFees_pay_mode: "",
    studentFees_transactiondetails: "",
    studentFees_paid_date: "",
  });

  const fetchFeesData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-student-class-fees-by-id/${feesId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        setFormData({
          studentFees_paid:
            response?.data.studentClassFees.studentFees_paid || "",
          studentFees_pay_mode:
            response?.data.studentClassFees.studentFees_pay_mode || "",
          studentFees_transactiondetails:
            response?.data.studentClassFees.studentFees_transactiondetails ||
            "",
          studentFees_paid_date:
            response?.data.studentClassFees.studentFees_paid_date || "",
        });
      }
    } catch (error) {
      console.error("Error fetching fees data", error);
      toast.error("Failed to fetch fees data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (open && feesId) {
      Promise.all([fetchFeesData(), fetchPaymentTypes()]).catch((error) => {
        console.error("Error initializing edit fees dialog", error);
      });
    }
  }, [open, feesId]);
  const fetchPaymentTypes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-paymentType`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPaymentTypes(response.data?.paymentType || []);
    } catch (error) {
      console.error("Error fetching payment types", error);
      toast.error("Failed to fetch payment types");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

      const response = await axios.put(
        `${BASE_URL}/api/panel-update-student-class-fees/${feesId}`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 200) {
        toast.success(response.data.msg || "Fees updated successfully");
        handleOpen();
      } else {
        toast.error(response.data.msg || "Failed to update fees");
      }
    } catch (error) {
      console.error("Error updating fees", error);
      toast.error("Failed to update fees");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !loading && handleOpen()}
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Fees Receipt</DialogTitle>
        <DialogContent dividers>
          <div className="space-y-4 p-2">
            <div>
              <FormLabel required>Date</FormLabel>
              <input
                type="date"
                name="studentFees_paid_date"
                className={inputClass}
                value={formData.studentFees_paid_date}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>
            <div className=" grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div>
                <FormLabel required>Paid Amount</FormLabel>
                <input
                  type="number"
                  name="studentFees_paid"
                  className={inputClass}
                  value={formData.studentFees_paid}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  min="0"
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
                  disabled={loading}
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
              <FormLabel required>Transaction Details</FormLabel>
              <input
                type="text"
                name="studentFees_transactiondetails"
                className={inputClass}
                value={formData.studentFees_transactiondetails}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleOpen}
            className={BackButton}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            className={CreateButton}
          >
            {loading ? "Updating..." : "Update Fees"}
          </button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

/*--------Attendence ------------------------------ */
export const EditAttendenceDialog = ({ open, handleOpen, attendenceId }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentAttendance_class: "",

    studentAttendance_date: "",
  });

  const fetchAttendenceData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-student-attendance-by-id/${attendenceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        setFormData({
          studentAttendance_class:
            response?.data.studentClassAttendance.studentAttendance_class || "",
          studentAttendance_date:
            response?.data.studentClassAttendance.studentAttendance_date || "",
        });
      }
    } catch (error) {
      console.error("Error fetching fees data", error);
      toast.error("Failed to fetch fees data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (open && attendenceId) {
      Promise.all([fetchAttendenceData()]).catch((error) => {
        console.error("Error initializing edit fees dialog", error);
      });
    }
  }, [open, attendenceId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${BASE_URL}/api/panel-update-student-attendance/${attendenceId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 200) {
        toast.success(response.data.msg || "Attendece updated successfully");
        handleOpen();
      } else {
        toast.error(response.data.msg || "Failed to update Attendece");
      }
    } catch (error) {
      console.error("Error updating Attendence", error);
      toast.error("Failed to update Attendence");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !loading && handleOpen()}
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle className="flex flex-row items-center justify-between">
          <span>Edit Attendence Info </span>
          <p>
            Class:{" "}
            <span className="bg-blue-200 text-black px-3 py-1 rounded-md text-sm font-semibold">
              {formData.studentAttendance_class}
            </span>
          </p>
        </DialogTitle>
        <DialogContent dividers>
          <div className="space-y-4 p-2">
            <div>
              <FormLabel required>Date</FormLabel>
              <input
                type="date"
                name="studentAttendance_date"
                className={inputClass}
                value={formData.studentAttendance_date}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleOpen}
            className={BackButton}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            className={`${CreateButton} w-40`}
          >
            {loading ? "Updating..." : "Update Attendence"}
          </button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
