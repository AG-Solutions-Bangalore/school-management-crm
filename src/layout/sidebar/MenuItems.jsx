import {
  IconCopy,
  IconHierarchy,
  IconChartDots2,
  IconLayoutDashboard,
  IconUser,
  IconLanguage,
  IconBriefcase,
  IconMessages,
  IconTypography,
  IconCash,
  IconCardboards,
  IconUsers,
  IconReceipt,
  IconSchool,
  IconListDetails,
  IconRepeat,
  IconComponents,
  IconReport,
  IconDownload,
  IconPeace,
  IconBell,
  IconTruckDelivery,
  IconTruck,
  IconSettings,
  IconBuilding,
  IconCircleDot,
  IconPin,
  IconTool,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = () => [
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/home",
  },

  {
    id: uniqueId(),
    title: "Holiday",
    icon: IconTruck,
    href: "/holiday-list",
  },
  {
    id: uniqueId(),
    title: "Fees Structure",
    icon: IconTool,
    href: "/feesStructure-list",
  },
  {
    id: uniqueId(),
    title: "Subject",
    icon: IconTool,
    href: "/subject-list",
  },
  // {
  //   id: uniqueId(),
  //   title: "Teacher",
  //   icon: IconTool,
  //   href: "/teacher-list",
  // },
  //techer
  {
    id: uniqueId(),
    title: "Teacher",
    icon: IconUsers,
    subItems: [
      {
        id: uniqueId(),
        title: "Teacher List",
        icon: IconBuilding,
        href: "/teacher-list",
      },
      {
        id: uniqueId(),
        title: "Attendance List",
        icon: IconTool,
        href: "/teacher-attendance-list",
      },
      {
        id: uniqueId(),
        title: "View Teacher",
        icon: IconPin,
        href: "",
      },
    ],
  },
  //students
  {
    id: uniqueId(),
    title: "Student",
    icon: IconUsers,
    subItems: [
      {
        id: uniqueId(),
        title: "Student List",
        icon: IconBuilding,
        href: "/student-list",
      },
      {
        id: uniqueId(),
        title: "Current Student",
        icon: IconBuilding,
        href: "/current-student-list",
      },
      {
        id: uniqueId(),
        title: "Attendance List",
        icon: IconBuilding,
        href: "/attendance-list",
      },
      {
        id: uniqueId(),
        title: "View Attendance",
        icon: IconUsers,
        href: "/attendance-list/viewAttendance",
      },
      {
        id: uniqueId(),
        title: "Pending Fees",
        icon: IconUsers,
        href: "/pending-fees",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Website",
    icon: IconUsers,
    subItems: [
      {
        id: uniqueId(),
        title: "Enquiry",
        icon: IconBuilding,
        href: "/website-list/enquiry",
      },
      {
        id: uniqueId(),
        title: "Contact",
        icon: IconPin,
        href: "/website-list/contact",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Timetable",
    icon: IconLayoutDashboard,
    href: "/timetable",
  },
  {
    id: uniqueId(),
    title: "Teacher Timetable",
    icon: IconLayoutDashboard,
    href: "/teacher-timetable",
  },
];

export default Menuitems;
