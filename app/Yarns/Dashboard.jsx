"use client";
import Header from "./Header";
import StatsCards from "./StatsCards";
import TransactionForm from "./TransactionForm";
import RecentTransactions from "./RecentTransactions";
import useTransactions from "./useTransactions";
import { TX_META } from "./utils";
import { useState } from "react";

export default function Dashboard() {
  const { transactions, currentBalance, addTransaction } = useTransactions();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="container py-4">
      <Header
        balance={currentBalance}
        showForm={showForm}
        toggleForm={() => setShowForm(!showForm)}
      />

      <StatsCards transactions={transactions} />

      {showForm && (
        <TransactionForm
          balance={currentBalance}
          onSubmit={(data) => {
            addTransaction(data);
            setShowForm(false);
          }}
        />
      )}

      <RecentTransactions
        transactions={transactions}
        getTransactionBadge={(t) => TX_META[t].badge}
        getTransactionIcon={(t) => TX_META[t].icon}
      />
    </div>
  );
}
