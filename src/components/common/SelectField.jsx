import React from "react";
import Select from "react-select";

const SelectField = ({
  label,
  name,
  value,
  options,
  onChange,
  placeholder,
  required = false,
  isSearchable = true,
  styles,
}) => {
  const inputClassSelect =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-500";

  return (
    <div>
      <label className="block text-sm font-semibold text-grey mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Select
        name={name}
        value={value}
        options={options}
        onChange={onChange}
        placeholder={placeholder || `Select ${label}`}
        isSearchable={isSearchable}
        styles={styles}
      />
    </div>
  );
};

export default SelectField;
