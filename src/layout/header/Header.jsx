import React, { useState ,useEffect} from "react";
import { Box, AppBar, Toolbar, styled, Stack, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import Profile from "./Profile";
import { IconMenu, IconMenuDeep } from "@tabler/icons-react";

const YearSelector = () => {
  const [years, setYears] = useState([]);
   const [selectedYear, setSelectedYear] = useState("");
 
   useEffect(() => {
     const storedYears = localStorage.getItem("years");
     if (storedYears) {
       setYears(JSON.parse(storedYears));
     }
 
     const defaultYear = localStorage.getItem("default_year");
     if (defaultYear) {
       setSelectedYear(defaultYear);
     }
   }, []);
   const handleYearChange = (event) => {
     const newYear = event.target.value;
     setSelectedYear(newYear);
     localStorage.setItem("default_year", newYear);
   };

  return (
    <select
      id="year-select"
      value={selectedYear}
      onChange={handleYearChange}
      required
      className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-500 min-h-[35px]"
    >
      <option value="">Select Year</option>
      {years.map((yearObj) => (
        <option key={yearObj.year_list} value={yearObj.year_list}>
          {yearObj.year_list}
        </option>
      ))}

    </select>
  );
};

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
              <YearSelector />
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
