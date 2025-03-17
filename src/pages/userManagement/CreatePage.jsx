import React, { useState, useEffect, useContext } from "react";

import { useQuery, useMutation } from "@tanstack/react-query";
import { Table, ChevronDown, Plus } from "lucide-react";
import menuItems from "../../json/menuItems.json";
import { toast } from "sonner";
import BASE_URL from "../../base/BaseUrl";
import Layout from "../../layout/Layout";
import { ContextPanel } from "../../context/ContextPanel";
import { useNavigate } from "react-router-dom";
import {
  CreateButton,
  HeaderColor,
} from "../../components/common/ButttonConfig";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";

const CreatePage = () => {
  const [selectedPage, setSelectedPage] = useState("");
  const [selectedUrl, setSelectedUrl] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [userIds, setUserIds] = useState("1,2");
  const [status, setStatus] = useState("Active");
  const [availablePages, setAvailablePages] = useState([]);
  const navigate = useNavigate();
  const { fetchPagePermission } = useContext(ContextPanel);
  const flattenMenuItems = (items) => {
    let flattened = [];
    items.forEach((item) => {
      if (item.href && !item.subItems) {
        flattened.push({
          title: item.title,
          href: item.href,
        });
      }
      if (item.subItems) {
        flattened = [...flattened, ...flattenMenuItems(item.subItems)];
      }
    });
    return flattened;
  };

  useEffect(() => {
    const existingControls = JSON.parse(
      localStorage.getItem("pageControl") || "[]"
    );
    const allFlattenedPages = flattenMenuItems(menuItems);

    const filteredPages = allFlattenedPages.filter((menuItem) => {
      return !existingControls.some(
        (control) =>
          control.page === menuItem.title ||
          control.url === menuItem.href.replace("/", "")
      );
    });

    if (filteredPages.length > 0) {
      setAvailablePages(["All", ...filteredPages.map((item) => item.title)]);
    } else {
      setAvailablePages([]);
    }
  }, []);

  const handlePageChange = (e) => {
    const page = e.target.value;
    setSelectedPage(page);

    if (page === "All") {
      const existingControls = JSON.parse(
        localStorage.getItem("pageControl") || "[]"
      );
      const allFlattenedPages = flattenMenuItems(menuItems);

      const filteredPages = allFlattenedPages.filter((menuItem) => {
        return !existingControls.some(
          (control) =>
            control.page === menuItem.title ||
            control.url === menuItem.href.replace("/", "")
        );
      });

      setSelectedItems(filteredPages);
      setSelectedUrl("");
    } else {
      const item = flattenMenuItems(menuItems).find((i) => i.title === page);
      if (item) {
        setSelectedUrl(item.href.replace("/", ""));
        setSelectedItems([item]);
      }
    }
  };

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem("token");
      console.log("data sent: ", data);

      const response = await fetch(
        `${BASE_URL}/api/panel-create-usercontrol-new`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: async () => {
      await fetchPagePermission();
      toast.success("Page control created successfully!");
      navigate("/userManagement");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleSubmit = () => {
    let payloadData;

    if (selectedPage === "All") {
      payloadData = selectedItems.map((item) => ({
        page: item.title,
        url: item.href.replace("/", ""),
        userIds,
        status,
      }));
    } else {
      payloadData = [
        {
          page: selectedPage,
          url: selectedUrl,
          userIds,
          status,
        },
      ];
    }

    const payload = {
      usercontrol_data: payloadData,
    };

    console.log("Submitting payload:", payload);
    createMutation.mutate(payload);
  };

  return (
    <Layout>
      <div className="p-6">
        <div className={HeaderColor}>
          <h2 className="px-5 text-black text-lg flex justify-between items-center rounded-xl p-2">
            <div className="flex items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>User Type List</span>
            </div>
            <IconArrowBack
              onClick={() => navigate("/userManagement")}
              className="cursor-pointer hover:text-red-600"
            />
          </h2>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* <h2 className="text-2xl font-semibold mb-6">Create Page Control</h2> */}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page
              </label>
              <select
                value={selectedPage}
                onChange={handlePageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Page</option>
                {availablePages.map((page) => (
                  <option key={page} value={page}>
                    {page}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL
              </label>
              <input
                type="text"
                value={selectedUrl}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User IDs
              </label>
              <input
                type="text"
                value={userIds}
                onChange={(e) => setUserIds(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <input
                type="text"
                value={status}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
          </div>

          {selectedItems.length > 0 && (
            <div className="mt-8">
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Page
                      </th>
                      <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        URL
                      </th>
                      <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User IDs
                      </th>
                      <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItems.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap border-b">
                          {item.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap border-b">
                          {item.href.replace("/", "")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap border-b">
                          {userIds}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap border-b">
                          {status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!selectedPage || createMutation.isLoading}
            className={CreateButton}
          >
            <Plus size={20} />
            Create
          </button>

          {createMutation.isLoading && (
            <div className="mt-4 text-blue-600">Creating...</div>
          )}
          {createMutation.isError && (
            <div className="mt-4 text-red-600">
              Error: {createMutation.error.message}
            </div>
          )}
          {createMutation.isSuccess && (
            <div className="mt-4 text-green-600">
              Successfully created page control!
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CreatePage;
