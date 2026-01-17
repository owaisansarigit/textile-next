import { TX_META } from "./utils";

const RecentTransactions = ({ transactions }) => {
  const getTransactionBadge = (t) => TX_META[t].badge;
  const getTransactionIcon = (t) => TX_META[t].icon;

  console.log(transactions);

  return (
    <div className="row">
      <div className="col-12">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white border-bottom">
            <h5 className="mb-0">
              <i className="bi bi-list-ul text-primary me-2"></i>
              Recent Transactions
            </h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <td className="text-center">Type</td>
                    <td className="text-center">Date & Time</td>
                    <td className="text-center">Weaver</td>
                    <td className="text-center">Yarn</td>
                    <td className="text-center">Opening</td>
                    <td className="text-center">Quantity</td>
                    <td className="text-center">Closing</td>
                    <td className="text-center">Remarks</td>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td className="text-center">
                        <span
                          className={`badge ${getTransactionBadge(transaction.transactionType)}`}
                        >
                          <i
                            className={`bi ${getTransactionIcon(transaction.transactionType)} me-1`}
                          ></i>
                          {transaction.transactionType}
                        </span>
                      </td>
                      <td className="text-center">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                        <div className="text-muted small">
                          {new Date(transaction.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="text-center">
                        <i className="bi bi-building me-1 text-muted"></i>
                        {transaction.wLedgerId?.name}
                      </td>
                      <td className="text-center">
                        {transaction.yarnId?.category}-
                        {transaction.yarnId?.count}-{transaction.yarnId?.name}
                      </td>
                      <td className="text-center">
                        <span className="text-muted">
                          {transaction.openingBalance} kg
                        </span>
                      </td>
                      <td className="text-center">
                        <span
                          className={`fw-bold ${
                            transaction.transactionType === "issue"
                              ? "text-danger"
                              : "text-success"
                          }`}
                        >
                          {transaction.transactionType === "issue" ? "-" : "+"}
                          {Math.abs(transaction.quantity)} kg
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="fw-bold">
                          {transaction.closingBalance} kg
                        </span>
                      </td>
                      <td className="text-center">
                        <small className="text-muted">
                          {transaction.remarks}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer bg-white border-top">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted small">
                Showing {transactions.length} transactions
              </div>
              <button className="btn btn-sm btn-outline-primary">
                <i className="bi bi-download me-1"></i>
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentTransactions;
