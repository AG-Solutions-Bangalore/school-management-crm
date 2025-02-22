import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../layout/Layout";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { toast } from "sonner";

const SubjectList = () => {
    const [subjectData, setSubjectData] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
    const fetchSubjectData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-subject-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setSubjectData(response.data?.subject);
      } catch (error) {
        console.error("Error fetching subject List data", error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchSubjectData();
    }, []);
  
    const toggleStatus = async (id, currentStatus) => {
      try {
        const token = localStorage.getItem("token");
        const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
        const res = await axios.put(
          `${BASE_URL}/api/panel-update-subject-status/${id}`,
          { status: newStatus },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        if (res.data.code === 200) {
          toast.success(res.data.msg);
          setSubjectData((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, subject_status: newStatus } : item
            )
          );
        } else if (res.data.code === 400) {
          toast.error(res.data.msg);
        }
      } catch (error) {
        toast.error("Failed to update status. Please try again.");
      }
    };
  
    const columns = useMemo(
      () => [
        {
          accessorKey: "class_subject",
          header: "Class Subject",
          size: 150,
        },
        {
          accessorKey: "subject",
          header: "Subject",
          size: 150,
        },
        {
          accessorKey: "subject_status",
          header: "Status",
          size: 150,
          Cell: ({ row }) => {
            const { id, subject_status } = row.original;
            return (
              <button
                onClick={() => toggleStatus(id, subject_status)}
                className={`px-2 py-1 rounded transition-colors ${
                  subject_status === "Active" ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                }`}
              >
                {subject_status}
              </button>
            );
          },
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
                <div className="flex items-center space-x-2" title="Edit">
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
      data: subjectData || [],
      enableFullScreenToggle: false,
      enableDensityToggle: false,
      enableColumnActions: false,
      enableHiding: false,
      enableStickyHeader: true,
      enableStickyFooter: true,
      mantineTableContainerProps: { sx: { maxHeight: "400px" } },
      initialState: { columnVisibility: { address: false } },
    });
  
    return (
      <Layout>
        <div className="max-w-screen">
          <div className="bg-white p-4 mb-4 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
              <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-center md:text-left">
                Subject List
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate("/subject-list/createSubject")}
                  className="flex flex-row items-center gap-1 text-center text-sm font-[400] cursor-pointer w-[7rem] text-white bg-blue-600 hover:bg-red-700 p-2 rounded-lg shadow-md"
                >
                  <IconPlus className="w-4 h-4" /> Subject
                </button>
              </div>
            </div>
          </div>
  
          <div className="shadow-md">
            <MantineReactTable table={table} />
          </div>
        </div>
      </Layout>
    );
};
  
export default SubjectList;
