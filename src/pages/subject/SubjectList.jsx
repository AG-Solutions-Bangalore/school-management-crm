import React, { useEffect, useRef, useState } from "react";
import Layout from "../../layout/Layout";
import {
  IconBook,
  IconPlus,
  IconX,
  IconFilter,
  IconSearch,
  IconSchool,
  IconAdjustments,
  IconChevronDown,
  IconChevronUp,
  IconPresentationAnalytics,
} from "@tabler/icons-react";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  Slide,
  IconButton,
  CircularProgress,
} from "@mui/material";
import LoaderComponent from "../../components/common/LoaderComponent";
import {
  BackButton,
  CreateButton,
} from "../../components/common/ButttonConfig";

const SubjectList = () => {
  const [subjectData, setSubjectData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingClass, setLoadingClass] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const buttonRef = useRef(null);
  const [classes, setClasses] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState(null);
  const [selectedClass, setSelectedClass] = useState("all");
  const [showStats, setShowStats] = useState(true);

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
      setLoadingClass(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-classes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClasses(response.data?.classes);
    } catch (error) {
      console.error("Error fetching classes data", error);
    } finally {
      setLoadingClass(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = document.getElementById("addSubjectForm");
    if (!form.checkValidity()) {
      toast.error("Please fill all required fields");
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
  const handleOpenDialog = () => {
    setOpenDialog(true);
    fetchClasses();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  // Group subjects by class --sajid /27 feb
  const groupedSubjects = React.useMemo(() => {
    if (!subjectData) return {};

    return subjectData.reduce((acc, subject) => {
      if (!acc[subject.class_subject]) {
        acc[subject.class_subject] = [];
      }
      acc[subject.class_subject].push(subject);
      return acc;
    }, {});
  }, [subjectData]);

  // static class
  const classOrder = [
    "NURSERY",
    "LKG",
    "UKG",
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
  ];

  // Sorting the class
  const sortedClassNames = React.useMemo(() => {
    if (!groupedSubjects) return [];

    return Object.keys(groupedSubjects).sort((a, b) => {
      const indexA = classOrder.indexOf(a);
      const indexB = classOrder.indexOf(b);

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      return a.localeCompare(b);
    });
  }, [groupedSubjects]);

  const filteredSubjects = React.useMemo(() => {
    if (!subjectData) return [];

    return subjectData.filter((subject) => {
      const matchesSearch =
        searchTerm === "" ||
        subject.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.class_subject.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterActive === null ||
        (filterActive === true && subject.subject_status === "Active") ||
        (filterActive === false && subject.subject_status === "Inactive");

      const matchesClass =
        selectedClass === "all" || subject.class_subject === selectedClass;

      return matchesSearch && matchesFilter && matchesClass;
    });
  }, [subjectData, searchTerm, filterActive, selectedClass]);

  // Get class statistics
  const classStats = React.useMemo(() => {
    if (!subjectData) return [];

    const stats = sortedClassNames.map((className) => {
      const subjects = groupedSubjects[className] || [];
      const activeCount = subjects.filter(
        (s) => s.subject_status === "Active"
      ).length;

      return {
        name: className,
        total: subjects.length,
        active: activeCount,
        inactive: subjects.length - activeCount,
      };
    });

    return stats;
  }, [groupedSubjects, sortedClassNames]);

  // Calculate total stats -- err 409
  const totalStats = React.useMemo(() => {
    if (!classStats.length) return { total: 0, active: 0, inactive: 0 };

    return classStats.reduce(
      (acc, stat) => {
        return {
          total: acc.total + stat.total,
          active: acc.active + stat.active,
          inactive: acc.inactive + stat.inactive,
        };
      },
      { total: 0, active: 0, inactive: 0 }
    );
  }, [classStats]);
  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
  return (
    <>
      <Layout>
        <div className="bg-gray-50 min-h-screen">
          <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
            <div className="max-w-screen-2xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-800">
                  Subject Dashboard
                </span>
                {!loading && (
                  <div className="ml-2 text-xs py-1 px-2 bg-indigo-50 text-indigo-700 rounded-full">
                    {filteredSubjects.length} Subjects
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-44 pl-8 pr-3 py-1.5 text-sm rounded-full border border-gray-200 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <IconSearch className="absolute left-2.5 top-2 text-gray-400 w-4 h-4" />
                </div>

                <button
                  className={`flex items-center gap-1 py-1.5 px-3 rounded-full text-xs font-medium transition-colors ${
                    filterActive === true
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : filterActive === false
                      ? "bg-gray-50 text-gray-700 border border-gray-200"
                      : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                  }`}
                  onClick={() =>
                    setFilterActive(
                      filterActive === null
                        ? true
                        : filterActive === true
                        ? false
                        : null
                    )
                  }
                >
                  <IconFilter className="w-3.5 h-3.5" />
                  {filterActive === null
                    ? "All"
                    : filterActive === true
                    ? "Active"
                    : "Inactive"}
                </button>

                <button
                  ref={buttonRef}
                  onClick={handleOpenDialog}
                  className={CreateButton}
                >
                  <IconPlus className="w-3.5 h-3.5" /> Subject
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-screen-2xl mx-auto px-4 py-3">
            {/* {selectedClass === "all" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4 overflow-hidden">
                <div 
                  className="flex justify-between items-center p-3 border-b border-gray-100 cursor-pointer"
                  onClick={() => setShowStats(!showStats)}
                >
                  <div className="flex items-center gap-2">
                    <IconPresentationAnalytics className="text-indigo-500 w-4 h-4" />
                    <h3 className="font-medium text-sm text-gray-800">Subject Overview</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 text-xs text-gray-900">
                      <span>Total: <strong>{totalStats.total}</strong></span>
                      <span className="h-3 w-px bg-gray-200"></span>
                      <span className="text-green-600">Active: <strong>{totalStats.active}</strong></span>
                      <span className="h-3 w-px bg-gray-200"></span>
                      <span className="text-gray-900">Inactive: <strong>{totalStats.inactive}</strong></span>
                    </div>
                    {showStats ? (
                      <IconChevronUp className="w-4 h-4 text-gray-900" />
                    ) : (
                      <IconChevronDown className="w-4 h-4 text-gray-900" />
                    )}
                  </div>
                </div>
                
                {showStats && (
                  <div className="p-3 grid grid-cols-2 overflow-x-auto">
                    <div className="flex gap-2 pb-1">
                      {classStats.map(stat => (
                        <div 
                          key={stat.name}
                          className={`min-w-[120px] p-2 rounded-lg border transition-all cursor-pointer ${
                            selectedClass === stat.name 
                              ? "bg-indigo-50 border-indigo-200" 
                              : "bg-white border-gray-200 hover:border-indigo-200"
                          }`}
                          onClick={() => setSelectedClass(stat.name)}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <div className="font-medium text-xs">
                              {stat.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {stat.total}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 mt-1">
                            <div className="h-1.5 bg-green-200 rounded-full" style={{ width: `${(stat.active/stat.total)*100}%` }}></div>
                            <div className="h-1.5 bg-gray-200 rounded-full" style={{ width: `${(stat.inactive/stat.total)*100}%` }}></div>
                          </div>
                          
                          <div className="flex justify-between mt-1">
                            <span className="text-[10px] text-green-600">{stat.active}</span>
                            <span className="text-[10px] text-gray-500">{stat.inactive}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )} */}

            <div className="mb-4 overflow-x-auto">
              <div className="flex gap-1.5 min-w-max">
                <button
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedClass === "all"
                      ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                      : "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedClass("all")}
                >
                  All Classes
                </button>

                {sortedClassNames.map((className) => (
                  <button
                    key={className}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                      selectedClass === className
                        ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                        : "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedClass(className)}
                  >
                    {className}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <LoaderComponent />
            ) : (
              <div className="mb-6">
                {filteredSubjects.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <IconBook className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">
                      No subjects found matching your criteria.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {filteredSubjects.map((subject) => (
                      <div
                        key={subject.id}
                        className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div
                          className={`h-1 ${
                            subject.subject_status === "Active"
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <div className="p-3">
                          <div className="flex flex-row items-center justify-between ">
                            <div className="text-[10px]  font-medium text-gray-900 uppercase tracking-wide ">
                              {subject.class_subject}
                            </div>
                            <div
                              onClick={() =>
                                toggleStatus(subject.id, subject.subject_status)
                              }
                              className={`w-8 h-4 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
                                subject.subject_status === "Active"
                                  ? "bg-green-400"
                                  : "bg-gray-300"
                              }`}
                            >
                              <div
                                className={`bg-white w-3 h-3 rounded-full shadow-sm transform transition-transform ${
                                  subject.subject_status === "Active"
                                    ? "translate-x-4"
                                    : "translate-x-0"
                                }`}
                              />
                            </div>
                          </div>

                          <div
                            className="font-medium text-sm text-gray-800 line-clamp-2"
                            title={subject.subject}
                          >
                            {subject.subject}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogContent sx={{ padding: "16px" }}>
            <div className="relative">
              <div className="absolute top-0 right-0">
                <IconButton
                  edge="end"
                  onClick={() => setOpenDialog(false)}
                  size="small"
                >
                  <IconX size={18} />
                </IconButton>
              </div>

              <h3 className="font-bold text-lg text-gray-800 mb-4 pr-8">
                Add New Subject
              </h3>

              <form
                onSubmit={handleSubmit}
                id="addSubjectForm"
                className="space-y-4"
              >
                <div className="space-y-4">
                  <div>
                    <FormLabel required>Class</FormLabel>
                    <select
                      name="class_subject"
                      value={subject.class_subject}
                      onChange={onInputChange}
                      required
                      className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-500"
                    >
                      <option value="">Select Class</option>
                      {classes.map((option) => (
                        <option key={option.classes} value={option.classes}>
                          {option.classes}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <FormLabel required>Subject</FormLabel>
                    <input
                      type="text"
                      name="subject"
                      value={subject.subject}
                      onChange={onInputChange}
                      className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-500"
                      placeholder="Subject Name"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    className={BackButton}
                    onClick={handleCloseDialog}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className={CreateButton}
                    disabled={isButtonDisabled}
                  >
                    {isButtonDisabled ? "Adding..." : "Add Subject"}
                  </button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </Layout>
    </>
  );
};

export default SubjectList;
