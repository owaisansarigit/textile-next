import FormInput from "./FormInput";

const SetHeaderSection = ({
  form,
  updateField,
  suggestions,
  openingBalance,
  errors,
}) => (
  <div className="card mb-4 shadow-sm">
    <div className="card-header d-flex justify-content-between bg-white">
      <h6>Set Entry</h6>
      <div className="text-end">
        <small className="text-muted">Opening Stock (kg)</small>
        <div className="fw-bold text-primary fs-5">
          {openingBalance.toFixed(2)}
        </div>
      </div>
    </div>
    <div className="card-body">
      <div className="row g-3">
        <FormInput
          label="Sizing"
          id="sizing"
          value={form.sizing}
          onChange={updateField}
          list="sizingList"
          error={errors.sizing}
        />
        <FormInput
          label="Date"
          id="date"
          type="date"
          value={form.date}
          onChange={updateField}
        />
        <FormInput
          label="Set No"
          id="setNo"
          value={form.setNo}
          onChange={updateField}
          error={errors.setNo}
        />
        <FormInput
          label="Ends"
          id="ends"
          value={form.ends}
          onChange={updateField}
        />
        <FormInput label="TL" id="tl" value={form.tl} onChange={updateField} />
      </div>
    </div>
    <datalist id="sizingList">
      {suggestions.sizing.map((s) => (
        <option key={s} value={s} />
      ))}
    </datalist>
  </div>
);

export default SetHeaderSection;
