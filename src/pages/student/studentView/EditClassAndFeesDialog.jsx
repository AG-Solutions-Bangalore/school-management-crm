import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BackButton,
  CreateButton,
} from "../../../components/common/ButttonConfig";
import {
  FETCH_STUDENT_CLASS_FEES_BY_ID,
  PAYMENT_TYPE,
  STUDENT_CLASS_AND_FEES_BY_ID,
  STUDENTATTENDANCE_BY_ID,
  UPDATE_STUDENT_ATTENDANCE_BY_ID,
  UPDATE_STUDENT_CLASS_FEES,
  UPDATESTUDENT_FEES,
} from "../../../components/common/UseApi";
import useApiToken from "../../../components/common/useApiToken";

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
  const token = useApiToken();
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

      const response = await STUDENT_CLASS_AND_FEES_BY_ID(classId, token);
      if (response) {
        setFormData({
          studentClass_van: response?.studentClass.studentClass_van || "",
          studentClass_van_amount:
            response?.studentClass.studentClass_van_amount || 0,
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

      const updatedFormData = {
        ...formData,
        studentClass_van_amount:
          formData.studentClass_van === "No"
            ? 0
            : formData.studentClass_van_amount,
      };

      const response = await UPDATESTUDENT_FEES(
        classId,
        updatedFormData,
        token
      );

      if (response.code === 200) {
        toast.success(response.msg || "Class updated successfully");
        handleOpen();
      } else {
        toast.error(response.msg || "Failed to update class");
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
            type="button"
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
  const token = useApiToken();
  const fetchFeesData = async () => {
    try {
      setLoading(true);
      const response = await FETCH_STUDENT_CLASS_FEES_BY_ID(feesId, token);
      if (response) {
        setFormData({
          studentFees_paid: response?.studentClassFees.studentFees_paid || "",
          studentFees_pay_mode:
            response?.studentClassFees.studentFees_pay_mode || "",
          studentFees_transactiondetails:
            response?.studentClassFees.studentFees_transactiondetails || "",
          studentFees_paid_date:
            response?.studentClassFees.studentFees_paid_date || "",
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
      Promise.all([fetchFeesData(token), fetchPaymentTypes(token)]).catch(
        (error) => {
          console.error("Error initializing edit fees dialog", error);
        }
      );
    }
  }, [open, feesId]);
  const fetchPaymentTypes = async () => {
    try {
      const response = await PAYMENT_TYPE(token);
      setPaymentTypes(response?.paymentType || []);
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
      const formattedData = {
        ...formData,
        studentFees_paid: parseInt(formData.studentFees_paid, 10) || 0,
      };

      const response = await UPDATE_STUDENT_CLASS_FEES(
        feesId,
        formattedData,
        token
      );
      if (response.code === 200) {
        toast.success(response.msg || "Fees updated successfully");
        handleOpen();
      } else {
        toast.error(response.msg || "Failed to update fees");
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
            type="button"
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
  const token = useApiToken();
  const fetchAttendenceData = async () => {
    try {
      setLoading(true);

      const response = await STUDENTATTENDANCE_BY_ID(attendenceId, token);
      if (response) {
        setFormData({
          studentAttendance_class:
            response?.studentClassAttendance.studentAttendance_class || "",
          studentAttendance_date:
            response?.studentClassAttendance.studentAttendance_date || "",
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

      const response = await UPDATE_STUDENT_ATTENDANCE_BY_ID(
        attendenceId,
        formData,
        token
      );

      if (response.data.code === 200) {
        toast.success(response.msg || "Attendece updated successfully");
        handleOpen();
      } else {
        toast.error(response.msg || "Failed to update Attendece");
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
            type="button"
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
