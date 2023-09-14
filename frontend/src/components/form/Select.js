import React from "react";
import "./Input.css";

export const Select = ({
  className,
  fieldName,
  onChange,
  label,
  options,
  name,
}) => {
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
