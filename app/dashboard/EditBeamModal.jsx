"use client";
import { useEffect } from "react";

export const EditBeamModal = ({
  isOpen,
  onClose,
  beam,
  onSave,
  suggestions,
}) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !beam) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show"></div>

      {/* Modal */}
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow">
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title fw-bold">Edit Beam {beam.beamNo}</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSave(new FormData(e.target));
              }}
            >
              <div className="modal-body">
                {/* Weaver */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-uppercase text-muted">
                    Weaver Name
                  </label>
                  <input
                    name="weaver"
                    list="weaver-options"
                    defaultValue={beam.weaver}
                    className="form-control form-control-sm"
                    autoComplete="off"
                    required
                  />
                  <datalist id="weaver-options">
                    {suggestions?.weaver?.map((name) => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                </div>

                {/* Slip No + Date */}
                <div className="row g-3">
                  <div className="col-6">
                    <label className="form-label small fw-bold text-uppercase text-muted">
                      Slip No
                    </label>
                    <input
                      name="slipNo"
                      defaultValue={beam.slipNo}
                      className="form-control form-control-sm"
                    />
                  </div>

                  <div className="col-6">
                    <label className="form-label small fw-bold text-uppercase text-muted">
                      Date
                    </label>
                    <input
                      name="date"
                      type="date"
                      defaultValue={beam.date}
                      className="form-control form-control-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-link text-muted fw-bold"
                  onClick={onClose}
                >
                  Cancel (Esc)
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm fw-bold"
                >
                  Update Beam
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
