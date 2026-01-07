import React from "react";

export const PipeTable = ({ data, type, onPipeClick }) => (
  <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
    <table className="w-full text-sm text-left">
      <thead
        className={`${
          type === "godown" ? "bg-emerald-600" : "bg-orange-500"
        } text-white`}
      >
        <tr className="text-[10px] uppercase font-black tracking-wider">
          <th className="p-4">Pipe No</th>
          <th className="p-4">Set No</th>
          <th className="p-4">
            {type === "godown" ? "Last Weaver" : "Current Weaver"}
          </th>
          <th className="p-4">
            {type === "godown" ? "Rec. Date" : "Issue Date"}
          </th>
          <th className="p-4 text-center">History</th>
        </tr>
      </thead>
      <tbody>
        {data.map((p, i) => (
          <tr key={i} className="border-b hover:bg-slate-50 transition-colors">
            <td className="p-4 font-black text-slate-700">{p.pipeNo}</td>
            <td className="p-4 font-bold text-indigo-600">{p.setNo}</td>
            <td className="p-4 font-medium">{p.weaver}</td>
            <td className="p-4 text-slate-500">{p.recDate || p.date || "-"}</td>
            <td className="p-4 text-center">
              <button
                onClick={() => onPipeClick(p.pipeNo)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-md text-[10px] font-bold transition-all"
              >
                VIEW LOG
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
