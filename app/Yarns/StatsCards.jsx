export default function StatsCards({ transactions }) {
  const { issued, received } = transactions.reduce(
    (a, t) => {
      if (t.transactionType === "issue") a.issued += t.quantity;
      if (t.transactionType === "receipt") a.received += t.quantity;
      return a;
    },
    { issued: 0, received: 0 },
  );

  return (
    <div className="row mb-4">
      <div className="col-md-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h6 className="text-muted">Total Issued</h6>
            <h3 className="text-danger">{issued} kg</h3>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h6 className="text-muted">Total Received</h6>
            <h3 className="text-success">{received} kg</h3>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h6 className="text-muted">Transactions</h6>
            <h3 className="text-primary">{transactions.length}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
