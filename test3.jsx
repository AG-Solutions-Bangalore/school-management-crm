import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";
import Select from "react-select";
const AddTrip = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const todayback = yyyy + "-" + mm + "-" + dd;
  const navigate = useNavigate();
  const [trip, setTrip] = useState({
    trip_date: todayback,
    trip_year: "2023-24",
    trip_branch: "",
    trip_company: "",
    trip_driver: "",
    vehicle_driver: "",
    trip_vehicle: "",
    trip_agency: "",
    trip_hsd: "",
    trip_advance: "",
    trip_mileage: "",
    trip_hsd_supplied: "",
    trip_supplier: "",
    trip_remarks: "",
    trip_km: "",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  //vechile no
  const [vehicles, setVehicles] = useState([]);
  const [vehiclesOtherData, setvehiclesOtherData] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [agency, setAgency] = useState([]);
  const [agenciesRT, setAgenciesRT] = useState([]);
  const [driver, setDriver] = useState([]);
  const [vehiclesDriver, setvehiclesDriver] = useState([]);
  const fetchVechile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-remaing-trip-vehicle`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVehicles(response.data?.vehicles);
    } catch (error) {
      console.error("Error fetching  trip data", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchVechileOtherData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-vehicles-other-data/${trip.trip_vehicle}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setvehiclesOtherData(response.data?.vehiclesOtherData);
    } catch (error) {
      console.error("Error fetching setvechile other  data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendor = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-vendors/Diesel/${vehiclesOtherData.vehicle_branch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVendor(response.data?.vendor);
    } catch (error) {
      console.error("Error fetching trip data", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchAgency = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-agencies/${vehiclesOtherData.vehicle_branch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAgency(response.data?.agencies);
    } catch (error) {
      console.error("Error fetching trip agency data", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchAgencyRt = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-agencies-sh-rt/${trip.trip_agency}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAgenciesRT(response.data?.agenciesRT);
    } catch (error) {
      console.error("Error fetching agency rt data", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchDriver = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-assigning-tripdriver/${vehiclesOtherData.vehicle_branch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDriver(response.data?.drivers);
    } catch (error) {
      console.error("Error fetching driver trip data", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchVechileDriver = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-vehicles-driver/${trip.trip_vehicle}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setvehiclesDriver(response.data?.vehiclesDriver);
    } catch (error) {
      console.error("Error fetching driver vechile trip data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchVechile();
  }, []);

  useEffect(() => {
    fetchVechileOtherData();
  }, [trip.trip_vehicle]);

  useEffect(() => {
    fetchVendor();
  }, [vehiclesOtherData.vehicle_branch]);

  useEffect(() => {
    fetchAgency();
  }, [vehiclesOtherData.vehicle_branch]);

  useEffect(() => {
    fetchVechile();
  }, []);
  useEffect(() => {
    fetchAgencyRt();
  }, [trip.trip_agency]);

  useEffect(() => {
    fetchDriver();
  }, [vehiclesOtherData.vehicle_branch]);
  useEffect(() => {
    fetchVechileDriver();
  }, [trip.trip_vehicle]);

  const validateOnlyDigits = (inputtxt) => {
    var phoneno = /^\d+$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
  };

  const onInputChange = (e) => {
    if (e.name == "trip_vehicle") {
      setTrip({
        ...trip,
        trip_vehicle: e.value,
      });
    } else if (e.name == "trip_agency") {
      setTrip({
        ...trip,
        trip_agency: e.value,
      });
    } else if (e.name == "trip_driver") {
      setTrip({
        ...trip,
        trip_driver: e.value,
      });
    } else if (e.name == "trip_supplier") {
      setTrip({
        ...trip,
        trip_supplier: e.value,
      });
    } else if (e.target.name == "trip_hsd") {
      if (validateOnlyDigits(e.target.value)) {
        setTrip({
          ...trip,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "trip_advance") {
      if (validateOnlyDigits(e.target.value)) {
        setTrip({
          ...trip,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setTrip({
        ...trip,
        [e.target.name]: e.target.value,
      });
    }
  };
  const customStyles = {
    control: (provided) => ({
      ...provided,
      height: "34px",
      minHeight: "34px",
      fontSize: "0.75rem",
      borderRadius: "0.5rem",
      borderColor: "#2196F3",
    }),
    menu: (provided) => ({
      ...provided,
      fontSize: "0.75rem",
    }),
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
      trip_date: trip.trip_date,
      trip_year: "2023-24",
      trip_vehicle: trip.trip_vehicle,
      trip_agency: trip.trip_agency,
      trip_hsd: Math.round(
        agenciesRT.agency_rt_km / vehiclesOtherData.vehicle_mileage
      ),
      trip_advance: trip.trip_advance,
      trip_hsd_supplied: trip.trip_hsd_supplied,
      trip_supplier: trip.trip_supplier,
      trip_remarks: trip.trip_remarks,
      trip_branch: vehiclesOtherData.vehicle_branch,
      trip_company: vehiclesOtherData.vehicle_company,
      trip_driver: trip.trip_driver,
    };

    setIsButtonDisabled(true);
    axios({
      url: BASE_URL + "/api/web-create-trip",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      toast.success("Trip Created Sucessfully");

      navigate("/trip-list");
      setTrip({
        trip_date: todayback,
        trip_year: "2023-24",
        trip_branch: "",
        trip_company: "",
        trip_driver: "",
        vehicle_driver: "",
        trip_vehicle: "",
        trip_agency: "",
        trip_hsd: "",
        trip_advance: "",
        trip_mileage: "",
        trip_hsd_supplied: "",
        trip_supplier: "",
        trip_remarks: "",
        trip_km: "",
      });
    });
  };

  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const inputClassSelect =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-500";
  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-500";
  return (
    <Layout>
      <div className=" bg-[#FFFFFF] p-2  rounded-lg  ">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-red-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Add Trip </span>
            </div>
            <IconArrowBack
              onClick={() => navigate("/trip-list")}
              className="cursor-pointer hover:text-red-600"
            />
          </h2>
        </div>
        <hr />
        <form
          onSubmit={handleSubmit}
          id="addIndiv"
          className="w-full max-w-7xl  rounded-lg mx-auto p-4 space-y-6 "
        >
          <div className="grid grid-cols-1  md:grid-cols-1 lg:grid-cols-3 gap-6">
            {/* date  */}
            <div>
              <FormLabel required>Date</FormLabel>
              <input
                type="date"
                required
                name="trip_date"
                value={trip.trip_date}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* Vechile No  */}

            <div>
              <FormLabel>Vechile No</FormLabel>
              <Select
                name="trip_vehicle"
                options={vehicles.map((option) => ({
                  value: option.reg_no,
                  label: option.reg_no,
                  name: "trip_vehicle",
                }))}
                onChange={(e) => onInputChange(e)}
                value={
                  trip.trip_vehicle
                    ? {
                        value: trip.trip_vehicle,
                        label: trip.trip_vehicle,
                      }
                    : null
                }
                placeholder="Select Vechile No"
                styles={customStyles}
                isSearchable={true}
              />
            </div>
            {/* company  */}
            <div>
              <FormLabel>Company</FormLabel>
              <input
                type="text"
                name="trip_company"
                value={vehiclesOtherData.vehicle_company}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* Branch  */}
            <div>
              <FormLabel required>Branch</FormLabel>
              <input
                type="text"
                name="trip_branch"
                value={vehiclesOtherData.vehicle_branch}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* Vechile Driver  */}
            <div>
              <FormLabel required>Driver</FormLabel>
              <input
                type="text"
                name="vehicle_driver"
                value={vehiclesDriver.vehicle_driver}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>

            {/* Change Driver  */}
            <div>
              <FormLabel>Change Driver</FormLabel>
              <Select
                name="trip_driver"
                options={driver.map((option) => ({
                  value: option.full_name,
                  label: option.full_name,
                  name: "trip_driver",
                }))}
                onChange={(e) => onInputChange(e)}
                value={
                  trip.trip_driver
                    ? {
                        value: trip.trip_driver,
                        label: trip.trip_driver,
                      }
                    : null
                }
                placeholder="Select Change Driver"
                styles={customStyles}
                isSearchable={true}
              />
            </div>
            {/* Agencies  */}
            <div>
              <FormLabel>Agencies</FormLabel>
              <Select
                name="trip_agency"
                options={agency.map((option) => ({
                  value: option.agency_name,
                  label: option.agency_name,
                  name: "trip_agency",
                }))}
                onChange={(e) => onInputChange(e)}
                value={
                  trip.trip_agency
                    ? {
                        value: trip.trip_agency,
                        label: trip.trip_agency,
                      }
                    : null
                }
                placeholder="Select Agencies"
                styles={customStyles}
                isSearchable={true}
              />
            </div>
            {/* RT Km  */}
            <div>
              <FormLabel>RT KM</FormLabel>
              <input
                type="text"
                name="trip_km"
                value={agenciesRT.agency_rt_km}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* Mileage  */}
            <div>
              <FormLabel>Mileage</FormLabel>
              <input
                type="text"
                name="trip_mileage"
                value={vehiclesOtherData.vehicle_mileage}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>

            {/* Supplier  */}
            <div>
              <FormLabel>Supplier</FormLabel>
              <Select
                name="trip_supplier"
                options={vendor.map((option) => ({
                  value: option.vendor_name,
                  label: option.vendor_name,
                  name: "trip_supplier",
                }))}
                onChange={(e) => onInputChange(e)}
                value={
                  trip.trip_supplier
                    ? {
                        value: trip.trip_supplier,
                        label: trip.trip_supplier,
                      }
                    : null
                }
                placeholder="Select Supplier"
                styles={customStyles}
                isSearchable={true}
              />
            </div>

            {/* Fixed HSD  */}
            <div className=" col-span-0 lg:col-span-3">
              <FormLabel>Fixed HSD</FormLabel>
              <input
                type="text"
                name="trip_hsd"
                value={Math.round(
                  agenciesRT.agency_rt_km / vehiclesOtherData.vehicle_mileage
                )}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* HSD Supplied  */}
            <div className=" col-span-0 lg:col-span-3">
              <FormLabel>HSD Supplied</FormLabel>
              <input
                type="text"
                name="trip_hsd_supplied"
                value={trip.trip_hsd_supplied}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* Advance  */}
            <div className=" col-span-0 lg:col-span-3">
              <FormLabel>Advance</FormLabel>
              <input
                type="text"
                name="trip_advance"
                value={trip.trip_advance}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* Remark  */}
            <div className=" col-span-0 lg:col-span-3">
              <FormLabel>Remarks</FormLabel>
              <input
                type="text"
                name="trip_remarks"
                value={trip.trip_remarks}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-wrap gap-4 justify-start">
            <button
              type="submit"
              className="text-center text-sm font-[400] cursor-pointer  w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
              disabled={isButtonDisabled}
            >
              {isButtonDisabled ? "Sumbitting..." : "Sumbit"}
            </button>

            <button
              type="button"
              className="text-center text-sm font-[400] cursor-pointer  w-36 text-white bg-red-600 hover:bg-red-400 p-2 rounded-lg shadow-md"
              onClick={() => {
                navigate("/trip-list");
              }}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddTrip;
