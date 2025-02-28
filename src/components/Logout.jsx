import {
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Slide,
} from "@mui/material";
import { IconX } from "@tabler/icons-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { BackButton, CreateButton } from "./common/ButttonConfig";

const Logout = ({ open, handleOpen }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      TransitionComponent={Slide}
      transitionDuration={500}
      maxWidth="sm"
      fullWidth
      sx={{ backdropFilter: "blur(4px)", padding: "10px" }}
    >
      <DialogContent>
        <div className="mb-4 flex justify-between">
          <h2 className="font-bold text-2xl">Confirm Logout</h2>
          <IconButton edge="end" onClick={handleOpen}>
            <IconX />
          </IconButton>
        </div>
        <h3 className="text-lg">Are you sure you want to log out?</h3>
      </DialogContent>
      <DialogActions>
        <button className={BackButton} onClick={handleOpen}>
          <span>Cancel</span>
        </button>
        <button className={CreateButton} onClick={handleLogout}>
          <span>Confirm</span>
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default Logout;
