// src/components/sets/setFormComps/YarnSection.jsx
import React from "react";
import FormInput from "./FormInput";

const YarnSection = ({
  form,
  updateField,
  suggestions,
  closingBalance,
  errors,
}) => {
  const issuedWeight = (Number(form.bagsUsed) || 0) * (Number(form.weightPerBag) || 0);

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <div className="row g-3 mb-3">
          <FormInput
            label="Bag Name / Yarn"
            id="bagName"
            value={form.bagName}
            onChange={updateField}
            list="yarnList"
            error={errors.bagName}
          />
          <div className="col-md-3">
            <label className="form-label small">Count</label>
            <input
              className="form-control"
              readOnly
              value={form.yarnCount || ""}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label small">Category</label>
            <input
              className="form-control"
              readOnly
              value={form.yarnCategory || ""}
            />
          </div>
        </div>

        <div className="row g-3 p-3 bg-light rounded">
          <FormInput
            label="Bags Used"
            id="bagsUsed"
            type="number"
            min="0"
            value={form.bagsUsed}
            onChange={(f, v) => updateField(f, Number(v) || 0)}
          />
          <FormInput
            label="Wt/Bag (kg)"
            id="weightPerBag"
            type="number"
            step="0.01"
            value={form.weightPerBag}
            onChange={(f, v) => updateField(f, Number(v) || 0)}
          />
          <div className="col">
            <label className="form-label small">Yarn Weight (kg)</label>
            <input
              className="form-control bg-white"
              readOnly
              value={issuedWeight.toFixed(3)}
            />
          </div>
          <FormInput
            label="Used Yarn Weight (kg)"
            id="usedYarnWeight"
            type="number"
            step="0.01"
            min="0"
            value={form.usedYarnWeight || ""}
            onChange={(f, v) => updateField(f, Number(v) || 0)}
          />
          <div className="col">
            <label className="form-label small">Closing Balance (kg)</label>
            <input
              className={`form-control fw-bold ${
                closingBalance < 0 ? "bg-danger text-white" : "bg-success text-white"
              }`}
              readOnly
              value={closingBalance.toFixed(3)}
            />
          </div>
        </div>
      </div>

      <datalist id="yarnList">
        {suggestions.yarnNames.map((y) => (
          <option key={y} value={y} />
        ))}
      </datalist>
    </div>
  );
};

export default YarnSection;