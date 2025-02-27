import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../layout/Layout";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { toast } from "sonner";
import {
  Button,
  Dialog,
  DialogContent,
  FormLabel,
  IconButton,
  Slide,
} from "@mui/material";
import { IconX } from "@tabler/icons-react";
import LoaderComponent from "../../components/common/LoaderComponent";

const SubjectList = () => {
  const [subjectData, setSubjectData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [classes, setClasses] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [subject, setSubject] = useState({
    class_subject: "",
    subject: "",
  });
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
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-classes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setClasses(response.data?.classes);
    } catch (error) {
      console.error("Error fetching classes  data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSubjectData();
  }, []);
  const onInputChange = (e) => {
    setSubject({
      ...subject,
      [e.target.name]: e.target.value,
    });
  };
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
                subject_status === "Active"
                  ? "bg-green-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
            >
              {subject_status}
            </button>
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = document.getElementById("addIndiv");
    if (!form.checkValidity()) {
      toast.error("Fill all required");
      setIsButtonDisabled(false);

      return;
    }
    const data = {
      class_subject: subject.class_subject,
      subject: subject.subject,
    };

    setIsButtonDisabled(true);
    axios({
      url: BASE_URL + "/api/panel-create-subject",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.code == 200) {
        toast.success(res.data.msg);
        setOpenDialog(false);
        fetchSubjectData();
        setSubject({
          class_subject: "",
          subject: "",
        });
        setIsButtonDisabled(false);
      } else if (res.data.code == 400) {
        toast.error(res.data.msg);
      }
      setSubject({
        class_subject: "",
        subject: "",
      });
    });
  };
  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const inputClassSelect =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-500";
  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-500";
  return (
    <>
      <Layout>
        <div className="max-w-screen">
          <div className="bg-white p-4 mb-4 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
              <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-center md:text-left">
                Subject List
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setOpenDialog(true);
                    fetchClasses();
                  }}
                  className="flex flex-row items-center gap-1 text-center text-sm font-[400] cursor-pointer w-[7rem] text-white bg-blue-600 hover:bg-red-700 p-2 rounded-lg shadow-md"
                >
                  <IconPlus className="w-4 h-4" /> Subject
                </button>
              </div>
            </div>
          </div>

          <div className="shadow-md">
            {!subjectData ? (
              <LoaderComponent />
            ) : (
              <MantineReactTable table={table} />
            )}{" "}
          </div>
        </div>
      </Layout>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
        sx={{ backdropFilter: "blur(4px)" }}
        TransitionComponent={Slide}
        transitionDuration={500}
      >
        <DialogContent>
          <div className="mt-2">
            <div className="mb-4 flex justify-between">
              <h3 className="font-bold text-xl">Create Subject</h3>
              <IconButton edge="end" onClick={() => setOpenDialog(false)}>
                <IconX />
              </IconButton>
            </div>

            <form
              onSubmit={handleSubmit}
              id="addIndiv"
              className="w-full   rounded-lg mx-auto p-4 space-y-6 "
            >
              <div className="grid grid-cols-1 gap-6">
                {/* Classes  */}

                <div>
                  <FormLabel required>Clasess</FormLabel>
                  <select
                    name="class_subject"
                    value={subject.class_subject}
                    onChange={(e) => onInputChange(e)}
                    required
                    className={inputClassSelect}
                  >
                    <option value="">Select Classes</option>
                    {classes.map((option) => (
                      <option key={option.classes} value={option.classes}>
                        {option.classes}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Subject */}
                <div>
                  <FormLabel required>Subject</FormLabel>
                  <input
                    type="text"
                    name="subject"
                    value={subject.subject}
                    onChange={(e) => onInputChange(e)}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  type="submit"
                  className="text-center text-sm font-[400] cursor-pointer  w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                  disabled={isButtonDisabled}
                >
                  {isButtonDisabled ? "Creating..." : "Create"}
                </button>

                <button
                  type="button"
                  className="text-center text-sm font-[400] cursor-pointer  w-36 text-white bg-red-600 hover:bg-red-400 p-2 rounded-lg shadow-md"
                  onClick={() => setOpenDialog(false)}
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubjectList;
