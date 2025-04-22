import classNames from "classnames";
import { useState } from "react";
import "./FormFields.scss";

// Input field component for any form
export const InputField = ({
  label,
  name,
  value,
  onChange,
  errors,
  type = "text",
  readOnly = false,
  icon = null,
  placeholder = "",
  customClass = "",
  onFocus = () => {},
  onBlur = () => {},
}) => (
  <div className="form-input-container">
    <label htmlFor={name} className="form-input-label">
      {label}
    </label>

    <div className={classNames("input-with-icon-wrapper", customClass)}>
      {/* Render icon if provided */}
      {icon && <span className="form-input-icon">{icon}</span>}

      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        onFocus={onFocus}
        onBlur={onBlur}
        className={classNames("form-input-field", {
          "form-input-error": errors[name],
        })}
        aria-invalid={errors[name] ? "true" : "false"} // For screen readers
        aria-describedby={errors[name] ? `${name}-error` : undefined} // Link error to input
        aria-label={label} // Ensure label is announced by screen readers
      />
    </div>

    {errors[name] && <p className="form-error-message">{errors[name]}</p>}
  </div>
);

// Select field component for any form
export const SelectField = ({
  label,
  name,
  value,
  onChange,
  errors,
  options,
  icon,
  ariaLabel,
}) => {
  return (
    <div className="form-select-container">
      <label htmlFor={name} className="form-input-label">
        {label}
      </label>
      <div className="select-with-icon-wrapper">
        {/* Icon */}
        <span className="form-input-icon">{icon}</span>
        <select
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className={`form-select-field ${errors[name] ? "is-invalid" : ""}`}
          aria-labelledby={name}
          aria-describedby={errors[name] ? `${name}-error` : undefined} // Linking the error message
          aria-label={ariaLabel || label} // Provides fallback accessible name if ariaLabel is provided
        >
          <option value="" disabled>
            Select {label}
          </option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {errors[name] && (
        <p id={`${name}-error`} className="form-error">
          {errors[name]}
        </p>
      )}
    </div>
  );
};

//  TextArea Field component for any form
export const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  errors,
  placeholder,
  icon,
}) => (
  <div className="form-textarea-container">
    <label htmlFor={name} className="form-input-label">
      {label}
    </label>

    <div className="textarea-with-icon-wrapper">
      {icon && <span className="form-textarea-icon">{icon}</span>}

      <textarea
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-textarea-input-field ${
          errors[name] ? "form-input-error" : ""
        }`}
        rows="3"
        cols="50"
        aria-invalid={errors[name] ? "true" : "false"} // For screen readers
        aria-describedby={errors[name] ? `${name}-error` : undefined} // Link error to input
        aria-label={label} // Ensure label is announced by screen readers
      />
    </div>

    {errors[name] && (
      <p id={`${name}-error`} className="form-error-message" role="alert">
        {errors[name]}
      </p>
    )}
  </div>
);

// Checkbox Field component for any form
export const CheckboxField = ({ label, name, checked, onChange, errors }) => (
  <div className="form-checkbox-container">
    <div className="checkbox-wrapper">
      <input
        type="checkbox"
        name={name}
        id={name}
        checked={checked}
        onChange={onChange}
        className={`checkbox-input ${errors[name] ? "input-error" : ""}`} // Add error styling if needed
        aria-labelledby={`${name}-label`}
        aria-describedby={`${name}-error`} // Link the input with the error message
      />
      <label
        htmlFor={name}
        id={`${name}-label`}
        className="form-checkbox-label"
      >
        {label}
      </label>
    </div>

    {errors[name] && (
      <p id={`${name}-error`} className="form-error-message" role="alert">
        {errors[name]}
      </p>
    )}
  </div>
);

// Date Field component for any form
export const DateField = ({
  label,
  name,
  value,
  onChange,
  errors,
  placeholder = "",
  icon,
  customClass = "",
  onFocus = () => {},
  onBlur = () => {},
}) => (
  <div className="form-date-container">
    <label htmlFor={name} className="form-input-label">
      {label}
    </label>
    <div className={classNames("input-with-icon-wrapper", customClass)}>
      {/* Render icon if provided */}
      {icon && <span className="form-input-icon">{icon}</span>}
      <input
        type="date"
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`form-input-field ${errors[name] ? "input-error" : ""}`}
        aria-labelledby={`${name}-label`}
        aria-describedby={`${name}-error`} // Link the input with the error message
      />
    </div>
    {errors[name] && (
      <p id={`${name}-error`} className="form-error-message" role="alert">
        {errors[name]}
      </p>
    )}
  </div>
);

// Password Field component for any form
export const PasswordField = ({
  label,
  name,
  value,
  onChange,
  errors,
  placeholder = "",
  icon,
  customClass = "",
  onFocus = () => {},
  onBlur = () => {},
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="form-password-input-container">
      <label htmlFor={name} id={`${name}-label`} className="form-input-label">
        {label}
      </label>

      <div className="password-input-with-icon-wrapper">
        {icon && <span className="form-input-icon">{icon}</span>}

        <input
          type={isPasswordVisible ? "text" : "password"}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={onFocus}
          onBlur={onBlur}
          className={classNames("form-input-field", customClass, {
            "input-error": errors[name],
          })}
          aria-labelledby={`${name}-label`}
          aria-describedby={`${name}-error`}
        />

        <button
          type="button"
          onClick={togglePasswordVisibility}
          aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          className="password-toggle"
        >
          {isPasswordVisible ? "Hide" : "Show"}
        </button>
      </div>

      {errors[name] && (
        <p id={`${name}-error`} className="form-error-message" role="alert">
          {errors[name]}
        </p>
      )}
    </div>
  );
};

// File Upload Field component for any form
export const FileUploadField = ({
  label,
  name,
  value,
  onChange,
  errors,
  accept = "*",
  customClass = "",
  icon = null,
}) => (
  <div className="form-file-upload-container">
    <label htmlFor={name} id={`${name}-label`} className="form-input-label">
      {label}
    </label>

    <div className="file-upload-with-icon-wrapper">
      {icon && <span className="form-input-icon">{icon}</span>}
      <input
        type="file"
        name={name}
        id={name}
        accept={accept}
        onChange={onChange}
        value={value}
        className={`form-file-upload-input-field ${customClass} ${
          errors[name] ? "input-error" : ""
        }`}
        aria-labelledby={`${name}-label`}
        aria-describedby={`${name}-error`} // Link input with error message
      />

      {/* Optional: Add a button or placeholder text here */}
      <span className="file-upload-placeholder">
        {value ? value.split("\\").pop() : "No file selected"}
      </span>
    </div>

    {errors[name] && (
      <p id={`${name}-error`} className="form-error-message" role="alert">
        {errors[name]}
      </p>
    )}
  </div>
);
// Radio Field component for any form
export const RadioField = ({
  label,
  name,
  value,
  checked,
  onChange,
  errors,
  icon = null,
}) => (
  <div className="form-radio-container">
    {icon && <span className="form-input-icon">{icon}</span>}
    <div className="radio-wrapper">
      <input
        type="radio"
        name={name}
        id={`${name}-${value}`} // Unique ID for each radio button
        value={value}
        checked={checked}
        onChange={onChange}
        className={`form-radio-input-field  ${
          errors[name] ? "form-input-error" : ""
        }`} // Conditionally add error class
        aria-labelledby={`${name}-${value}-label`} // Associate the radio button with the label
        aria-describedby={`${name}-error`} // Link to error message (if any)
      />
      <label
        htmlFor={`${name}-${value}`}
        id={`${name}-${value}-label`}
        className="form-radio-label"
      >
        {label}
      </label>
    </div>

    {errors[name] && (
      <p id={`${name}-error`} className="form-error-message" role="alert">
        {errors[name]}
      </p>
    )}
  </div>
);

// Radio Group Field component for any form
export const RadioGroupField = ({
  label,
  name,
  options,
  value,
  onChange,
  errors,
  customClass = "",
}) => (
  <div className={`form-radio-group-container ${customClass}`}>
    <label htmlFor={name} className="form-input-label">
      {label}
    </label>

    <div className="radio-group-wrapper">
      {options.map((option) => (
        <div key={option.value} className="radio-option">
          <input
            type="radio"
            name={name}
            id={`${name}-${option.value}`}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            className={`form-radio-input-field ${
              errors[name] ? "input-error" : ""
            }`}
            aria-labelledby={`${name}-label`}
            aria-describedby={`${name}-${option.value}-error`} // Link error message
          />
          <label htmlFor={`${name}-${option.value}`} className="radio-label">
            {option.label}
          </label>
          {errors[name] && (
            <p
              id={`${name}-${option.value}-error`}
              className="form-error-message"
              role="alert"
            >
              {errors[name]}
            </p>
          )}
        </div>
      ))}
    </div>
  </div>
);
