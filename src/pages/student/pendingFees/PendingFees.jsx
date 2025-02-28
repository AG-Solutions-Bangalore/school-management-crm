import React, { useContext, useEffect, useMemo, useState } from "react";
import Layout from "../../../layout/Layout";
import { useNavigate } from "react-router-dom";
import { ContextPanel } from "../../../context/ContextPanel";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { PendingFeesDialog } from "./PendingFeesDialog";
import LoaderComponent from "../../../components/common/LoaderComponent";
import { AddFees } from "./AddFees";

const PendingFees = () => {
  const [pendingFeesData, setPendingFeesData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { selectedYear } = useContext(ContextPanel);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [isFeesDialogOpen, setIsFeesDialogOpen] = useState(false);
  

  const fetchPendingFeesData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-student-pending-class-fees/${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPendingFeesData(response.data?.student);
    } catch (error) {
      console.error("Error fetching pending fees List data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingFeesData();
  }, [selectedYear]);
  const handleOpenDialog = (studentData) => {
    setSelectedStudent(studentData);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedStudent(null);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "student_admission_no",
        header: "Adm. No.",
        size: 150,
      },
      // {
      //   accessorKey: "student_name",
      //   header: "Name",
      //   size: 150,
      // },
      // {
      //   accessorKey: "studentClass_class",
      //   header: "Class",
      //   size: 150,
      // },

      {
        accessorKey: "combined",
        header: "Name/Class",
        size: 150,
        accessorFn: (row) => `${row.student_name} - ${row.studentClass_class}`,
        Cell: ({ row }) => (
          <div className="flex flex-col text-xs">
            <span className="text-black font-semibold">
              {row.original.student_name}
            </span>
            <span className="text-black text-xs">
              {row.original.studentClass_class}
            </span>
          </div>
        ),
      },

      // {
      //   accessorKey: "total_amount",
      //   header: "Total Fees",
      //   size: 150,
      // },
      // {
      //   accessorKey: "paid_amount",
      //   header: "Paid",
      //   size: 150,
      // },
      {
        accessorKey: "combined1",
        header: "Total Fees/Paid",
        size: 150,
        accessorFn: (row) => `${row.total_amount} - ${row.paid_amount}`,
        Cell: ({ row }) => (
          <div className="flex flex-col text-xs">
            <span className="text-black font-semibold">
              {row.original.total_amount}
            </span>
            <span className="text-black text-xs">
              {row.original.paid_amount}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "van_required",
        header: "Van",
        size: 150,
      },
      {
        accessorKey: "van_amount",
        header: "Van Amount",
        size: 150,
      },

      {
        accessorKey: "combined3",
        header: "Balance",
        size: 150,
        accessorFn: (row) => `${row.total_amount} - ${row.paid_amount}`,
        Cell: ({ row }) => (
          <div className="flex flex-col text-xs">
            <span className="text-black font-semibold">
              {row.original.total_amount - row.original.paid_amount}
            </span>
          </div>
        ),
      },
    
      {
        id: "id",
        header: "Action",
        size: 20,
        enableHiding: false,
        Cell: ({ row }) => {
          const id = row.original.id;

          return (
            <div className="flex gap-2">
              <div
                onClick={() => handleOpenDialog(row.original)}
                className="flex items-center space-x-2"
                title="Pending fee"
              >
                <IconEdit className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: pendingFeesData || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableHiding: false,
    enableStickyHeader: true,
    enableStickyFooter: true,
    mantineTableContainerProps: { sx: { maxHeight: "400px" } },

    initialState: { columnVisibility: { address: false } },
    state: {
      isLoading: loading,
    },
  });
  return (
    <Layout>
      <div className="max-w-screen">
        <div className="bg-white p-4 mb-4 rounded-lg shadow-md">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
            <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-center md:text-left">
              Student Pending Fees List
            </h1>
            <div className="flex gap-2">
                         <button
                         onClick={() => setIsFeesDialogOpen(true)}
                           className=" flex flex-row items-center gap-1 text-center text-sm font-[400] cursor-pointer  w-[5rem] text-white bg-blue-600 hover:bg-red-700 p-2 rounded-lg shadow-md"
                         >
                           <IconPlus className="w-4 h-4" /> Fees
                         </button>
                       </div>
          </div>
        </div>

        <div className=" shadow-md">
          {!pendingFeesData ? (
            <LoaderComponent />
          ) : (
            <MantineReactTable table={table} />
          )}
        </div>
        <PendingFeesDialog
          open={dialogOpen}
          handleClose={handleCloseDialog}
          studentData={selectedStudent}
          onSuccess={fetchPendingFeesData}
        />
         <AddFees
                  open={isFeesDialogOpen}
                  handleOpen={() => {
                    setIsFeesDialogOpen(false);
                    fetchPendingFeesData();
                  }}
                
                />
      </div>
    </Layout>
  );
};

export default PendingFees;
