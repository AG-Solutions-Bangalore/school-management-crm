import React, { useEffect, useMemo, useState } from "react";
import { Tooltip } from "@mantine/core";
import {
  MantineReactTable,
  useMantineReactTable,
  MRT_GlobalFilterTextInput,
  MRT_ToggleFiltersButton,
} from "mantine-react-table";
import { Box, Button, Center, Flex, Loader, Text } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import TeacherSubCreate from "./TeacherSubCreate";
import TeacherSubEdit from "./TeacherSubEdit";

const TeacherSubList = ({ teacherData, fetchStudentData }) => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedTeacherSubId, setSelectedTeacherSubId] = useState(null);
  const columns = useMemo(
    () => [
      {
        accessorKey: "teachersub_class",
        header: "Class",
        size: 50,
      },
      {
        accessorKey: "teachersub_subject",
        header: "Subject",
        size: 50,
      },
      {
        accessorKey: "teachersub_on",
        header: "Weekdays",
        size: 50,
      },
      {
        accessorKey: "teachersub_period",
        header: "Period",
        size: 50,
      },

      {
        accessorKey: "teachersub_status",
        header: "Status",
        size: 150,
        Cell: ({ row }) => {
          const { id, teachersub_status } = row.original;
          return (
            <button
              onClick={() => toggleStatus(id, teachersub_status)}
              className={`px-2 py-1 rounded transition-colors ${
                teachersub_status === "Active"
                  ? "bg-green-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
            >
              {teachersub_status}
            </button>
          );
        },
      },
      {
        id: "id",
        header: "Action",
        size: 50,
        enableHiding: false,
        Cell: ({ row }) => (
          <Flex gap="xs">
            <Tooltip label="Edit" position="top" withArrow>
              <IconEdit
                className="cursor-pointer text-blue-600 hover:text-blue-800"
                onClick={() => {
                  setOpenEditDialog(true);
                  setSelectedTeacherSubId(row.original.id);
                }}
              />
            </Tooltip>
          </Flex>
        ),
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: teacherData?.teacherSub ? teacherData.teacherSub : [],
    enableColumnActions: false,
    enableStickyHeader: true,
    enableStickyFooter: true,
    initialState: { showGlobalFilter: true },
    mantineTableContainerProps: { sx: { maxHeight: " 400px" } },

    renderTopToolbar: ({ table }) => {
      return (
        <Flex
          p="md"
          justify="space-between"
          sx={{
            overflowX: "auto",
            maxWidth: "100%",
          }}
        >
          {" "}
          <Text size="xl" weight={700}>
            Teacher Assign Subject
          </Text>
          <Flex gap="sm">
            <MRT_GlobalFilterTextInput table={table} />
            <MRT_ToggleFiltersButton table={table} />

            <Button
              className="w-36 text-white bg-blue-600 !important hover:bg-violet-400 hover:animate-pulse"
              onClick={() => setOpenDialog(true)}
            >
              Add
            </Button>
          </Flex>
        </Flex>
      );
    },
  });

  return (
    <Box className="max-w-screen">
      {!teacherData ? (
        <Center style={{ height: "70vh", flexDirection: "column" }}>
          <Loader size="lg" variant="dots" color="pink" />
          <Text mt="md" color="gray" size="lg">
            Loading, please wait...
          </Text>
        </Center>
      ) : (
        <MantineReactTable table={table} />
      )}
      <TeacherSubCreate
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        teacherData={teacherData}
        fetchStudentData={fetchStudentData}
      />
      <TeacherSubEdit
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        teacherData={teacherData}
        fetchStudentData={fetchStudentData}
        selectedTeacherSubId={selectedTeacherSubId}
      />
    </Box>
  );
};

export default TeacherSubList;
