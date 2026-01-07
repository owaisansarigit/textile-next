import React from "react";
import { usePipeReceive } from "./usePipeRecieve";

export default function PipeReceiveForm() {
  const {
    form,
    setForm,
    suggestions,
    pipesForWeaver,
    handlePipeChange,
    submit,
  } = usePipeReceive();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-xl font-bold mb-6 text-slate-800 border-b pb-2">
        Receive Pipe Inward
      </h2>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">
              Weaver
            </label>
            <input
              list="weavers"
              className="w-full border p-2 rounded"
              value={form.weaver}
              onChange={(e) => setForm({ ...form, weaver: e.target.value })}
            />
            <datalist id="weavers">
              {suggestions.weaver.map((w) => (
                <option key={w} value={w} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">
              Pipe No
            </label>
            <input
              list="pipes"
              className="w-full border p-2 rounded"
              value={form.pipeNo}
              onChange={(e) => handlePipeChange(e.target.value)}
              required
            />
            <datalist id="pipes">
              {pipesForWeaver.map((p) => (
                <option key={p.pipeNo} value={p.pipeNo}>
                  {p.setNo}
                </option>
              ))}
            </datalist>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Slip No"
            className="border p-2 rounded"
            value={form.slipNo}
            onChange={(e) => setForm({ ...form, slipNo: e.target.value })}
            required
          />
          <input
            type="date"
            className="border p-2 rounded"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
        </div>
        <textarea
          placeholder="Description / Note"
          className="w-full border p-2 rounded h-20"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-bold py-3 rounded hover:bg-indigo-700"
        >
          RECORD RECEIPT
        </button>
      </form>
    </div>
  );
}
