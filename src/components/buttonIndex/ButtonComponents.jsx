import { Edit, Eye, Plus, PlusCircle, Trash, Truck, View } from "lucide-react";
import React from "react";
import { checkPermission } from "./checkPermission";

const getStaticPermissions = () => {
  const buttonPermissions = localStorage.getItem("buttonControl");
  try {
    return buttonPermissions ? JSON.parse(buttonPermissions) : [];
  } catch (error) {
    console.error(
      "Error parsing StaticPermission data from localStorage",
      error
    );
    return [];
  }
};

/*-------------------------Vechiles---------------- */
export const VechilesEdit = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "VechilesEdit", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className} title="Edit Vehicles">
      <Edit className="h-4 w-4 text-blue-500" />
    </button>
  );
};
VechilesEdit.page = "Vehicles";
export const VechilesView = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "VechilesView", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className} title="Side View">
      <Eye className="h-4 w-4 text-blue-500" />
    </button>
  );
};
VechilesView.page = "Vehicles";

export const VechilesCreate = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "VechilesCreate", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      <Plus className="h-4 w-4 " />
      Vehicles
    </button>
  );
};
VechilesCreate.page = "Vehicles";

export default {
  VechilesEdit,
  VechilesCreate,
  VechilesView,
  
};