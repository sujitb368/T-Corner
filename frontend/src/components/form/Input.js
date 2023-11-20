import React from "react";
import "./Input.css";

/**
 * Input component for handling various input types, including text, password, checkbox, and textarea.
 * @param {Object} props - Component properties.
 * @param {string} props.className - Additional CSS class for styling.
 * @param {string} props.fieldName - Unique identifier for the input field.
 * @param {Function} props.onChange - Callback function triggered on input value change.
 * @param {string} props.name - Display name or label for the input field.
 * @param {string} props.type - Type of the input field (text, password, checkbox, textarea).
 * @param {string} props.label - Optional label for the input field.
 * @param {string} props.placeholder - Optional placeholder text for the input field.
 */
export const Input = ({
  className,
  fieldName,
  onChange,
  name,
  type,
  label,
  placeholder,
}) => {
  /**
   * Handle input value changes based on the input type (text, password, checkbox, textarea).
   * @param {Object} e - Event object representing the input change.
   */
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
