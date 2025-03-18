import React, { useContext, useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../../base/BaseUrl";
import axios from "axios";
import { toast } from "sonner";
import { IconArrowBack, IconInfoCircle, IconX } from "@tabler/icons-react";
import { decryptId } from "../../components/common/EncryptionDecryption";
import { Dialog, DialogContent, IconButton, Slide } from "@mui/material";
import {
  BackButton,
  CreateButton,
} from "../../components/common/ButttonConfig";
import {
  FETCH_HOLIDAY_ID,
  HOLIDAY_LIST,
  UPDATE_HOLIDAY,
} from "../../components/common/UseApi";
import { ContextPanel } from "../../context/ContextPanel";
import useApiToken from "../../components/common/useApiToken";
const EditHoliday = ({
  openEditDialog,
  setOpenEditDialog,
  editId,
  setHolidayData,
}) => {
  const id = editId;

  const token = useApiToken();
  const { selectedYear } = useContext(ContextPanel);

  const [holiday, setHoliday] = useState({
    holiday_for: "",
    holiday_date: "",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchEditHolidayData = async () => {
    try {
      setLoading(true);
      const data = await FETCH_HOLIDAY_ID(id, token);
      if (data) {
        setHoliday(data.holidayList);
      }
    } catch (error) {
      console.error("Error fetching holiday edit data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if ((openEditDialog, id)) {
      fetchEditHolidayData();
    }
  }, [openEditDialog, id]);
  const handleClose = () => {
    setOpenEditDialog(false);
    setHoliday({
      holiday_for: "",
      holiday_date: "",
    });
  };
  const onInputChange = (e) => {
    setHoliday({
      ...holiday,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = document.getElementById("addIndiv");
    if (!form.checkValidity()) {
      toast.error("Fill all required");
      setIsButtonDisabled(false);
      return;
    }

    const data = {
      holiday_date: holiday.holiday_date,
      holiday_for: holiday.holiday_for,
    };

    setIsButtonDisabled(true);
    const response = await UPDATE_HOLIDAY(id, data);

    if (response.code === 200) {
      toast.success(response.msg);
      handleClose();
      await HOLIDAY_LIST(selectedYear).then((holidays) => {
        setHolidayData(holidays.holidayList);
      });
      setIsButtonDisabled(false);
    } else if (response.code === 400) {
      toast.error(response.msg);
    }
  };
  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-500";
  return (
    <>
      <Dialog
        open={openEditDialog}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        sx={{ backdropFilter: "blur(4px)" }}
        TransitionComponent={Slide}
        transitionDuration={500}
      >
        <div className=" bg-[#FFFFFF] p-2  rounded-lg  ">
          <DialogContent>
            <div className="mb-4 flex justify-between">
              <h3 className="font-bold text-xl">Edit Attendance</h3>
              <IconButton edge="end" onClick={handleClose}>
                <IconX />
              </IconButton>
            </div>
            <form
              onSubmit={handleSubmit}
              id="addIndiv"
              className="w-full   rounded-lg mx-auto p-4 space-y-6 "
            >
              <div className="grid grid-cols-1  md:grid-cols-2  gap-6">
                {/* present Date  */}
                <div>
                  <FormLabel required>Holiday Date</FormLabel>
                  <input
                    type="date"
                    name="holiday_date"
                    value={holiday?.holiday_date || ""}
                    onChange={(e) => onInputChange(e)}
                    className={inputClass}
                    required
                  />
                </div>
                {/* Holiday For  */}
                <div>
                  <FormLabel required>Holiday For</FormLabel>
                  <input
                    type="text"
                    name="holiday_for"
                    value={holiday?.holiday_for || ""}
                    onChange={(e) => onInputChange(e)}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  type="submit"
                  className={CreateButton}
                  disabled={isButtonDisabled}
                >
                  {isButtonDisabled ? "Updating..." : "Update"}
                </button>

                <button
                  type="button"
                  className={BackButton}
                  onClick={handleClose}
                >
                  Back
                </button>
              </div>
            </form>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
};

export default EditHoliday;
