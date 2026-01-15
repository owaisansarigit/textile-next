const RecentTransactions = ({
  getTransactionBadge,
  transactions,
  getTransactionIcon,
}) => {
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
                    <th>Type</th>
                    <th>Date & Time</th>
                    <th>Warehouse</th>
                    <th>Yarn Type</th>
                    <th>Cloth Book</th>
                    <th>Quantity</th>
                    <th>Opening</th>
                    <th>Closing</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td>
                        <span
                          className={`badge ${getTransactionBadge(
                            transaction.transactionType
                          )}`}
                        >
                          <i
                            className={`bi ${getTransactionIcon(
                              transaction.transactionType
                            )} me-1`}
                          ></i>
                          {transaction.transactionType.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                        <div className="text-muted small">
                          {new Date(transaction.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td>
                        <i className="bi bi-building me-1 text-muted"></i>
                        {transaction.wLedgerId?.name}
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle me-2"
                            style={{
                              width: "12px",
                              height: "12px",
                              backgroundColor:
                                transaction.yarnId?.color || "#999",
                            }}
                          ></div>
                          {transaction.yarnId?.name}
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">
                          <i className="bi bi-journal-text me-1"></i>
                          {transaction.clothBookId?.bookNumber}
                        </span>
                      </td>
                      <td>
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
                      <td>
                        <span className="text-muted">
                          {transaction.openingBalance} kg
                        </span>
                      </td>
                      <td>
                        <span className="fw-bold">
                          {transaction.closingBalance} kg
                        </span>
                      </td>
                      <td>
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
// export default function RecentTransactions({
//   transactions,
//   getTransactionBadge,
//   getTransactionIcon,
// }) {
//   return (
//     <div className="card shadow-sm">
//       <div className="card-header">
//         <h5>Recent Transactions</h5>
//       </div>
//       <div className="table-responsive">
//         <table className="table">
//           <thead>
//             <tr>
//               <th>Type</th>
//               <th>Date</th>
//               <th>Warehouse</th>
//               <th>Yarn</th>
//               <th>Qty</th>
//               <th>Closing</th>
//             </tr>
//           </thead>
//           <tbody>
//             {transactions.map(t => (
//               <tr key={t._id}>
//                 <td>
//                   <span className={`badge ${getTransactionBadge(t.transactionType)}`}>
//                     <i className={`bi ${getTransactionIcon(t.transactionType)} me-1`} />
//                     {t.transactionType}
//                   </span>
//                 </td>
//                 <td>{new Date(t.createdAt).toLocaleString()}</td>
//                 <td>{t.wLedgerId?.name}</td>
//                 <td>{t.yarnId?.name}</td>
//                 <td>{t.quantity} kg</td>
//                 <td>{t.closingBalance} kg</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
