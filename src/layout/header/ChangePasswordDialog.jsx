import React from "react";
import { Button, Dialog, DialogContent, IconButton, Slide } from "@mui/material";
import { IconX } from "@tabler/icons-react";

const ChangePasswordDialog = ({
  open,
  handleClose,
  setForgotPassword,
  forgotpassword,
  onChangePassword,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(value);

    setForgotPassword((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };
  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-blue-500";

  // console.log("ProfileDialog open state:", open);
  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      sx={{ backdropFilter: "blur(4px)" }}
      TransitionComponent={Slide} 
      transitionDuration={500}
    >
      {" "}
      <DialogContent>
        <div className="mt-2 p-4">
          <div className="mb-4 flex justify-between">
            <h3 className="font-bold text-2xl">Change Password</h3>
            <div className="font-bold">
              <IconButton edge="end" onClick={handleClose}>
                <IconX />
              </IconButton>
            </div>
          </div>
          <div className="grid grid-col-1 gap-6 mb-4">
            <div>
              <FormLabel required>Old Password</FormLabel>
              <input
                required
                name="old_password"
                value={forgotpassword.old_password}
                onChange={handleChange}
                fullWidth
                className={inputClass}
              />
            </div>
            <div>
              <FormLabel required>New Password</FormLabel>
              <input
                required
                name="password"
                value={forgotpassword.password}
                onChange={handleChange}
                fullWidth
                className={inputClass}
              />
            </div>
            <div>
              <FormLabel required>Conform Password</FormLabel>
              <input
                required
                name="conformpassword"
                value={forgotpassword.conformpassword}
                onChange={handleChange}
                fullWidth
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-5 flex justify-center">
            <Button
              onClick={onChangePassword}
              variant="contained"
              color="primary"
              className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse  h-15 p-2 rounded-lg shadow-md mr-2"
            >
              Change Password
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
