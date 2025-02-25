import React, { useEffect, useMemo, useState } from "react";
import {
  IconEdit,
  IconPlus,
  IconUser,
  IconCalendar,
  IconSchool,
  IconDownload,
} from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Layout from "../../../layout/Layout";
import BASE_URL from "../../../base/BaseUrl";
import { Button, Card, CardBody, CardHeader, Dialog, DialogHeader, DialogBody } from "@material-tailwind/react";
import StudentDetailsView from "./StudentDetailsView";
import { AddClassDialog, AddFeesDialog } from "./ClassAndFeesDialog";
import { EditAttendenceDialog, EditClassDialog, EditFeesDialog } from "./EditClassAndFeesDialog";

const StudentView = () => {
  const { id } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [isFeesDialogOpen, setIsFeesDialogOpen] = useState(false);

  const [isEditClassDialogOpen, setIsEditClassDialogOpen] = useState(false);
  const [isEditFeesDialogOpen, setIsEditFeesDialogOpen] = useState(false);
  const [isEditAttendenceDialogOpen, setIsEditAttendenceDialogOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedFeesId, setSelectedFeesId] = useState(null);
  const [selectedAttendenceId, setSelectedAttendenceId] = useState(null);
  //photo and adhar dialog
   const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
    const [isAadharDialogOpen, setIsAadharDialogOpen] = useState(false);

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
      // { accessorKey: "studentClass_year", header: "Year", size: 150 },
      // { accessorKey: "studentClass_class", header: "Class", size: 150 },
      { accessorKey: "studentClass_van", header: "Van", size: 100 },
      // {
      //   accessorKey: "studentClass_fees_structure",
      //   header: "Fee Structure",
      //   size: 150,
      // },
      {
        accessorKey: "studentClass_van_amount",
        header: "Van Amount",
        size: 150,
      },
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
        accessorKey: "studentFees_paid_date",
        header: "Date",
        size: 150,
        Cell: ({ row }) => {
          const date = row.original.studentFees_paid_date;
          return date ? moment(date).format("DD-MMM-YYYY") : "-";
        },
      },
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


  const studentAttendenceColumns = useMemo(
    () => [
      {
        accessorKey: "studentAttendance_date",
        header: "Date",
        size: 150,
        Cell: ({ row }) => {
          const date = row.original.studentAttendance_date;
          return date ? moment(date).format("DD-MMM-YYYY") : "-";
        },
      },
      { accessorKey: "studentAttendance_class", header: "Class", size: 150 },

      {
        accessorKey: "id",
        header: "Actions",
        size: 100,
        Cell: ({ row }) => (
          <IconEdit
            className="w-5 h-5 cursor-pointer text-blue-600"
            onClick={() => {
              setSelectedAttendenceId(row.original.id);
              setIsEditAttendenceDialogOpen(true);
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

  const studentAttendenceTable = useMantineReactTable({
    columns: studentAttendenceColumns,
    data: studentData?.studentAttendance || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableHiding: false,
  });

  const studentClass = studentData?.studentClass?.length
    ? studentData.studentClass[studentData.studentClass.length - 1]
        .studentClass_class
    : null;

  const updatedYear = studentData?.studentClass?.length
    ? studentData.studentClass[studentData.studentClass.length - 1]
        .studentClass_year
    : null;
  const totalAmount = studentData?.studentClass?.length
    ? studentData.studentClass[studentData.studentClass.length - 1]
        .studentClass_amount
    : null;

  const getRemainingAmount = () => {
    if (!studentData?.studentFees?.length) return totalAmount;

    const totalPaid = studentData.studentFees.reduce(
      (sum, fee) => sum + (fee.studentFees_paid || 0),
      0
    );
    return totalAmount - totalPaid;
  };

  const studentClassLength = studentData?.studentClass?.length || 0;


  const handleDownload = async () => {
    // const imageUrl = "https://bhsppvn.site/public/assets/student/1_Moorthy_A.jpg";

    const proxyUrl = "/api/public/assets/student/1_Moorthy_A.jpg";

    
    const response = await fetch(proxyUrl);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "Aadhar_Card.jpg"; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    
    URL.revokeObjectURL(blobUrl);
  };
  

  return (
    <Layout>
      <div className="max-w-screen p-2">
        <Card className="mb-2 overflow-hidden">
          <CardBody className="p-0">
            <div className="flex flex-col md:flex-row">
          
 {/* Left Section with Primary Info */}
<div className="bg-blue-50 p-4 md:w-1/3">
  <div className="flex items-center gap-3 mb-3">
    <img 
      src={"http://bhsppvn.site/public/assets/student/1_Moorthy_S.jpeg"} 
      alt={`Student Photo`}
     className="w-16 h-16 object-cover rounded-lg border-2 border-blue-500 cursor-pointer"
      onClick={() => setIsPhotoDialogOpen(true)}
    />
    <h1 className="text-lg font-medium text-blue-900 border-b-2 border-blue-500 pb-1">
      Student Details
    </h1>
  </div>
  <div className="flex items-center gap-2 mb-2">
    <IconUser className="w-4 h-4 text-blue-600" />
    <span className="text-sm font-medium text-gray-700">
      Adm No: {studentData?.student?.student_admission_no}
    </span>
  </div>
  <div className="flex items-center gap-2">
    <IconSchool className="w-4 h-4 text-blue-600" />
    <span className="text-sm font-medium text-gray-700">
      Class: {studentData?.student?.student_class}
    </span>
  </div>
</div>

              {/* Right Section with Secondary Info */}
              <div className="p-4 flex-1 bg-white">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {/* Gender Badge */}
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <span className="text-xs text-gray-700 block">Gender</span>
                    <span
                      className={`text-sm font-medium ${
                        studentData?.student?.student_gender === "Male"
                          ? "text-blue-700"
                          : "text-pink-700"
                      }`}
                    >
                      {studentData?.student?.student_gender === "Male"
                        ? "M"
                        : "F"}
                    </span>
                  </div>

                  {/* Academic Year */}
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <span className="text-xs text-gray-700 block">
                      Academic Year
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      {studentData?.student?.student_year}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <span className="text-xs text-gray-700 block">Status</span>
                    <span
                      className={`text-sm font-medium ${
                        studentData?.student?.student_status === "Active"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {studentData?.student?.student_status}
                    </span>
                  </div>

                  {/* Admission Date - Spans full width on mobile, 3 columns on desktop */}
                  <div className="bg-gray-50 rounded-lg p-2 text-center col-span-2 md:col-span-3">
                    <span className="text-xs text-gray-700 block">
                      Admission Date
                    </span>
                    <div className="flex items-center justify-center gap-2">
                      <IconCalendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-800">
                        {moment(
                          studentData?.student?.student_admission_date
                        ).format("DD MMMM, YYYY")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <StudentDetailsView studentData={studentData}
           setIsAadharDialogOpen={setIsAadharDialogOpen} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex justify-between items-center  ">
              <div className=" flex flex-col items-start text-sm ">
                <h2 className=" font-medium">Student Fees List</h2>
                <h2 className=" font-medium">Class: {studentClass}</h2>
              </div>
              <div className=" flex flex-col text-sm items-center  ">
                <span className="font-medium">Amount: {totalAmount}</span>
                <span className="text-red-600 font-medium">
                  Remaining: {getRemainingAmount()}
                </span>
              </div>
              <div className=" flex flex-col  text-sm items-start  ">
                <span className="font-medium">Year: {updatedYear}</span>
                <button
                  onClick={() => setIsFeesDialogOpen(true)}
                  className="flex items-center gap-1 text-sm  bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                >
                  <IconPlus className="w-4 h-4" /> Add Fee
                </button>
              </div>
            </div>
            <MantineReactTable table={studentFeesTable} />
          </div>

          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-base font-medium">Van Info</h2>
              {studentClassLength === 0 && (
                <button
                  onClick={() => setIsClassDialogOpen(true)}
                  className="flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded"
                >
                  <IconPlus className="w-4 h-4" /> Add Class
                </button>
              )}
            </div>
            <MantineReactTable table={studentClassTable} />
          </div>
         
        </div>

        <div className="bg-white  p-3 mt-2 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-base font-medium">Attendence Info</h2>
              <span>Class:{studentClass}</span>
              </div>
            <MantineReactTable table={studentAttendenceTable} />
        
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
        <EditAttendenceDialog
          open={isEditAttendenceDialogOpen}
          handleOpen={() => {
            setIsEditAttendenceDialogOpen(false);
            setSelectedAttendenceId(null);
            fetchStudentData();
          }}
          attendenceId={selectedAttendenceId}
        />


                {/* Photo Dialog */}
                <Dialog open={isPhotoDialogOpen} handler={() => setIsPhotoDialogOpen(false)} size="md">
                  <DialogHeader className="flex justify-between">
                    <div>Student Photo</div>
                    <div className="flex gap-2">
                   
                      <button 
                        onClick={() => setIsPhotoDialogOpen(false)}
                        className="bg-gray-300 px-3 py-1 rounded text-sm"
                      >
                        Close
                      </button>
                    </div>
                  </DialogHeader>
                  <DialogBody className="flex justify-center">
                    <img 
                      src={"http://bhsppvn.site/public/assets/student/1_Moorthy_S.jpeg"} 
                      alt={`student photo`}
                      className="max-h-96 object-contain"
                    />
                  </DialogBody>
                </Dialog>
        
                {/* Aadhar Dialog */}
                <Dialog open={isAadharDialogOpen} handler={() => setIsAadharDialogOpen(false)} size="md">
                  <DialogHeader className="flex justify-between">
                    <div>Aadhar Card</div>
                    <div className="flex gap-2">
                    <button 
    onClick={handleDownload}
    className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded text-sm"
  >
    <IconDownload size={16} /> Download
  </button>
                      <button 
                        onClick={() => setIsAadharDialogOpen(false)}
                        className="bg-gray-300 px-3 py-1 rounded text-sm"
                      >
                        Close
                      </button>
                    </div>
                  </DialogHeader>
                  <DialogBody className="flex justify-center">
                    <img 
                      src="https://bhsppvn.site/public/assets/student/1_Moorthy_A.jpg" 
                      alt="Aadhar Card"
                      className="max-h-96 object-contain"
                    />
                  </DialogBody>
                </Dialog>
      </div>
    </Layout>
  );
};

export default StudentView;
