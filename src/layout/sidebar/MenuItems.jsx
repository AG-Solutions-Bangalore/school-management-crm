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
  // {
  //   navlabel: true,
  //   subheader: "Home",
  // },
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/home",
  },
  // {
  //   navlabel: true,
  //   subheader: "Operation",
  // },

  // {
  //   id: uniqueId(),
  //   title: "Master",
  //   icon: IconUsers,
  //   subItems: [
  //     {
  //       id: uniqueId(),
  //       title: "Comapany",
  //       icon: IconBuilding,
  //       href: "/master/company-list",
  //     },
  //     {
  //       id: uniqueId(),
  //       title: "Branch",
  //       icon: IconPin,
  //       href: "/master/branch-list",
  //     },
  //     {
  //       id: uniqueId(),
  //       title: "Tyre Position",
  //       icon: IconCircleDot,
  //       href: "/master/tyreposition-list",
  //     },
  //     {
  //       id: uniqueId(),
  //       title: "Tyre Make",
  //       icon: IconCircleDot,
  //       href: "/master/tyremake-list",
  //     },
  //     {
  //       id: uniqueId(),
  //       title: "Service Type",
  //       icon: IconTool,
  //       href: "/master/servicetype-list",
  //     },
  //     {
  //       id: uniqueId(),
  //       title: "Team",
  //       icon: IconUsers,
  //       href: "/master/team-list",
  //     },
  //     {
  //       id: uniqueId(),
  //       title: "Driver",
  //       icon: IconUsers,
  //       href: "/master/driver-list",
  //     },
  //     {
  //       id: uniqueId(),
  //       title: "Agencies",
  //       icon: IconUsers,
  //       href: "/master/agencies-list",
  //     },
  //     {
  //       id: uniqueId(),
  //       title: "Vendor",
  //       icon: IconUsers,
  //       href: "/master/vendor-list",
  //     },
  //   ],
  // },
  {
    id: uniqueId(),
    title: "Holiday",
    icon: IconTruck,
    href: "/holiday-list",
  },
 
  {
    id: uniqueId(),
    title: "Subject",
    icon: IconTool,
    href: "/subject-list",
  },
  {
    id: uniqueId(),
    title: "Teacher",
    icon: IconTool,
    href: "/teacher-list",
  },
  {
    id: uniqueId(),
    title: "Student",
    icon: IconTool,
    href: "/student-list",
  },
 
 
];

export default Menuitems;
