import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../../base/BaseUrl";
import axios from "axios";
import { toast } from "sonner";
import { IconArrowBack, IconInfoCircle, IconX } from "@tabler/icons-react";
import { decryptId } from "../../components/common/EncryptionDecryption";
import { Dialog, DialogContent, IconButton, Slide } from "@mui/material";
const EditHoliday = ({
  openEditDialog,
  setOpenEditDialog,
  editId,
  fetchHolidayData,
}) => {
  const id = editId;

  const navigate = useNavigate();
  const [holiday, setHoliday] = useState({
    holiday_for: "",
    holiday_date: "",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const fetchEditHolidayData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-holiday-list-by-id/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHoliday(response.data?.holidayList);
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
    axios({
      url: BASE_URL + `/api/panel-update-holiday-list/${id}`,
      method: "PUT",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.code == 200) {
        toast.success(res.data.msg);
        handleClose();
        fetchHolidayData();
        setIsButtonDisabled(false);
      } else if (res.data.code == 400) {
        toast.error(res.data.msg);
      }
      navigate("/holiday-list");
    });
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
                  className="text-center text-sm font-[400] cursor-pointer  w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                  disabled={isButtonDisabled}
                >
                  {isButtonDisabled ? "Updating..." : "Update"}
                </button>

                <button
                  type="button"
                  className="text-center text-sm font-[400] cursor-pointer  w-36 text-white bg-red-600 hover:bg-red-400 p-2 rounded-lg shadow-md"
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
