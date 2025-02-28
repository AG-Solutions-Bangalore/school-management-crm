import {
  IconCalendarCheck,
  IconReport,
  IconTablePlus,
  IconUserQuestion,
  IconWorld,
} from "@tabler/icons-react";
import {
  IconLayoutDashboard,
  IconUsers,
  IconDownload,
  IconTool,
  IconCalendarWeek,
  IconFileReport,
  IconBook,
  IconUserCog,
  IconListDetails,
  IconEye,
  IconUsersGroup,
  IconClipboardData,
} from "@tabler/icons-react";

const Menuitems = () => [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/home",
  },

  //master
  {
    id: "master",
    title: "Master",
    icon: IconUserCog,
    subItems: [
      {
        id: "subject",
        title: "Subject",
        icon: IconBook,
        href: "/subject-list",
      },
      {
        id: "holiday",
        title: "Holiday",
        icon: IconCalendarWeek,
        href: "/holiday-list",
      },
      {
        id: "feesStructure",
        title: "Fees Structure",
        icon: IconFileReport,
        href: "/feesStructure-list",
      },
    ],
  },

  //techer
  {
    id: "teacher",
    title: "Teacher",
    icon: IconUsers,
    subItems: [
      {
        id: "teacherlist",
        title: "Teacher List",
        icon: IconUsers,
        href: "/teacher-list",
      },
      {
        id: "teacherattendance",
        title: "Attendance List",
        icon: IconListDetails,
        href: "/teacher-attendance-list",
      },
      {
        id: "teacherattendanceview",
        title: "Attendance",
        icon: IconEye,
        href: "/teacher-viewAttendance",
      },
    ],
  },
  //students
  {
    id: "student",
    title: "Student",
    icon: IconUsersGroup,
    subItems: [
      {
        id: "studentlist",
        title: "All Student",
        icon: IconUsersGroup,
        href: "/student-list",
      },
      {
        id: "studentcurrentlist",
        title: "Current Student",
        icon: IconUsersGroup,
        href: "/current-student-list",
      },
      {
        id: "studentattendancelist",
        title: "Attendance List ",
        icon: IconListDetails,
        href: "/attendance-list",
      },
      {
        id: "studentattendanceview",
        title: "Attendance",
        icon: IconEye,
        href: "/attendance-list/viewAttendance",
      },
      {
        id: "studentfees",
        title: "Fees",
        icon: IconClipboardData,
        href: "/pending-fees",
      },
    ],
  },
  {
    id: "timetable",
    title: "Time Table",
    icon: IconTablePlus,
    subItems: [
      {
        id: "classtimetable",
        title: "Class",
        icon: IconTablePlus,
        href: "/timetable",
      },
      {
        id: "teachertimetable",
        title: "Teacher",
        icon: IconTablePlus,
        href: "/teacher-timetable",
      },
    ],
  },
  {
    id: "website",
    title: "Website",
    icon: IconWorld,
    subItems: [
      {
        id: "enquiry",
        title: "Enquiry",
        icon: IconUserQuestion,
        href: "/website-list/enquiry",
      },
      {
        id: "contact",
        title: "Contact",
        icon: IconCalendarCheck,
        href: "/website-list/contact",
      },
    ],
  },

  {
    id: "report",
    title: "Report",
    icon: IconReport,
    subItems: [
      {
        id: "reportstudent",
        title: "Student",
        icon: IconDownload,
        href: "/report-student/download",
      },
      {
        id: "reportteacher",
        title: "Teacher",
        icon: IconDownload,
        href: "/report-teacher/download",
      },
      {
        id: "reportfees",
        title: "Pending Fees",
        icon: IconClipboardData,
        href: "/report-pending/download",
      },
    ],
  },
];

export default Menuitems;
