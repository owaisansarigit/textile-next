export default function StatsCards({ transactions }) {  
  const totalIssued = transactions
    .filter((t) => t.transactionType === "issue")
    .reduce((s, t) => s + t.quantity, 0);

  const totalReceived = transactions
    .filter((t) => t.transactionType === "receipt")
    .reduce((s, t) => s + t.quantity, 0);

  return (
    <div className="row mb-4">
      <Stat title="Total Issued" value={`${totalIssued} kg`} color="danger" />
      <Stat
        title="Total Received"
        value={`${totalReceived} kg`}
        color="success"
      />
      <Stat title="Transactions" value={transactions.length} color="primary" />
    </div>
  );
}

const Stat = ({ title, value, color }) => (
  <div className="col-md-4">
    <div className="card shadow-sm">
      <div className="card-body">
        <h6 className="text-muted">{title}</h6>
        <h3 className={`text-${color}`}>{value}</h3>
      </div>
    </div>
  </div>
);
