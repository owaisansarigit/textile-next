"use client";
import { useSetsDashboard } from "./useSetDashboard";
import { StatsCard, Pagination, ViewSetModal } from "./DashboardUI";
import { SetsTable, BeamsTable } from "./DashboardTables";
import { EditBeamModal } from "./EditBeamModal";

export default function SetsDashboard() {
  const d = useSetsDashboard();

  if (d.loadingSets) {
    return <div className="py-5 text-center fw-bold">Loading...</div>;
  }

  return (
    <div className="container py-4">
      {/* Stats */}
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-sm-6 col-md-4 mb-3">
          <StatsCard label="Total Sets" value={d.sets.length} color="primary" />
        </div>
        <div className="col-12 col-sm-6 col-md-4 mb-3">
          <StatsCard
            label="In Godown"
            value={d.goddownBeams.length}
            color="warning"
          />
        </div>
      </div>

      {/* View Mode Switch */}
      <div className="d-flex justify-content-center gap-2 mb-4">
        {["sets", "allBeams", "goddown"].map((m) => (
          <button
            key={m}
            onClick={() => d.setViewMode(m)}
            className={`btn btn-sm fw-bold text-uppercase ${
              d.viewMode === m ? "btn-primary" : "btn-outline-secondary"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          {d.viewMode === "sets" ? (
            <SetsTable
              data={d.currentSets}
              onRowClick={(set) => {
                d.setViewingSet(set);
                d.setViewModalOpen(true);
              }}
            />
          ) : (
            <BeamsTable
              data={d.currentBeams}
              onEdit={d.handleEditClick}
              onShow={d.handleShowClick}
            />
          )}
        </div>

        <Pagination
          totalItems={
            d.viewMode === "sets"
              ? d.sets.length
              : d.viewMode === "allBeams"
              ? d.allBeams.length
              : d.goddownBeams.length
          }
          itemsPerPage={d.itemsPerPage}
          currentPage={d.viewMode === "sets" ? d.setsPage : d.beamsPage}
          onPageChange={d.viewMode === "sets" ? d.setSetsPage : d.setBeamsPage}
        />
      </div>

      {/* Modals */}
      <EditBeamModal
        isOpen={d.isEditModalOpen}
        onClose={() => d.setEditModalOpen(false)}
        beam={d.editingBeam}
        suggestions={d.suggestions}
        onSave={d.handleSaveBeam}
      />

      <ViewSetModal
        isOpen={d.isViewModalOpen}
        onClose={() => d.setViewModalOpen(false)}
        setData={d.viewingSet}
      />
    </div>
  );
}
