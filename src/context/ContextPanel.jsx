import { createContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPagePermissionData,
  fetchUserControlData,
  fetchUserTypeList,
  YearList,
} from "../components/common/UseApi";
import {
  fetchButtonPermissionSuccess,
  fetchFailure,
  fetchPagePermissionSuccess,
  fetchStart,
  fetchUserTypeSuccess,
  fetchYearsSuccess,
} from "../redux/store/permissionSlice";
import useApiToken from "../components/common/useApiToken";

export const ContextPanel = createContext();

const AppProvider = ({ children }) => {
  const dispatch = useDispatch();
  const token = useApiToken();
  const userTypeId = useSelector((state) => state.auth.user_type_id);
  const selectedYear = useSelector((state) => state.auth.default_year);
  const allUsers = useSelector((store) => store.auth.allUsers);

  const fetchPagePermission = async () => {
    dispatch(fetchStart());
    try {
      const response = await fetchPagePermissionData(token);
      dispatch(
        fetchPagePermissionSuccess(JSON.stringify(response?.pagePermissions))
      );
    } catch (error) {
      dispatch(fetchFailure());
    }
  };
  fetchUserControlData;
  const fetchPermissions = async () => {
    dispatch(fetchStart());
    try {
      const response = await fetchUserControlData(token);

      dispatch(
        fetchButtonPermissionSuccess(JSON.stringify(response.buttonPermissions)) // Store as string
      );
    } catch (error) {
      dispatch(fetchFailure());
    }
  };

  const fetchUserType = async () => {
    dispatch(fetchStart());
    try {
      const response = await fetchUserTypeList(token);
      dispatch(fetchUserTypeSuccess(response?.userType));
    } catch (error) {
      dispatch(fetchFailure());
    }
  };

  const getStaticUsers = () => {
    dispatch(fetchStart());
    try {
      const users = allUsers;
      return users ? JSON.parse(users) : [];
    } catch (error) {
      dispatch(fetchFailure());
      return [];
    }
  };

  const fetchYears = async () => {
    dispatch(fetchStart());
    try {
      const response = await YearList(token);
      dispatch(
        fetchYearsSuccess(response.year ? JSON.stringify(response.year) : "[]")
      );
    } catch (error) {
      dispatch(fetchFailure());
    }
  };

  useEffect(() => {
    if (token) {
      fetchYears();
      getStaticUsers();
      fetchPagePermission();
      fetchPermissions();
      fetchUserType();
    }
  }, [token, dispatch]);

  return (
    <ContextPanel.Provider
      value={{
        userTypeId,
        fetchYears,
        selectedYear,
        fetchPagePermission,
        getStaticUsers,
        fetchPermissions,
        fetchUserType,
      }}
    >
      {children}
    </ContextPanel.Provider>
  );
};

export default AppProvider;
