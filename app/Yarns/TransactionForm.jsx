import { useEffect, useState } from "react";
import { calculateClosing } from "./utils";
export default function TransactionForm({ onSubmit }) {
  const [wLedgers, setWledgers] = useState([]);
  const [yarns, setYarns] = useState([]);

  const [form, setForm] = useState({
    wLedgerId: "",
    yarnId: "",
    transactionType: "issue",
    quantity: 0,
    openingBalance: 0,
    closingBalance: 0,
    remarks: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const [ledgerRes, yarnRes] = await Promise.all([
        fetch("/api/wledgers").then((r) => r.json()),
        fetch("/api/yarn").then((r) => r.json()),
      ]);
      setWledgers(ledgerRes?.data || []);
      setYarns(yarnRes || []);
    };

    fetchData();
  }, []);

  /* ----------- Auto opening balance ----------- */
  useEffect(() => {
    if (!form.wLedgerId || !form.yarnId) return;

    const ledger = wLedgers.find((l) => l._id === form.wLedgerId);
    const yarn = yarns.find((y) => y._id === form.yarnId);

    const match = ledger?.currentYarnBalance?.find(
      (b) => b.category === yarn?.category && b.count === yarn?.count,
    );

    const opening = match?.quantityKg ?? 0;

    setForm((p) => ({
      ...p,
      openingBalance: opening,
      closingBalance: calculateClosing(p.transactionType, opening, p.quantity),
    }));
  }, [form.wLedgerId, form.yarnId, wLedgers, yarns]);

  /* -------------- Input change --------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((p) => {
      const updated = {
        ...p,
        [name]: name === "quantity" ? Number(value) : value,
      };

      updated.closingBalance = calculateClosing(
        updated.transactionType,
        updated.openingBalance,
        updated.quantity,
      );

      return updated;
    });
  };

  /* ---------------- Submit ------------------- */
  const handleSubmit = (e) => {
    // e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Add Yarn Transaction</h5>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-3">
              <label>Transaction Type</label>
              <select
                name="transactionType"
                className="form-select"
                value={form.transactionType}
                onChange={handleChange}
              >
                <option value="issue">Issue</option>
                <option value="receipt">Receipt</option>
                <option value="adjustment">Adjustment</option>
              </select>
            </div>

            <div className="col-md-3">
              <label>Weaver</label>
              <select
                name="wLedgerId"
                className="form-select"
                value={form.wLedgerId}
                onChange={handleChange}
                required
              >
                <option value="">Select Weaver</option>
                {wLedgers.map((l) => (
                  <option key={l._id} value={l._id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label>Yarn</label>
              <select
                name="yarnId"
                className="form-select"
                value={form.yarnId}
                onChange={handleChange}
                required
              >
                <option value="">Select Yarn</option>
                {yarns.map((y) => (
                  <option key={y._id} value={y._id}>
                    {y.name} ({y.category} {y.count})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label>Quantity (kg)</label>
              <input
                type="number"
                name="quantity"
                className="form-control"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3">
              <label>Opening Balance</label>
              <input
                readOnly
                className="form-control"
                value={form.openingBalance}
              />
            </div>

            <div className="col-md-3">
              <label>Closing Balance</label>
              <input
                readOnly
                className="form-control"
                value={form.closingBalance}
              />
            </div>

            <div className="col-md-6">
              <label>Remarks</label>
              <input
                name="remarks"
                className="form-control"
                value={form.remarks}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 text-end">
              <button className="btn btn-primary">Add Transaction</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
