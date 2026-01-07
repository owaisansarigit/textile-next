import React from "react";

export const PipeHistoryModal = ({ pipeNo, history, onClose }) => {
  if (!pipeNo) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="p-5 border-b flex justify-between items-center bg-slate-50">
          <h2 className="font-black text-slate-800 uppercase tracking-tight">
            Life Cycle: Pipe {pipeNo}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-slate-600"
          >
            &times;
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {history.length > 0 ? (
            <div className="space-y-6">
              {history.map((h, i) => (
                <div
                  key={i}
                  className="relative pl-6 border-l-2 border-indigo-100 pb-2"
                >
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white shadow-sm"></div>
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-black text-indigo-600 uppercase">
                      {h.type || "RECEIVED"}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400">
                      {h.date}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-slate-700 mt-1">
                    At {h.weaver}{" "}
                    <span className="text-slate-400 font-normal">
                      for Set {h.setNo}
                    </span>
                  </p>
                  {h.slipNo && (
                    <p className="text-[10px] text-slate-500">
                      Slip: {h.slipNo}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-400 py-10 font-medium">
              No movement history found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
