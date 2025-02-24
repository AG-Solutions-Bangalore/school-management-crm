


import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { toast } from "sonner";

const Footer = () => {
  const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [open, setOpen] = useState(false);
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
    setSelectedYear(event.target.value);
  };

  const handleSubmit = () => {
    localStorage.setItem("default_year", selectedYear);
   
   
    window.location.href = "/home"; 
    toast.success("Year has been changed");
  };
  return (
   <div className="bg-white rounded-lg shadow-sm p-4">
         <div className="flex flex-row items-center justify-between">
           <h2 className="text-xs text-gray-600">
             Current Year: {localStorage.getItem("default_year")}
           </h2>
           <button
             onClick={() => setOpen(true)}
             className="text-blue-800 text-xs underline cursor-pointer"
           >
             Change Year
           </button>
           <p className="text-gray-500 text-sm">
                Handcrafted with ❤️ by
                <Link to="https://ag-solutions.in/" target="_blank" className="text-blue-600 font-medium ml-1">
                  AG Solutions
                </Link>
              </p>
         </div>
   
         {/* Year Change Dialog */}
         <Dialog open={open} onClose={() => setOpen(false)}>
           <DialogTitle>Select a Year</DialogTitle>
           <DialogContent>
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
           </DialogContent>
           <DialogActions>
             <Button onClick={() => setOpen(false)}>Cancel</Button>
             <Button onClick={handleSubmit} color="primary" variant="contained">
               Submit
             </Button>
           </DialogActions>
         </Dialog>
       </div>
  );
};

export default Footer;