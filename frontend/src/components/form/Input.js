import React from "react";
import "./Input.css";
export const Input = ({
  className,
  fieldName,
  onChange,
  name,
  type,
  label,
  placeholder,
}) => {
  const handelChange = (e) => {
    if (type === "checkbox") {
      const inputedValue = e.target.checked;
      onChange(fieldName, inputedValue);
    } else {
      const inputedValue = e.target.value;
      onChange(fieldName, inputedValue);
    }
  };
  return (
    <>
      {label && <label className="form-label">{name}</label>}
      {type !== "textarea" ? (
        <>
          <input
            type={type}
            placeholder={"Enter " + (placeholder ?? name)}
            className={`form-control ${className} br-2`}
            onChange={(e) => handelChange(e)}
          />
        </>
      ) : (
        <textarea
          type={type}
          placeholder={"Enter " + (placeholder ?? name)}
          className={`form-control ${className} br-2`}
          onChange={(e) => handelChange(e)}
        ></textarea>
      )}
    </>
  );
};
