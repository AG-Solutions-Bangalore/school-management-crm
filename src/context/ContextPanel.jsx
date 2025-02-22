import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BASE_URL from "../base/BaseUrl";
import axios from "axios";

export const ContextPanel = createContext();

const AppProvider = ({ children }) => {

  const userTypeId = localStorage.getItem("user_type_id");
  
  return (
    <ContextPanel.Provider
      value={{  userTypeId }}
    >
      {children}
    </ContextPanel.Provider>
  );
};

export default AppProvider;