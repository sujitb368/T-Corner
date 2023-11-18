import React from "react";
import "./Input.css";

/**
 * Select component for handling dropdown selections.
 * @param {Object} props - Component properties.
 * @param {string} props.className - Additional CSS class for styling.
 * @param {string} props.fieldName - Unique identifier for the select field.
 * @param {Function} props.onChange - Callback function triggered on select value change.
 * @param {string} props.label - Optional label for the select field.
 * @param {Array} props.options - Array of options for the dropdown select.
 * @param {string} props.name - Display name or label for the select field.
 */
export const Select = ({
  className,
  fieldName,
  onChange,
  label,
  options,
  name,
}) => {
  /**
   * Handle select value changes and trigger the onChange callback.
   * @param {Object} e - Event object representing the select change.
   */
  const handelChange = (e) => {
    const inputedValue = e.target.value;
    onChange(fieldName, inputedValue);
  };

  return (
    <div>
      {label && <label className="form-label">{name}</label>}
      <select
        className={`form-select br-2 ${className}`}
        onChange={(e) => handelChange(e)}
      >
        <option disabled selected>
          select {name}
        </option>
        {options &&
          options.map((option, index) => {
            return (
              <option key={option.key + index} value={option.name}>
                {option.name}
              </option>
            );
          })}
      </select>
    </div>
  );
};
