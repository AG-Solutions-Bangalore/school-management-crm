import { createContext, useEffect, useState } from "react";
import BASE_URL from "../base/BaseUrl";
import axios from "axios";

export const ContextPanel = createContext();

const AppProvider = ({ children }) => {
  const userTypeId = localStorage.getItem("user_type_id");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const token = localStorage.getItem("token");
  const selectedYear = localStorage.getItem("default_year");

  const fetchPagePermission = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-usercontrol-new`, {
        headers: { Authorization: `Bearer ${token}` },
      });
     
      // array in local storage
      localStorage.setItem("pageControl", JSON.stringify(response.data?.pagePermissions));

      
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
 
  const fetchPermissions = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-usercontrol`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Store the entire `usercontrol` array in localStorage
      localStorage.setItem("buttonControl", JSON.stringify(response.data?.buttonPermissions));

      
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchUserType = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-usertype`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Store the entire `usercontrol` array in localStorage
      localStorage.setItem("userTypeRole", JSON.stringify(response.data?.userType));

      
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const getStaticUsers = () => {
    try {
      const users = localStorage.getItem("allUsers");
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error("Error parsing allUsers from localStorage", error);
      return [];
    }
  };

  const fetchYears = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-year-list`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      localStorage.setItem("years", JSON.stringify(response.data.year));
      
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    if(token){
      fetchYears()
      getStaticUsers()
      fetchPagePermission()
      fetchPermissions();
    }
  },[])
  return (
    <ContextPanel.Provider value={{ userTypeId, fetchYears ,selectedYear,fetchPagePermission,getStaticUsers,fetchPermissions,fetchUserType}}>
      {children}
    </ContextPanel.Provider>
  );
};

export default AppProvider;
