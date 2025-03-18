import React, { useEffect } from "react";
import getMenuItems from "./MenuItems";
import { Box, List } from "@mui/material";
import { useLocation } from "react-router-dom";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup/NavGroup";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentOpenItem } from "../../redux/store/uiSlice";

const SidebarItems = ({ toggleMobileSidebar, isCollapsed }) => {
  const location = useLocation();
  const pathDirect = location.pathname;
  const userTypeId = useSelector((state) => state.auth?.user?.user_type) || "";
  const MenuData = getMenuItems(userTypeId);

  const dispatch = useDispatch();
  const currentOpenItem = useSelector((state) => state.ui.currentOpenItem);

  useEffect(() => {
    if (!currentOpenItem) {
      dispatch(setCurrentOpenItem(pathDirect));
    }
  }, [dispatch, pathDirect, currentOpenItem]);

  const handleItemClick = (item) => {
    dispatch(setCurrentOpenItem(item));
  };

  return (
    <Box sx={{ px: "20px" }}>
      <List sx={{ pt: 0 }} className="sidebarNav" component="div">
        {MenuData.map((item) => {
          if (item.subheader) {
            return (
              <NavGroup
                item={item}
                key={item.subheader}
                isCollapsed={isCollapsed}
              />
            );
          } else {
            return (
              <NavItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                onClick={toggleMobileSidebar}
                isCollapsed={isCollapsed}
                currentOpenItem={currentOpenItem}
                handleItemClick={handleItemClick}
              />
            );
          }
        })}
      </List>
    </Box>
  );
};

export default SidebarItems;
