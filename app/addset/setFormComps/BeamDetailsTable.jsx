import React from "react";

const BeamDetailsTable = ({ beams, updateBeam, suggestions, date }) => (
  <div className="card mb-4 shadow-sm">
    <div className="card-header">
      <h6>Beam Details</h6>
    </div>
    <div className="card-body">
      {beams.length === 0 ? (
        <p className="text-muted text-center">
          Enter total beams to add details
        </p>
      ) : (
        <div className="table-responsive">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Beam No</th>
                <th>Cuts</th>
                <th>Weaver</th>
                <th>Pipe No</th>
                <th>Slip No</th>
                <th>Slip Date</th>
              </tr>
            </thead>
            <tbody>
              {beams.map((b, i) => (
                <tr key={i}>
                  <td>{b.beamNo}</td>
                  <td>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={b.cuts}
                      onChange={(e) => updateBeam(i, "cuts", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      list="weaverList"
                      className="form-control form-control-sm"
                      value={b.wLedgerId}
                      onChange={(e) =>
                        updateBeam(i, "wLedgerId", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={b.pipeNo}
                      onChange={(e) => updateBeam(i, "pipeNo", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={b.slipNo}
                      onChange={(e) => updateBeam(i, "slipNo", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={b.slipDate}
                      onChange={(e) =>
                        updateBeam(i, "slipDate", e.target.value)
                      }
                      defaultValue={date}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    <datalist id="weaverList">
      {suggestions.weaver.map((w) => (
        <option key={w} value={w} />
      ))}
    </datalist>
  </div>
);

export default BeamDetailsTable;
