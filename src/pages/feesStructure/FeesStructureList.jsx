import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../layout/Layout";
import { IconEdit, IconEye, IconPlus } from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import moment from "moment/moment";

const FeesStructureList = () => {
  const [feesStructureData, setFeeStructureData] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchFeesStructureData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-fee-structure-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFeeStructureData(response.data?.feeStructure);
    } catch (error) {
      console.error("Error fetching feeStructure List data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeesStructureData();
  }, []);
  

  const columns = useMemo(
    () => [
    

      {
        accessorKey: "className",
        header: "Class Name",
        size: 150,
      },
      {
        accessorKey: "tuitionFee",
        header: "Tution Fee",
        size: 150,
      },
      {
        accessorKey: "applnfee",
        header: "Appli. Fee",
        size: 150,
      },
      {
        accessorKey: "admnfee",
        header: "Admin Fee",
        size: 150,
      },
      {
        accessorKey: "library",
        header: "Library",
        size: 150,
      },
      {
        accessorKey: "readingRoom",
        header: "Reading Room",
        size: 150,
      },
      {
        accessorKey: "printingStationary",
        header: "Printing Stationary",
        size: 150,
      },
      {
        accessorKey: "testExamination",
        header: "Test Exam.",
        size: 150,
      },
      {
        accessorKey: "SWFTWF",
        header: "SWFTWF",
        size: 150,
      },
      {
        accessorKey: "RR",
        header: "RR",
        size: 150,
      },
      {
        accessorKey: "cilturalActivities",
        header: "C.A.",
        size: 150,
      },
      {
        accessorKey: "medical",
        header: "Medical",
        size: 150,
      },
      {
        accessorKey: "lab",
        header: "Lab",
        size: 150,
      },
      {
        accessorKey: "cdf",
        header: "CDF",
        size: 150,
      },
      {
        accessorKey: "buildingFund",
        header: "Building Fund",
        size: 150,
      },
      {
        accessorKey: "swf",
        header: "Swf",
        size: 150,
      },
      {
        accessorKey: "grandTotal",
        header: "Grand Total",
        size: 150,
      },

  
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: feesStructureData || [],
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
        <div className=" ">
            <div className="bg-white p-4 mb-4 rounded-lg shadow-md">
              {/* Header Section */}
              <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
                <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-center md:text-left">
                  Fees Structure List
                </h1>
               
              </div>
            </div>
    
            <div className=" shadow-md max-w-7xl mx-auto">
              <MantineReactTable table={table} />
            </div>
          
          </div>
    </Layout>
  );
};

export default FeesStructureList;
