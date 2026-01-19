// "use client";
// import Header from "./Header";
// import StatsCards from "./StatsCards";
// import TransactionForm from "./TransactionForm";
// import RecentTransactions from "./RecentTransactions";
// import useTransactions from "./useTransactions";
// import { useState } from "react";

// export default function Dashboard() {
//   const { transactions, currentBalance, addTransaction, loading } =
//     useTransactions();
//   const [showForm, setShowForm] = useState(false);

//   return (
//     <div className="container py-4">
//       <Header
//         balance={currentBalance}
//         showForm={showForm}
//         toggleForm={() => setShowForm(!showForm)}
//       />

//       <StatsCards transactions={transactions} />

//       {showForm && (
//         <TransactionForm
//           balance={currentBalance}
//           onSubmit={(data) => {
//             addTransaction(data);
//             setShowForm(false);
//           }}
//         />
//       )}

//       <RecentTransactions transactions={transactions} loading={loading} />
//     </div>
//   );
// }
"use client";
import Header from "./Header";
import StatsCards from "./StatsCards";
import TransactionForm from "./TransactionForm";
import RecentTransactions from "./RecentTransactions";
import useTransactions from "./useTransactions";
import { useState } from "react";

export default function Dashboard() {
  const { transactions, currentBalance, addTransaction, loading } =
    useTransactions();

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="container py-4">
      <Header
        balance={currentBalance}
        showForm={showModal}
        toggleForm={() => setShowModal(true)}
      />
      <StatsCards transactions={transactions} />
      {showModal && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-dialog modal-md modal-dialog-centered">
              <div className="modal-content shadow-lg">
                <div className="modal-header">
                  <h5 className="modal-title">New Transaction</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  />
                </div>

                <div className="modal-body">
                  <TransactionForm
                    balance={currentBalance}
                    onSubmit={(data) => {
                      addTransaction(data);
                      setShowModal(false);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            style={{ backdropFilter: "blur(6px)" }}
          />
        </>
      )}

      <RecentTransactions transactions={transactions} loading={loading} />
    </div>
  );
}
