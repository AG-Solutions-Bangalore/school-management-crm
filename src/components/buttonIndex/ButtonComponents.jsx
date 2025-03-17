import { Eye, Plus, Trash } from "lucide-react";
import React from "react";
import { checkPermission } from "./checkPermission";
import { useTheme } from "@mui/material/styles";
import { IconEdit, IconPrinter, IconTrash } from "@tabler/icons-react";
const getStaticPermissions = () => {
  const buttonPermissions = localStorage.getItem("buttonControl");
  try {
    return buttonPermissions ? JSON.parse(buttonPermissions) : [];
  } catch (error) {
    console.error(
      "Error parsing StaticPermission data from localStorage",
      error
    );
    return [];
  }
};

// ---------------------Master-----------------------
// ----------Subject
export const MasterSubjectCreate = ({ onClick, className, ref }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterSubjectCreate", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className} ref={ref}>
      <Plus className="h-4 w-4 " />
      Subject
    </button>
  );
};
MasterSubjectCreate.page = "Subject";
// ----------Holiday

export const MasterHolidayCreate = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterHolidayCreate", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      <Plus className="h-4 w-4 " />
      Holiday
    </button>
  );
};
MasterHolidayCreate.page = "Holiday";
export const MasterHolidayEdit = ({ onClick, className }) => {
  const theme = useTheme();

  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterHolidayEdit", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className} title="Edit Holiday">
      <IconEdit color={theme.palette.primary.icon} className="h-4 w-4 " />
    </button>
  );
};
MasterHolidayEdit.page = "Holiday";
export const MasterHolidayDelete = ({ onClick, className }) => {
  const theme = useTheme();

  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterHolidayDelete", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className} title="Delete Holiday">
      <IconTrash color={theme.palette.error.main} className="h-4 w-4 " />
    </button>
  );
};
MasterHolidayDelete.page = "Holiday";
// ---------------------------Teacher------------------------------
// ----------Teacher

export const TeacherTeacherListCreate = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "TeacherTeacherListCreate", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      <Plus className="h-4 w-4 " />
      Teacher
    </button>
  );
};
TeacherTeacherListCreate.page = "Teacher List";
export const TeacherTeacherListEdit = ({ onClick, className }) => {
  const theme = useTheme();

  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "TeacherTeacherListEdit", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className} title="Edit Teacher List">
      <IconEdit color={theme.palette.primary.icon} className="h-4 w-4" />
    </button>
  );
};
TeacherTeacherListEdit.page = "Teacher List";
export const TeacherTeacherListView = ({ onClick, className }) => {
  const theme = useTheme();

  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "TeacherTeacherListView", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className} title="View Teacher List">
      <Eye color={theme.palette.primary.icon} className="h-4 w-4" />
    </button>
  );
};
TeacherTeacherListView.page = "Teacher List";

//-----------T Attendance List

export const TeacherAttendanceListCreate = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (
    !checkPermission(userId, "TeacherAttendanceListCreate", staticPermissions)
  ) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      <Plus className="h-4 w-4 " />
      Attendance
    </button>
  );
};
TeacherAttendanceListCreate.page = "T Attendance List";
export const TeacherAttendanceListDelete = ({ onClick, className }) => {
  const theme = useTheme();

  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (
    !checkPermission(userId, "TeacherAttendanceListDelete", staticPermissions)
  ) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className={className}
      title="Delete Teacher Attendance"
    >
      <IconTrash color={theme.palette.error.main} className="h-4 w-4" />
    </button>
  );
};
TeacherAttendanceListDelete.page = "T Attendance List";
// ---------------T Attendance

export const TeacherAttendanceView = ({ onClick, className, loading }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "TeacherAttendanceView", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      {loading ? "Loading..." : "View"}
    </button>
  );
};
TeacherAttendanceView.page = "T Attendance";
// -------------------------Student------------------------------------
// ----All Student

export const StudentAllStudentCreate = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "StudentAllStudentCreate", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      <Plus className="h-4 w-4 " />
      Student
    </button>
  );
};
StudentAllStudentCreate.page = "All Student";
export const StudentAllStudentEdit = ({ onClick, className }) => {
  const theme = useTheme();

  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "StudentAllStudentEdit", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className} title="Edit Student">
      <IconEdit color={theme.palette.primary.icon} className="h-4 w-4" />
    </button>
  );
};
StudentAllStudentEdit.page = "All Student";
export const StudentAllStudentView = ({ onClick, className }) => {
  const theme = useTheme();

  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "StudentAllStudentView", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className} title="View Student">
      <Eye color={theme.palette.primary.icon} className="h-4 w-4" />
    </button>
  );
};
StudentAllStudentView.page = "All Student";
/////----------- Attendance List

export const StudentAttendanceListCreate = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (
    !checkPermission(userId, "StudentAttendanceListCreate", staticPermissions)
  ) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      <Plus className="h-4 w-4 " />
      Attendance
    </button>
  );
};
StudentAttendanceListCreate.page = "Attendance List";
export const StudentAttendanceListDelete = ({ onClick, className }) => {
  const theme = useTheme();

  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (
    !checkPermission(userId, "StudentAttendanceListDelete", staticPermissions)
  ) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className={className}
      title="Delete Student Attendance"
    >
      <IconTrash color={theme.palette.error.main} className="h-4 w-4" />
    </button>
  );
};
StudentAttendanceListDelete.page = "Attendance List";

/////----------- Attendance List View
export const StudentAttendanceView = ({ onClick, className, loading }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "StudentAttendanceView", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      {loading ? "Loading..." : "View"}
    </button>
  );
};
StudentAttendanceView.page = "Attendance";
// --Fesss
export const StudentFeesCreate = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "StudentFeesCreate", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      <Plus className="h-4 w-4 " />
      Fees
    </button>
  );
};
StudentFeesCreate.page = "Fees";

export const StudentFeesEdit = ({ onClick, className }) => {
  const theme = useTheme();

  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "StudentFeesEdit", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className} title=" Edit Pending Fees">
      <IconEdit color={theme.palette.primary.icon} className="h-4 w-4" />
    </button>
  );
};
StudentFeesEdit.page = "Fees";

// -----------------------Time Tabel
// ------------Class
export const ClassTimeTablePrint = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "ClassTimeTablePrint", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      <IconPrinter className="h-4 w-4 " />
      Print
    </button>
  );
};
ClassTimeTablePrint.page = "Class";
// ---------------Teacher
export const TeacherTimeTablePrint = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "TeacherTimeTablePrint", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      <IconPrinter className="h-4 w-4 " />
      Print
    </button>
  );
};
TeacherTimeTablePrint.page = "Teacher";
// -----------------------------Report------------------------
// ---------------------->Student R
export const ReportStudentAll = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "ReportStudentAll", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      All Student
    </button>
  );
};
ReportStudentAll.page = "Student R";
export const ReportStudentCurrent = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "ReportStudentCurrent", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      Current Student
    </button>
  );
};
ReportStudentCurrent.page = "Student R";
// ---------------------------->Teacher R
export const ReportTeacherDownload = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "ReportTeacherDownload", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      Download
    </button>
  );
};
ReportTeacherDownload.page = "Teacher R";
// ---------------------------->Pending Fees
export const ReportPendingFeesDownload = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (
    !checkPermission(userId, "ReportPendingFeesDownload", staticPermissions)
  ) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      Download
    </button>
  );
};
ReportPendingFeesDownload.page = "Pending Fees";
export const ReportPendingFeesView = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "ReportPendingFeesView", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      View
    </button>
  );
};
ReportPendingFeesView.page = "Pending Fees";
export default {
  MasterSubjectCreate,
  MasterHolidayCreate,
  MasterHolidayEdit,
  MasterHolidayDelete,
  TeacherTeacherListCreate,
  TeacherTeacherListEdit,
  TeacherTeacherListView,
  TeacherAttendanceListCreate,
  TeacherAttendanceListDelete,
  TeacherAttendanceView,
  StudentAllStudentCreate,
  StudentAllStudentEdit,
  StudentAllStudentView,
  StudentAttendanceListCreate,
  StudentAttendanceListDelete,
  StudentAttendanceView,
  StudentFeesCreate,
  StudentFeesEdit,
  ClassTimeTablePrint,
  TeacherTimeTablePrint,
  ReportStudentAll,
  ReportStudentCurrent,
  ReportTeacherDownload,
  ReportPendingFeesDownload,
  ReportPendingFeesView,
};
