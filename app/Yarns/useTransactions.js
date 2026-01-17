import { useEffect, useState } from "react";
import { calculateClosing } from "./utils";

export default function useTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentBalance, setCurrentBalance] = useState(210);

    const getTransactions = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch("/api/yarn-transactions");
            const data = await res.json();
            const fetchedTransactions = data?.data || [];
            setTransactions(fetchedTransactions);
            if (fetchedTransactions.length > 0) {
                setCurrentBalance(fetchedTransactions[0].closingBalance);
            }
        } catch (err) {
            console.error("Failed to fetch transactions:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const addTransaction = async (data) => {
        try {
            const closingBalance = calculateClosing(data.transactionType, data.openingBalance, data.quantity);
            const payload = { ...data, closingBalance, };
            const res = await fetch("/api/yarn-transactions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), });
            const savedTx = await res.json();
            console.log("Transaction saved:", savedTx);
            setTransactions((prev) => [savedTx.data, ...prev]);
            getTransactions()
            setCurrentBalance(closingBalance);
        } catch (error) {
            console.error("Failed to add transaction:", error);
        }
    };

    useEffect(() => {
        getTransactions()
    }, []);

    return { transactions, currentBalance, addTransaction, getTransactions, loading, error };
}
