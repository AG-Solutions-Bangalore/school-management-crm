import React, { useEffect, useMemo, useState } from "react";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Layout from "../../../layout/Layout";
import BASE_URL from "../../../base/BaseUrl";
import { Button, Card, CardBody, CardHeader } from "@material-tailwind/react";
import StudentDetailsView from "./StudentDetailsView";
import { AddClassDialog, AddFeesDialog } from "./ClassAndFeesDialog";
import { EditClassDialog, EditFeesDialog } from "./EditClassAndFeesDialog";

const StudentView = () => {
  const { id } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [isFeesDialogOpen, setIsFeesDialogOpen] = useState(false);

  const [isEditClassDialogOpen, setIsEditClassDialogOpen] = useState(false);
const [isEditFeesDialogOpen, setIsEditFeesDialogOpen] = useState(false);
const [selectedClassId, setSelectedClassId] = useState(null);
const [selectedFeesId, setSelectedFeesId] = useState(null);
  const navigate = useNavigate();

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-student-view/2024-25/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudentData(response.data);
    } catch (error) {
      console.error("Error fetching student data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  const studentClassColumns = useMemo(
    () => [
      { accessorKey: "studentClass_year", header: "Year", size: 150 },
      {
        accessorKey: "studentClass_admission_no",
        header: "Admission No",
        size: 150,
      },
      { accessorKey: "studentClass_class", header: "Class", size: 150 },
      { accessorKey: "studentClass_van", header: "Van", size: 100 },
      {
        accessorKey: "studentClass_fees_structure",
        header: "Fee Structure",
        size: 150,
      },
      { accessorKey: "studentClass_amount", header: "Amount", size: 150 },
       {
              accessorKey: "id",
              header: "Actions",
              size: 100,
              Cell: ({ row }) => (
                <IconEdit
                  className="w-5 h-5 cursor-pointer text-blue-600"
                  onClick={() => {
                    setSelectedClassId(row.original.id);
                    setIsEditClassDialogOpen(true);
                  }}
                />
              ),
            },
    ],
    []
  );

  const studentFeesColumns = useMemo(
    () => [
      {
        accessorKey: "studentFees_admission_no",
        header: "Admission No",
        size: 150,
      },
      { accessorKey: "studentFees_class", header: "Class", size: 150 },
      { accessorKey: "studentFees_amount", header: "Fees", size: 150 },

      { accessorKey: "studentFees_fees_structure", header: "Fees Structure", size: 150 },
      { accessorKey: "studentFees_paid", header: "Paid", size: 150 },
      { accessorKey: "studentFees_pay_mode", header: "Pay Mode", size: 150 },

      {
              accessorKey: "id",
              header: "Actions",
              size: 100,
              Cell: ({ row }) => (
                <IconEdit
                  className="w-5 h-5 cursor-pointer text-blue-600"
                  onClick={() => {
                    setSelectedFeesId(row.original.id);
                    setIsEditFeesDialogOpen(true);
                  }}
                />
              ),
            },
    ],
    []
  );

  const studentClassTable = useMantineReactTable({
    columns: studentClassColumns,
    data: studentData?.studentClass || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableHiding: false,
  });

  const studentFeesTable = useMantineReactTable({
    columns: studentFeesColumns,
    data: studentData?.studentFees || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableHiding: false,
  });

  return (
    <Layout>
      <div className="max-w-screen p-4">
        <div className="bg-white p-4 mb-4 rounded-lg shadow-md">
          <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-center md:text-left">
            Student Details
          </h1>
        </div>
        <StudentDetailsView studentData={studentData} />
        <div className="bg-white p-4 mb-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Student Class List</h2>
            <button
              onClick={() => setIsClassDialogOpen(true)}
            className="flex flex-row items-center gap-1 text-center text-sm font-[400] cursor-pointer w-[7rem] text-white bg-blue-600 hover:bg-red-700 p-2 rounded-lg shadow-md"
            >
              <IconPlus className="w-5 h-5" /> Add Class
            </button>
          </div>
          <MantineReactTable table={studentClassTable} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Student Fees List</h2>
            <button
              onClick={() => setIsFeesDialogOpen(true)}
          className="flex flex-row items-center gap-1 text-center text-sm font-[400] cursor-pointer w-[7rem] text-white bg-blue-600 hover:bg-red-700 p-2 rounded-lg shadow-md"
            >
              <IconPlus className="w-4 h-4" />  Add  Fee
            </button>
          </div>
          <MantineReactTable table={studentFeesTable} />
        </div>
        <AddClassDialog
          open={isClassDialogOpen}
          handleOpen={() => {
            setIsClassDialogOpen(false);
            fetchStudentData();
          }}
          studentData={studentData} 
        />

        <AddFeesDialog
          open={isFeesDialogOpen}
          handleOpen={() => {
            setIsFeesDialogOpen(false);
            fetchStudentData();
          }}
          studentData={studentData} 
        />
        <EditClassDialog
  open={isEditClassDialogOpen}
  handleOpen={() => {
    setIsEditClassDialogOpen(false);
    setSelectedClassId(null);
    fetchStudentData();
  }}
  classId={selectedClassId}
/>

<EditFeesDialog
  open={isEditFeesDialogOpen}
  handleOpen={() => {
    setIsEditFeesDialogOpen(false);
    setSelectedFeesId(null);
    fetchStudentData();
  }}
  feesId={selectedFeesId}
/>
      </div>
    </Layout>
  );
};

export default StudentView;
