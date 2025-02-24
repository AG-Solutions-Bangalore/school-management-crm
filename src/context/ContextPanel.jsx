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
  const fetchYears = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
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

  return (
    <ContextPanel.Provider value={{ userTypeId, fetchYears ,selectedYear}}>
      {children}
    </ContextPanel.Provider>
  );
};

export default AppProvider;
