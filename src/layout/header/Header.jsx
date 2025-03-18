import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  styled,
  Stack,
  IconButton,
  useTheme,
} from "@mui/material";
import PropTypes from "prop-types";
import Profile from "./Profile";
import { IconMenu, IconMenuDeep } from "@tabler/icons-react";
import { useSelector } from "react-redux";

const Header = ({ toggleMobileSidebar, toggleSidebar }) => {
  // const user_position = useSelector((state) => state.auth.user_position);
  // const name = useSelector((state) => state.auth.user.name);
  const user_position = useSelector(
    (state) => state.auth.user_position || null
  );

  const name = useSelector((state) => state.auth?.user?.name) || "Guest";

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
  const theme = useTheme();
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
            <div
              className={`flex flex-col text-[10px] md:text-xs text-[${theme.palette.text.secondary}]`}
            >
              <div className="font-semibold ">{name || ""}</div>
              <div className="font-semibold  text-[10px] flex justify-center">
                {" "}
                {user_position || ""}
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
