import React, { useState } from "react";
import { Box, AppBar, Toolbar, styled, Stack, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import Profile from "./Profile";
import { IconMenu, IconMenuDeep } from "@tabler/icons-react";

const Header = ({ toggleMobileSidebar, toggleSidebar }) => {
  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: theme.palette.background.paper,
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    borderRadius: 13,
    [theme.breakpoints.up("lg")]: {
      minHeight: "70px",
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: "none",
              xs: "inline",
            },
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
          sx={{
            display: {
              lg: "inline",
              xs: "none",
            },
          }}
        >
          <IconMenuDeep width="20" height="20" />
        </IconButton>

        <Box flexGrow={1} />

        <Stack spacing={1} direction="row" alignItems="center">
          <div className="flex  flex-row items-center justify-between ">
            <div className="flex flex-col text-[10px] md:text-xs">
              <div className="font-semibold text-blue-700">
                {localStorage.getItem("name")}
              </div>
              <div className="font-semibold text-blue-700 text-[10px] flex justify-center">
                {" "}
                {localStorage.getItem("user_position")}
              </div>
            </div>

            <Profile />
          </div>
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
