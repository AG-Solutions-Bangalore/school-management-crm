import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  CreateButton,
  HeaderColor,
} from "../../../components/common/ButttonConfig";
import LoaderComponent from "../../../components/common/LoaderComponent";
import {
  DOWNLOAD_STUDNET_PENDING,
  VIEW_PENDING_FEES_REPORT,
} from "../../../components/common/UseApi";
import useApiToken from "../../../components/common/useApiToken";
import Layout from "../../../layout/Layout";

const PendingFeesReportView = () => {
  const location = useLocation();
  const data = location.state || {};
  const navigate = useNavigate();
  const [studentfess, setStudentFess] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useApiToken();
  useEffect(() => {
    const fetchStudentFees = async () => {
      try {
        const response = await VIEW_PENDING_FEES_REPORT(data, token);

        setStudentFess(response?.student);
      } catch (error) {
        toast.error("Error fetching pending fees data");
      } finally {
        setLoading(false);
      }
    };
    fetchStudentFees();
  }, []);

  const handlePendingFees = async (e) => {
    e.preventDefault();

    try {
      const response = await DOWNLOAD_STUDNET_PENDING(data, token); // ✅ Ensure API receives data if required

      const url = window.URL.createObjectURL(new Blob([response])); // ✅ Use response properly
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "pending_details.csv");
      document.body.appendChild(link);
      link.click();

      toast.success("Pending Details Downloaded Successfully");
    } catch (error) {
      toast.error("Pending Details is Not Downloaded");
      console.error("Download error:", error);
    }
  };

  return (
    <Layout>
      <div className={HeaderColor}>
        <h2 className="px-5 text-black text-lg flex justify-between items-center rounded-xl p-2">
          <div className="flex items-center gap-2">
            <IconArrowBack
              className="w-5 h-5 text-red-500 cursor-pointer"
              onClick={() => navigate("/report-pending/download")}
            />
            <span>View Pending Fees</span>
          </div>
          <button onClick={handlePendingFees} className={CreateButton}>
            Download
          </button>
        </h2>
      </div>

      {loading ? (
        <LoaderComponent />
      ) : studentfess.length > 0 ? (
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
                <TableCell className="text-white font-bold">
                  Van Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentfess.map((student, index) => (
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
      ) : (
        <div className="text-center text-gray-500 py-10">
          <IconInfoCircle className="w-10 h-10 mx-auto text-gray-400" />
          <p>No pending fees data available</p>
        </div>
      )}
    </Layout>
  );
};

export default PendingFeesReportView;
