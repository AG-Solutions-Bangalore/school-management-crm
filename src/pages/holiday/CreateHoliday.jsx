import { Dialog, DialogContent, IconButton, Slide } from "@mui/material";
import { IconX } from "@tabler/icons-react";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  BackButton,
  CreateButton,
} from "../../components/common/ButttonConfig";
import { createHoliday, fetchHolidays } from "../../components/common/UseApi";
import { ContextPanel } from "../../context/ContextPanel";

const CreateHoliday = ({
  setCreateDialogOpen,
  createDialogOpen,
  setHolidayData,
}) => {
  const navigate = useNavigate();
  const [holiday, setHoliday] = useState({
    holiday_for: "",
    holiday_date: "",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { selectedYear } = useContext(ContextPanel);

  const onInputChange = (e) => {
    setHoliday({
      ...holiday,
      [e.target.name]: e.target.value,
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const form = document.getElementById("addIndiv");
  //   if (!form.checkValidity()) {
  //     toast.error("Fill all required");
  //     setIsButtonDisabled(false);

  //     return;
  //   }
  //   const data = {
  //     holiday_date: holiday.holiday_date,
  //     holiday_for: holiday.holiday_for,
  //   };

  //   setIsButtonDisabled(true);
  //   axios({
  //     url: BASE_URL + "/api/panel-create-holiday-list",
  //     method: "POST",
  //     data,
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //   }).then((res) => {
  //     if (res.data.code == 200) {
  //       toast.success(res.data.msg);
  //       setCreateDialogOpen(false);
  //       fetchHolidayData();
  //       setHoliday({
  //         holiday_date: "",
  //         holiday_for: "",
  //       });
  //     } else if (res.data.code == 400) {
  //       toast.error(res.data.msg);
  //     }
  //     setHoliday({
  //       holiday_date: "",
  //       holiday_for: "",
  //     });
  //   });
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = document.getElementById("addIndiv");
    if (!form.checkValidity()) {
      toast.error("Fill all required fields");
      setIsButtonDisabled(false);
      return;
    }

    const data = {
      holiday_date: holiday.holiday_date,
      holiday_for: holiday.holiday_for,
    };

    setIsButtonDisabled(true);

    try {
      const response = await createHoliday(data);

      if (response.code === 200) {
        toast.success(response.msg);
        setCreateDialogOpen(false);
        const updatedHolidays = await fetchHolidays(selectedYear);
        setHolidayData(updatedHolidays.holidayList);
      } else {
        toast.error(response.msg);
      }
    } catch (error) {
      toast.error("Failed to create holiday");
    } finally {
      setHoliday({
        holiday_date: "",
        holiday_for: "",
      });
      setIsButtonDisabled(false);
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
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        sx={{ backdropFilter: "blur(4px)" }}
        TransitionComponent={Slide}
        transitionDuration={500}
      >
        <DialogContent>
          <div className=" bg-[#FFFFFF] p-2  rounded-lg  ">
            <div className="mb-4 flex justify-between">
              <h3 className="font-bold text-xl">Create Holiday </h3>
              <IconButton edge="end" onClick={() => setCreateDialogOpen(false)}>
                <IconX />
              </IconButton>
            </div>

            <form
              onSubmit={handleSubmit}
              id="addIndiv"
              className="w-full   rounded-lg mx-auto p-4 space-y-6 "
            >
              <div className="grid grid-cols-1  md:grid-cols-2   gap-6">
                {/* present Date  */}
                <div>
                  <FormLabel required>Holiday Date</FormLabel>
                  <input
                    type="date"
                    name="holiday_date"
                    value={holiday.holiday_date}
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
                    value={holiday.holiday_for}
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
                  {isButtonDisabled ? "Creating..." : "Create"}
                </button>

                <button
                  type="button"
                  className={BackButton}
                  onClick={() => setCreateDialogOpen(false)}
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
    // </Layout>
  );
};

export default CreateHoliday;
