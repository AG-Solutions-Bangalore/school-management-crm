import React from "react";
import { Button, Dialog, DialogContent, IconButton } from "@mui/material";
import { IconX } from "@tabler/icons-react";
import { Slide } from "@mui/material";
const ProfileDialog = ({
  open,
  handleClose,
  profile,
  setProfile,
  onUpdateProfile,
  isButtonDisabled,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(value);

    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-500";

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
      maxWidth="md"
      TransitionComponent={Slide}
      transitionDuration={500}
      sx={{
        backdropFilter: "blur(4px)",
      }}
    >
      <DialogContent>
        <div className="mt-2 p-4">
          <div className="mb-4 flex justify-between">
            <h3 className="font-bold text-2xl">Personal Details</h3>
            <div className="font-bold">
              <IconButton edge="end" onClick={handleClose}>
                <IconX />
              </IconButton>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 ">
            <div>
              <FormLabel required>Full Name</FormLabel>
              <input
                required
                name="full_name"
                value={profile.full_name}
                onChange={handleChange}
                fullWidth
                className={inputClass}
              />
            </div>
            <div>
              <FormLabel required>DL NO</FormLabel>
              <input
                required
                name="dl_no"
                value={profile.dl_no}
                onChange={handleChange}
                fullWidth
                className={inputClass}
              />
            </div>
            <div>
              <FormLabel required>Phone</FormLabel>
              <input
                required
                name="mobile"
                value={profile.mobile}
                onChange={handleChange}
                fullWidth
                disabled
                className={`${inputClass} cursor-not-allowed opacity-50`}
              />
            </div>
            <div>
              <FormLabel required>Date</FormLabel>
              <input
                required
                type="date"
                name="dl_expiry"
                value={profile.dl_expiry || ""}
                onChange={handleChange}
                fullWidth
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid  grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <FormLabel required>Email</FormLabel>
              <input
                required
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                fullWidth
                disabled
                className={`${inputClass} cursor-not-allowed opacity-50`}
              />
            </div>
            <div>
              <FormLabel required>Hazard Lice No</FormLabel>
              <input
                required
                name="hazard_lice_no"
                value={profile.hazard_lice_no}
                onChange={handleChange}
                fullWidth
                className={inputClass}
              />
            </div>
            <div>
              <FormLabel required>Vehicle</FormLabel>
              <input
                required
                name="vehicle_type"
                value={profile.vehicle_type}
                onChange={handleChange}
                fullWidth
                className={inputClass}
              />
            </div>
            <div>
              <FormLabel required>Hazard Lice No Expiry</FormLabel>
              <input
                required
                type="date"
                name="hazard_lice_expiry"
                value={profile.hazard_lice_expiry || ""}
                onChange={handleChange}
                fullWidth
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <FormLabel required>Address</FormLabel>
            <textarea
              required
              name="user_address"
              value={profile.user_address}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              className={inputClass}
            />
          </div>

          <div className="mt-5 flex justify-center ">
            <Button
              onClick={onUpdateProfile}
              variant="contained"
              color="primary"
              type="button"
              className="text-center text-sm font-[400] cursor-pointer  w-36 h-15 p-2 rounded-lg shadow-md mr-2 "
              disabled={isButtonDisabled}
            >
              Update Profile
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
