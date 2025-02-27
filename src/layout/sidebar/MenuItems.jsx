import {
  IconCalendarCheck,
  IconTablePlus,
  IconUserQuestion,
  IconWorld,
} from "@tabler/icons-react";
import {
  IconLayoutDashboard,
  IconUsers,
  IconDownload,
  IconBuilding,
  IconPin,
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

import { uniqueId } from "lodash";

const Menuitems = () => [
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/home",
  },

  //master
  {
    id: uniqueId(),
    title: "Master",
    icon: IconUserCog,
    subItems: [
      {
        id: uniqueId(),
        title: "Subject",
        icon: IconBook,
        href: "/subject-list",
      },
      {
        id: uniqueId(),
        title: "Holiday",
        icon: IconCalendarWeek,
        href: "/holiday-list",
      },
      {
        id: uniqueId(),
        title: "Fees Structure",
        icon: IconFileReport,
        href: "/feesStructure-list",
      },
    ],
  },

  //techer
  {
    id: uniqueId(),
    title: "Teacher",
    icon: IconUsers,
    subItems: [
      {
        id: uniqueId(),
        title: "Teacher List",
        icon: IconUsers,
        href: "/teacher-list",
      },
      {
        id: uniqueId(),
        title: "Attendance List",
        icon: IconListDetails,
        href: "/teacher-attendance-list",
      },
      {
        id: uniqueId(),
        title: "Attendance",
        icon: IconEye,
        href: "/teacher-viewAttendance",
      },
    ],
  },
  //students
  {
    id: uniqueId(),
    title: "Student",
    icon: IconUsersGroup,
    subItems: [
      {
        id: uniqueId(),
        title: "All Student",
        icon: IconUsersGroup,
        href: "/student-list",
      },
      {
        id: uniqueId(),
        title: "Current Student",
        icon: IconUsersGroup,
        href: "/current-student-list",
      },
      {
        id: uniqueId(),
        title: "Attendance List ",
        icon: IconListDetails,
        href: "/attendance-list",
      },
      {
        id: uniqueId(),
        title: "Attendance",
        icon: IconEye,
        href: "/attendance-list/viewAttendance",
      },
      {
        id: uniqueId(),
        title: "Pending Fees",
        icon: IconClipboardData,
        href: "/pending-fees",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Time Table",
    icon: IconTablePlus,
    subItems: [
      {
        id: uniqueId(),
        title: "Class",
        icon: IconTablePlus,
        href: "/timetable",
      },
      {
        id: uniqueId(),
        title: "Teacher",
        icon: IconTablePlus,
        href: "/teacher-timetable",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Website",
    icon: IconWorld,
    subItems: [
      {
        id: uniqueId(),
        title: "Enquiry",
        icon: IconUserQuestion,
        href: "/website-list/enquiry",
      },
      {
        id: uniqueId(),
        title: "Contact",
        icon: IconCalendarCheck,
        href: "/website-list/contact",
      },
    ],
  },

  {
    id: uniqueId(),
    title: "Download",
    icon: IconDownload,
    subItems: [
      {
        id: uniqueId(),
        title: "Student",
        icon: IconDownload,
        href: "/download-report",
      },
      {
        id: uniqueId(),
        title: "Teacher",
        icon: IconDownload,
        href: "/teacher-timetable",
      },
    ],
  },
];

export default Menuitems;
