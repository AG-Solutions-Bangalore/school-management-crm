import React, { useEffect } from "react";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";
import { toast } from "sonner";
import Layout from "../../../layout/Layout";
import { IconInfoCircle } from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const studentData = [
  {
    student_admission_no: "1/2024-25",
    student_name: "Moorthy",
    studentClass_class: "III",
    total_amount: 27000,
    paid_amount: 13161,
    van_required: "No",
    van_amount: 0,
  },
];
const PendingFeesReportView = () => {
  useEffect(() => {
    const handleSubmit = async (e) => {
      e.preventDefault();

      const data = {
        ...teacher,
      };

      setIsButtonDisabled(true);
      try {
        const response = await axios.post(
          `${BASE_URL}/api/panel-create-teacher`,
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
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
    handleSubmit();
  }, []);

  const handlePendingFees = (e) => {
    e.preventDefault();
    let data = {
      student_year: pendingreport.student_year,
      status: pendingreport.status,
      student_class: pendingreport.student_class,
    };

    e.preventDefault();

    axios({
      url: BASE_URL + "/api/panel-download-student-details-report",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "pending_details.csv");
        document.body.appendChild(link);
        link.click();
        toast.success("Pending Details Downloaded Successfully");
        setPendingReport({
          student_year: "",
          status: "",
          student_class: "",
        });
      })
      .catch((err) => {
        toast.error("Pending Details is Not Downloaded");
      });
  };
  return (
    <Layout>
      <div className="sticky top-0 p-2 mb-4 border-b-2 border-red-500 bg-[#E1F5FA] rounded-lg">
        <h2 className="px-5 text-black text-lg flex justify-between items-center rounded-xl p-2">
          <div className="flex items-center gap-2">
            <IconInfoCircle className="w-4 h-4" />
            <span>View Pending Fees</span>
          </div>
          <button
            onClick={handlePendingFees}
            className="text-center text-sm font-[400] cursor-pointer  w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
          >
            Download
          </button>
        </h2>
      </div>{" "}
      <TableContainer component={Paper} className="shadow-lg rounded-lg p-4">
        <Table>
          <TableHead className="bg-gray-100 text-white">
            <TableRow>
              <TableCell className="text-white font-bold">
                Admission No
              </TableCell>
              <TableCell className="text-white font-bold">
                Student Name
              </TableCell>
              <TableCell className="text-white font-bold">Class</TableCell>
              <TableCell className="text-white font-bold">
                Total Amount
              </TableCell>
              <TableCell className="text-white font-bold">
                Paid Amount
              </TableCell>
              <TableCell className="text-white font-bold">
                Van Required
              </TableCell>
              <TableCell className="text-white font-bold">Van Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studentData.map((student, index) => (
              <TableRow key={index} className="hover:bg-gray-100">
                <TableCell>{student.student_admission_no}</TableCell>
                <TableCell>{student.student_name}</TableCell>
                <TableCell>{student.studentClass_class}</TableCell>
                <TableCell>{student.total_amount.toLocaleString()}</TableCell>
                <TableCell>{student.paid_amount.toLocaleString()}</TableCell>
                <TableCell>{student.van_required}</TableCell>
                <TableCell>{student.van_amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
};

export default PendingFeesReportView;
