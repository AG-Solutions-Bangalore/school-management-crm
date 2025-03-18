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
import { toast } from "sonner";
import { BackButton, CreateButton } from "./common/ButttonConfig";
import { LogoutApi } from "./common/UseApi";
import { useDispatch } from "react-redux";
import { logout } from "../redux/store/authSlice";
import { persistor } from "../redux/store/store";
import useApiToken from "./common/useApiToken";
const Logout = ({ open, handleOpen }) => {
  const navigate = useNavigate();

  const token = useApiToken();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      const res = await LogoutApi(token);
      if (res.code == "200") {
        toast.success(res.msg);

        await persistor.flush();
        localStorage.clear();
        dispatch(logout());
        navigate("/");
        setTimeout(() => persistor.purge(), 1000);
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
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
