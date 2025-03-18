import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import React, { useEffect, useMemo, useState } from "react";
import LoaderComponent from "../../../components/common/LoaderComponent";
import useApiToken from "../../../components/common/useApiToken";
import Layout from "../../../layout/Layout";
import { FETCH_WEBSITE_CONTRACT } from "../../../components/common/UseApi";

const ContactList = () => {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = useApiToken();

  const fetchContactData = async () => {
    try {
      setLoading(true);
      const response = await FETCH_WEBSITE_CONTRACT(token);
      setContactData(response?.contact);
    } catch (error) {
      console.error("Error fetching contact List data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "contact_name",
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "contact_mobile",
        header: "Mobile No",
        size: 150,
      },
      {
        accessorKey: "contact_email",
        header: "Email",
        size: 150,
      },

      {
        accessorKey: "contact_message",
        header: "Message",
        size: 150,
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: contactData || [],
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
              Website Contact List
            </h1>
            <div className="flex gap-2"></div>
          </div>
        </div>

        <div className=" shadow-md">
          {!contactData ? (
            <LoaderComponent />
          ) : (
            <MantineReactTable table={table} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ContactList;
