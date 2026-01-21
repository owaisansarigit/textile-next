import { useEffect, useState, useCallback } from "react";
import { calculateClosing } from "./utils";

export default function useTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [wLedgers, setWLedgers] = useState([]);
    const [yarns, setYarns] = useState([]);
    const [currentBalance, setCurrentBalance] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /* ---------- Helpers ---------- */
    const fetchJSON = async (url) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed: ${url}`);
        return res.json();
    };

    /* ---------- Fetch Transactions ---------- */
    const getTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const { data = [] } = await fetchJSON("/api/yarn-transactions");
            setTransactions(data);
            setCurrentBalance(data[0]?.closingBalance ?? 0);
        } catch (err) {
            console.error(err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    /* ---------- Add Transaction ---------- */
    const addTransaction = useCallback(
        async (tx) => {
            try {
                const closingBalance = calculateClosing(
                    tx.transactionType,
                    tx.openingBalance,
                    tx.quantity,
                );

                await fetch("/api/yarn-transactions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...tx, closingBalance }),
                });

                await getTransactions();
            } catch (err) {
                console.error(err);
                setError(err);
            }
        },
        [getTransactions],
    );

    /* ---------- Initial Load ---------- */
    useEffect(() => {
        (async () => {
            try {
                const [ledgerRes, yarnRes] = await Promise.all([
                    fetchJSON("/api/wledgers"),
                    fetchJSON("/api/yarn/stock"),
                ]);

                setWLedgers(ledgerRes?.data ?? []);
                setYarns(yarnRes ?? []);
                await getTransactions();
            } catch (err) {
                console.error(err);
                setError(err);
            }
        })();
    }, [getTransactions]);

    return {
        yarns,
        wLedgers,
        transactions,
        currentBalance,
        loading,
        error,
        addTransaction,
        refresh: getTransactions,
    };
}
