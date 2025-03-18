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
  CREATE_CLASS_FEES,
  CREATE_STUDENT_PENDING_CLASS_FEES,
  FETCH_CLASS_LIST,
  PAYMENT_TYPE,
  YearList,
} from "../../../components/common/UseApi";
import useApiToken from "../../../components/common/useApiToken";
import { getTodayDate } from "../../../utils/currentDate";

const FormLabel = ({ children, required }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

const inputClassSelect =
  "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-500";
const inputClass =
  "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-500";

// Add Class Dialog Form
export const AddClassDialog = ({ open, handleOpen, studentData }) => {
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    studentClass_admission_no: "",
    studentClass_class: "",
    studentClass_van: "No",
  });
  const token = useApiToken();
  useEffect(() => {
    if (studentData?.student?.student_admission_no) {
      setFormData((prev) => ({
        ...prev,
        studentClass_admission_no: studentData.student.student_admission_no,
      }));
    }
  }, [studentData]);
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await FETCH_CLASS_LIST();
      setClasses(response?.classes || []);
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
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await CREATE_CLASS_FEES(formData, token);

      if (response.code === 200) {
        toast.success(response.msg);
        handleOpen();
        // setFormData({
        //   studentClass_admission_no: "",
        //   studentClass_class: "",
        //   studentClass_van: "No",
        // });
      } else {
        toast.error(response.msg);
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
        <DialogTitle>
          Add Class -{" "}
          <strong className=" text-blue-700">
            {formData.studentClass_admission_no}
          </strong>{" "}
        </DialogTitle>
        <DialogContent dividers>
          <div className="space-y-4 p-2">
            {/* <div>
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
            </div> */}

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
          <button onClick={handleOpen} className={BackButton}>
            Cancel
          </button>

          <button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            className={CreateButton}
          >
            {loading ? "Adding..." : "Add Class"}
          </button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Add Fees Dialog Form
export const AddFeesDialog = ({ open, handleOpen, studentData }) => {
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const token = useApiToken();
  const [formData, setFormData] = useState({
    studentFees_year: "",
    studentFees_admission_no: "",
    studentFees_class: "",
    studentFees_paid: "",
    studentFees_pay_mode: "",
    studentFees_transactiondetails: "",
    studentFees_paid_date: getTodayDate(),
  });
  const lastClass = studentData?.studentClass?.length
    ? studentData.studentClass[studentData.studentClass.length - 1]
        .studentClass_class
    : null;

  const lastYear = studentData?.studentClass?.length
    ? studentData.studentClass[studentData.studentClass.length - 1]
        .studentClass_year
    : null;

  useEffect(() => {
    if (studentData?.student?.student_admission_no) {
      setFormData((prev) => ({
        ...prev,
        studentFees_admission_no: studentData.student.student_admission_no,
        studentFees_year: lastYear,
        studentFees_class: lastClass,
      }));
    }
  }, [studentData]);
  const fetchData = async () => {
    try {
      setLoading(true);
      const [yearResponse, paymentTypeResponse] = await Promise.all([
        YearList(token),
        PAYMENT_TYPE(token),
      ]);

      setYears(yearResponse?.year || []);

      setPaymentTypes(paymentTypeResponse?.paymentType || []);
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
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formattedData = {
        ...formData,
        studentFees_paid: parseInt(formData.studentFees_paid, 10) || 0,
      };
      const response = await CREATE_STUDENT_PENDING_CLASS_FEES(
        formattedData,
        token
      );

      if (response?.code === 200) {
        toast.success(response?.msg);

        handleOpen();
        setFormData({
          studentFees_year: "",
          studentFees_admission_no: "",
          studentFees_class: "",
          studentFees_paid: "",
          studentFees_pay_mode: "",
          studentFees_transactiondetails: "",
          studentFees_paid_date: "",
        });
      } else {
        toast.error(response?.msg);
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
        <DialogTitle className="flex flex-row items-center justify-between">
          <p className=" text-start  flex flex-row items-center gap-2">
            <span>Adm. No.</span>
            <span>{formData.studentFees_admission_no}</span>
          </p>
          <div className="flex flex-row items-center gap-2">
            <div>
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
            <p className="bg-blue-200 text-black px-3 py-1 rounded-md text-sm font-semibold">
              {formData.studentFees_class}
            </p>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <div className="flex flex-row items-center gap-2  justify-between mb-2">
            <div className="text-center text-xl">Fee Receipt</div>
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
          <div className="space-y-4 ">
            {/* <div>
              <FormLabel required>Admission No</FormLabel>
              <input
                type="text"
                name="studentFees_admission_no"
                className={inputClass}
                value={formData.studentFees_admission_no}
                onChange={handleInputChange}
                required
              />
            </div> */}

            {/* <div>
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
            </div> */}
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
            disabled={loading}
            className={CreateButton}
          >
            {loading ? "Adding..." : "Add Fees"}
          </button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
