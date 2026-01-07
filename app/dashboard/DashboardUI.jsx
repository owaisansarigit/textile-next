"use client";
export const StatsCard = ({ label, value, color = "primary" }) => {
  return (
    <div
      className={`bg-white p-3 rounded shadow-sm border-top border-4 border-${color} text-center`}
    >
      <div className="text-uppercase small text-muted fw-bold">{label}</div>
      <div className="fs-4 fw-bold text-dark">{value}</div>
    </div>
  );
};

export const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  return (
    <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-light border-top">
      <span className="small text-muted fw-bold">
        {currentPage} / {totalPages} Pages
      </span>

      <div className="btn-group btn-group-sm">
        <button
          className="btn btn-outline-secondary"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Prev
        </button>

        <button
          className="btn btn-outline-secondary"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const ViewSetModal = ({ isOpen, onClose, setData }) => {
  if (!isOpen || !setData) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show"></div>

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-md modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content shadow">
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title fw-bold">
                Set Details: {setData.setNo}
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              />
            </div>

            {/* Body */}
            <div className="modal-body p-0">
              <table className="table table-sm table-bordered mb-0 text-center">
                <thead className="table-light">
                  <tr>
                    <th>Beam</th>
                    <th>Cuts</th>
                    <th>Weaver</th>
                  </tr>
                </thead>
                <tbody>
                  {setData.beamDetails?.length ? (
                    setData.beamDetails.map((b, i) => (
                      <tr key={i}>
                        <td>{b.beamNo}</td>
                        <td>{b.cut}</td>
                        <td className="fw-bold">{b.weaver}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-muted py-3">
                        No beam data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                className="btn btn-secondary btn-sm fw-bold"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
