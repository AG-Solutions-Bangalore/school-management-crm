import {
  IconLayoutDashboard,
  IconUsers,
  IconDownload,
  IconWorld,
  IconTablePlus,
  IconCalendarCheck,
  IconCalendarWeek,
  IconFileReport,
  IconBook,
  IconUserCog,
  IconListDetails,
  IconSettings,
  IconEye,
  IconUsersGroup,
  IconClipboardData,
  IconReport,
  IconUserQuestion,
} from "@tabler/icons-react";
import menuItems from "../../json/menuItems.json";

const iconComponents = {
  Dashboard: IconLayoutDashboard,
  Master: IconUserCog,
  "User Management": IconLayoutDashboard,
  Subject:IconBook,
  Holiday:IconCalendarWeek,
  "Fees Structure":IconFileReport,
  Teacher:IconUsers,
  "Teacher List":IconUsers,
  "T Attendance List":IconListDetails,
  "T Attendance":IconEye,
  Student:IconUsersGroup,
  "All Student":IconUsersGroup,
  "Current Student":IconUsersGroup,
  "Attendance List":IconListDetails,
  Attendance:IconEye,
  Fees:IconClipboardData,
  "Fees Summary":IconClipboardData,
  "Time Table":IconTablePlus,
  Class:IconTablePlus,
  Website:IconWorld,
  Enquiry:IconUserQuestion,
  Contact:IconCalendarCheck,
  Report:IconReport,
  "Student R":IconDownload,
  "Teacher R":IconDownload,
  "Pending Fees":IconClipboardData,
};

const isItemAllowed = (item, pageControl, userId) => {
  const itemHref = item.href?.replace(/^\//, ""); 

  return pageControl.some((control) => {
    return (
      control.page === item.title &&
      control.url === itemHref &&
      control.userIds.includes(userId) &&
      control.status === "Active"
    );
  });
};

const filterMenuItems = (items, pageControl, userId) => {
  if (!items) return [];

  return items.reduce((acc, item) => {
    if (item.subItems) {
      const filteredSubItems = filterMenuItems(
        item.subItems,
        pageControl,
        userId
      );
      if (filteredSubItems.length > 0) {
        acc.push({
          ...item,
          subItems: filteredSubItems,
        });
      }
    } else if (isItemAllowed(item, pageControl, userId)) {
      acc.push(item);
    }
    return acc;
  }, []);
};

const mapItems = (items) => {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    icon: iconComponents[item.title] || IconSettings,
    href: item.href || undefined,
    subItems: item.subItems ? mapItems(item.subItems) : undefined,
  }));
};

const MenuItems = () => {
  const pageControl = JSON.parse(localStorage.getItem("pageControl") || "[]");
  const userId = localStorage.getItem("id");

  const filteredItems = filterMenuItems(menuItems, pageControl, userId);

  return mapItems(filteredItems);
};

export default MenuItems;