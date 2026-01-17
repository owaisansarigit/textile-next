import { useEffect, useState } from "react";
import { calculateClosing } from "./utils";

export default function TransactionForm({ onSubmit, onClose }) {
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

  /* -------- Auto opening balance -------- */
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

  /* ---------- Input change ---------- */
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

  /* ---------- Submit ---------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="row g-2">
          <div className="col-12">
            <label className="form-label">Transaction Type</label>
            <select
              name="transactionType"
              className="form-select form-select-sm"
              value={form.transactionType}
              onChange={handleChange}
            >
              <option value="issue">Issue</option>
              <option value="receipt">Receipt</option>
              <option value="adjustment">Adjustment</option>
            </select>
          </div>

          <div className="col-12">
            <label className="form-label">Weaver</label>
            <select
              name="wLedgerId"
              className="form-select form-select-sm"
              value={form.wLedgerId}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              {wLedgers.map((l) => (
                <option key={l._id} value={l._id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12">
            <label className="form-label">Yarn</label>
            <select
              name="yarnId"
              className="form-select form-select-sm"
              value={form.yarnId}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              {yarns.map((y) => (
                <option key={y._id} value={y._id}>
                  {y.name} ({y.category} {y.count})
                </option>
              ))}
            </select>
          </div>

          <div className="col-12">
            <label className="form-label">Quantity (kg)</label>
            <input
              type="number"
              name="quantity"
              className="form-control form-control-sm"
              value={form.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-6">
            <label className="form-label">Opening</label>
            <input
              readOnly
              className="form-control form-control-sm"
              value={form.openingBalance}
            />
          </div>

          <div className="col-6">
            <label className="form-label">Closing</label>
            <input
              readOnly
              className="form-control form-control-sm"
              value={form.closingBalance}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Remarks</label>
            <input
              name="remarks"
              className="form-control form-control-sm"
              value={form.remarks}
              onChange={handleChange}
            />
          </div>

          <div className="col-12 text-end mt-2">
            <button className="btn btn-primary btn-sm">Add</button>
          </div>
        </div>
      </form>
    </>
  );
}
