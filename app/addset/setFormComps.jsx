export const SectionWrapper = ({ title, children, rightElement }) => (
  <div className="card shadow mb-4">
    <div className="card-header d-flex justify-content-between align-items-center">
      <h5 className="mb-0">{title}</h5>
      {rightElement}
    </div>
    <div className="card-body">{children}</div>
  </div>
);

export const FormInput = ({
  label,
  id,
  value,
  onChange,
  type = "text",
  list,
  error,
  ...props
}) => (
  <div className="col-md-4">
    {label && <label className="form-label small mb-1">{label}</label>}
    <input
      id={id}
      type={type}
      list={list}
      className={`form-control ${error ? "is-invalid" : ""}`}
      value={value}
      onChange={(e) => onChange(id, e.target.value, type)}
      {...props}
    />
    {error && (
      <div className="invalid-feedback" style={{ fontSize: "0.75rem" }}>
        {error}
      </div>
    )}
  </div>
);

export const BeamRow = ({ beam, index, onUpdate, weaverList }) => (
  <div className="row g-1 mb-1 align-items-center">
    <div className="col-1 fw-bold text-center">{beam.beamNo}</div>
    <div className="col">
      <input
        className="form-control form-control-sm"
        placeholder="Pipe"
        onChange={(e) => onUpdate(index, "pipeNo", e.target.value)}
      />
    </div>
    <div className="col">
      <input
        className="form-control form-control-sm"
        type="number"
        placeholder="Cuts"
        onChange={(e) => onUpdate(index, "cut", +e.target.value)}
      />
    </div>
    <div className="col">
      <input
        className="form-control form-control-sm"
        list={weaverList}
        placeholder="Weaver"
        onChange={(e) => onUpdate(index, "weaver", e.target.value)}
      />
    </div>
    <div className="col">
      <input
        className="form-control form-control-sm"
        placeholder="Slip"
        onChange={(e) => onUpdate(index, "slipNo", e.target.value)}
      />
    </div>
    <div className="col">
      <input
        className="form-control form-control-sm"
        type="date"
        value={beam.date}
        onChange={(e) => onUpdate(index, "date", e.target.value)}
      />
    </div>
  </div>
);
