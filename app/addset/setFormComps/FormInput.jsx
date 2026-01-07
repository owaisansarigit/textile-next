import React from "react";

const FormInput = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  list,
  error,
}) => (
  <div className="col-md-4">
    <label className="form-label small mb-1">{label}</label>
    <input
      type={type}
      id={id}
      name={id}
      className={`form-control ${error ? "is-invalid" : ""}`}
      value={value}
      onChange={(e) => onChange(id, e.target.value)}
      list={list}
    />
    {error && <div className="text-danger small">{error}</div>}
  </div>
);

export default FormInput;
