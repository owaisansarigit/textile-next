import React, { useState } from "react";
import { usePipeInventory } from "./usePipeInventory";
import { PipeTable } from "./PipeTables";
import { PipeHistoryModal } from "./PipeHistoryModal";

export default function PipeInventory() {
  const [activeTab, setActiveTab] = useState("godown");
  const d = usePipeInventory();

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h6 className="tracking-tight">Pipe Management</h6>

        <div className="flex bg-slate-100 p-1 rounded-xl border">
          <button
            onClick={() => setActiveTab("godown")}
            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "godown"
                ? "bg-white shadow-sm text-emerald-600"
                : "text-slate-500"
            }`}
          >
            GODOWN ({d.godownPipes.length})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "pending"
                ? "bg-white shadow-sm text-orange-600"
                : "text-slate-500"
            }`}
          >
            PENDING ({d.pendingPipes.length})
          </button>
        </div>
      </div>

      {activeTab === "godown" ? (
        <PipeTable
          data={d.godownPipes}
          type="godown"
          onPipeClick={d.setSelectedPipeNo}
        />
      ) : (
        <PipeTable
          data={d.pendingPipes}
          type="pending"
          onPipeClick={d.setSelectedPipeNo}
        />
      )}

      {/* MODAL */}
      <PipeHistoryModal
        pipeNo={d.selectedPipeNo}
        history={d.specificPipeHistory}
        onClose={() => d.setSelectedPipeNo(null)}
      />
    </div>
  );
}
