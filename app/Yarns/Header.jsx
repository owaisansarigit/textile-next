export default function Header({ balance, showForm, toggleForm }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2>
          <i className="bi bi-yarn text-primary me-2"></i>
          Yarn Transactions
        </h2>
        <p className="text-muted">
          Manage yarn inventory - Issue, Receipt, Adjustment
        </p>
      </div>

      <div className="text-end">
        <div className="text-muted small">Current Balance</div>
        <h3 className="text-primary">{balance} kg</h3>
        <button className="btn btn-primary" onClick={toggleForm}>
          <i className="bi bi-plus-circle me-2"></i>
          {showForm ? "Cancel" : "Add Transaction"}
        </button>
      </div>
    </div>
  );
}
