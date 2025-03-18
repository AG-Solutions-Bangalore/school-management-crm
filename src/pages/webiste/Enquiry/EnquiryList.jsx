import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import React, { useEffect, useMemo, useState } from "react";
import LoaderComponent from "../../../components/common/LoaderComponent";
import {
  FETCH_WEBSITE_ENQUIRY
} from "../../../components/common/UseApi";
import useApiToken from "../../../components/common/useApiToken";
import Layout from "../../../layout/Layout";

const EnquiryList = () => {
  const [enquiryData, setEnquiryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = useApiToken();
  const fetchEnquiryData = async () => {
    try {
      setLoading(true);
      const response = await FETCH_WEBSITE_ENQUIRY(token);

      setEnquiryData(response?.enquiry);
    } catch (error) {
      console.error("Error fetching enquiry List data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiryData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "full_name",
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "mobile_no",
        header: "Mobile No",
        size: 150,
      },
      {
        accessorKey: "email_id",
        header: "Email",
        size: 150,
      },
      {
        accessorKey: "class_for",
        header: "Class For",
        size: 150,
      },
      {
        accessorKey: "message",
        header: "Message",
        size: 150,
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: enquiryData || [],
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
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
            <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-center md:text-left">
              Website Enquiry List
            </h1>
            <div className="flex gap-2"></div>
          </div>
        </div>

        <div className=" shadow-md">
          {!enquiryData ? (
            <LoaderComponent />
          ) : (
            <MantineReactTable table={table} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EnquiryList;
