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
