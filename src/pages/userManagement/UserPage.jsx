import React, { useContext, useEffect, useCallback, useState } from "react";
import { ExternalLink, Search, Filter } from "lucide-react";

import {
  Button,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { ContextPanel } from "../../context/ContextPanel";
import Layout from "../../layout/Layout";
import { useSelector } from "react-redux";

const UserPage = () => {
  const userTypeRoles = useSelector((state) => state.permissions.userTypeRole);
  const allUsers = useSelector((state) => state.auth.allUsers);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    userType: "all",
    status: "all",
  });

  const loadUsers = useCallback(async () => {
    try {
      const loadedUsers = allUsers;

      setUsers(loadedUsers);
      setFilteredUsers(loadedUsers);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  }, [allUsers]);

  const applyFilters = useCallback(() => {
    let result = [...users];

    if (searchTerm) {
      result = result.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.userType !== "all") {
      result = result.filter((user) => user.user_type === filters.userType);
    }

    if (filters.status !== "all") {
      result = result.filter((user) => user.status === filters.status);
    }

    setFilteredUsers(result);
  }, [users, searchTerm, filters]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters, searchTerm, filters]);

  const handleOpenDashboard = (userId) => {
    // window.open(`/management-dashboard/${userId}`, "_blank");
    navigate(`/management-dashboard/${userId}`);
  };

  return (
    <Layout>
      <div className=" ">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Search and Filter Section */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-black rounded-md"
              />
            </div>
            <Menu>
              <MenuHandler>
                <Button variant="outlined" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </MenuHandler>
              <MenuList>
                <MenuItem
                  onClick={() => setFilters({ ...filters, userType: "all" })}
                >
                  All Types
                </MenuItem>
                <MenuItem
                  onClick={() => setFilters({ ...filters, userType: 2 })}
                >
                  Teacher
                </MenuItem>
                <MenuItem
                  onClick={() => setFilters({ ...filters, userType: 1 })}
                >
                  Student
                </MenuItem>

                <MenuItem
                  onClick={() => setFilters({ ...filters, userType: 3 })}
                >
                  Administration
                </MenuItem>
              </MenuList>
            </Menu>
            <Button
              variant="outlined"
              onClick={() => navigate("/page-management")}
              className="flex items-center gap-2"
            >
              + Page
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/button-management")}
              className="flex items-center gap-2"
            >
              + Button
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                    User Info
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                    Role
                  </th>

                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                    Position
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-200">
                    <td className="py-3 px-4">
                      <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                        {user.name}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm ${
                          user.user_type === 1
                            ? "bg-red-100 text-red-800"
                            : user.user_type === 2
                            ? "bg-blue-100 text-blue-800"
                            : user.user_type === 3
                            ? "bg-green-100 text-green-800"
                            : user.user_type === 4
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-gray-100 text-gray-800"
                        } capitalize`}
                      >
                        {userTypeRoles?.find(
                          (role) => role.user_type === user.user_type
                        )?.user_role || "N/A"}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                        {user.user_position}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleOpenDashboard(user.id)}
                          className="inline-flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          User Managment
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserPage;
