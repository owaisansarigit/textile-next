import React from "react";

const BeamCountSection = ({ form, updateField, buildBeams, errors }) => (
  <div className="card mb-4 shadow-sm">
    <div className="card-body">
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Total Cuts</label>
          <input
            type="number"
            className="form-control"
            value={form.totalCuts || ""}
            onChange={e => updateField("totalCuts", Number(e.target.value) || 0)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Total Beams</label>
          <input
            type="number"
            className={`form-control ${errors.totalBeams ? 'is-invalid' : ''}`}
            value={form.totalBeams || ""}
            onChange={e => {
              const val = Number(e.target.value) || 0;
              updateField("totalBeams", val);
              buildBeams(val);
            }}
          />
          {errors.totalBeams && <div className="text-danger small">{errors.totalBeams}</div>}
        </div>
      </div>
    </div>
  </div>
);

export default BeamCountSection;