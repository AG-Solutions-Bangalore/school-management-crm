import {
  Avatar,
  Box,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { IconMail } from "@tabler/icons-react";
import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import profile from "../../../public/user-1.jpg";
import BASE_URL from "../../base/BaseUrl";
import { ChangePassword } from "../../components/common/UseApi";
import useApiToken from "../../components/common/useApiToken";
import Logout from "../../components/Logout";
import ChangePasswordDialog from "./ChangePasswordDialog";

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenLogout = () => setOpenModal(!openModal);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog1, setOpenDialog1] = useState(false);
  const token = useApiToken();
  const name = useSelector((state) => state.auth.user.name);

  const [profileData, setProfileData] = useState({
    full_name: "",
    dl_no: "",
    mobile: "",
    dl_expiry: "",
    email: "",
    hazard_lice_no: "",
    vehicle_type: "",
    hazard_lice_expiry: "",
    user_address: "",
  });
  const [forgotpassword, setForgotPassword] = useState({
    old_password: "",
    password: "",
    conformpassword: "",
  });
  const getData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/web-fetch-profiles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfileData(res.data.user);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile data");
    }
  };

  const onUpdateProfile = async (e) => {
    e.preventDefault();

    setIsButtonDisabled(true);
    const data = {
      first_name: profileData.full_name,
      vehicle_type: profileData.vehicle_type,
      user_address: profileData.user_address,
      dl_no: profileData.dl_no,
      dl_expiry: profileData.dl_expiry,
      hazard_lice_no: profileData.hazard_lice_no,
      hazard_lice_expiry: profileData.hazard_lice_expiry,
    };
    try {
      const res = await axios.post(`${BASE_URL}/api/web-update-profile`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        toast.success("Profile Updated Successfully!");
        handleClose();
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Profile not updated");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    if (forgotpassword.password !== forgotpassword.conformpassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (forgotpassword.old_password === forgotpassword.password) {
      toast.error("Old and new passwords cannot be the same");
      return;
    }
    let data = {
      old_password: forgotpassword.old_password,
      password: forgotpassword.password,
      username: name,
    };
    try {

      const respose = await ChangePassword(data, token);
      toast.success("Password Updated Successfully!");

      handleClose1();
    } catch (error) {
      console.error("Password change failed:", error);
      toast.error("Invalid old password");
    }
  };

  const handleClose = () => setOpenDialog(false);
  const handleClose1 = () => setOpenDialog1(false);

  return (
    <Box>
      <IconButton
        size="large"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        onClick={(e) => setAnchorEl2(e.currentTarget)}
      >
        <Avatar src={profile} alt="profile" sx={{ width: 35, height: 35 }} />
      </IconButton>
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        open={Boolean(anchorEl2)}
        onClose={() => setAnchorEl2(null)}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{ "& .MuiMenu-paper": { width: "200px" } }}
      >
        {/* <MenuItem
          onClick={() => {
            console.log("Opening Profile Dialog...");
            setOpenDialog(true);
            getData();
            setAnchorEl2(null);
          }}
        >
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem> */}
        <MenuItem
          // onClick={() => setOpenDialog1(true)}
          onClick={() => {
            console.log("Opening Profile Dialog...");
            setOpenDialog1(true);
            setAnchorEl2(null);
          }}
        >
          <ListItemIcon>
            <IconMail width={20} />
          </ListItemIcon>
          <ListItemText>Change Password</ListItemText>
        </MenuItem>
        <Box mt={1} py={1} px={2}>
          <Button
            onClick={handleOpenLogout}
            variant="outlined"
            color="primary"
            fullWidth
          >
            Logout
          </Button>
        </Box>
      </Menu>
      <Logout open={openModal} handleOpen={handleOpenLogout} />
      {/* Profile Dialog */}
      <ChangePasswordDialog
        setForgotPassword={setForgotPassword}
        open={openDialog1}
        handleClose={handleClose1}
        forgotpassword={forgotpassword}
        onChangePassword={onChangePassword}
      ></ChangePasswordDialog>
    </Box>
  );
};

export default Profile;
