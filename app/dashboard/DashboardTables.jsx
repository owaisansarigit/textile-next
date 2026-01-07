export const SetsTable = ({ data, onRowClick }) => {
  return (
    <table className="table table-sm table-hover align-middle mb-0">
      <thead className="table-light border-bottom">
        <tr className="text-uppercase small text-muted fw-bold">
          <th className="px-3 py-2">Date</th>
          <th className="px-3 py-2 text-start">Set No</th>
          <th className="px-3 py-2 text-start">Sizing</th>
          <th className="px-3 py-2 text-end">Balance</th>
        </tr>
      </thead>

      <tbody>
        {data.map((set) => (
          <tr key={set._id} role="button" onClick={() => onRowClick(set)}>
            <td className="px-3 py-2 text-muted">{set.date}</td>

            <td className="px-3 py-2 fw-bold text-start">{set.setNo}</td>

            <td className="px-3 py-2 text-start">{set.sizing}</td>

            <td className="px-3 py-2 fw-bold text-end text-primary">
              {set.closingBalance?.toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const BeamsTable = ({ data, onEdit, onShow }) => {
  return (
    <table className="table table-sm table-hover align-middle mb-0">
      <thead className="table-primary text-white">
        <tr className="text-uppercase small fw-bold">
          <th className="px-3 py-2">Set</th>
          <th className="px-3 py-2">Beam</th>
          <th className="px-3 py-2 text-start">Weaver</th>
          <th className="px-3 py-2">Date</th>
          <th className="px-3 py-2 text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        {data.map((b, i) => (
          <tr key={i}>
            <td className="px-3 py-2 fw-bold text-primary">{b.parentSetNo}</td>

            <td className="px-3 py-2 fw-semibold">{b.beamNo}</td>

            <td
              className={`px-3 py-2 text-start fw-bold ${
                b.weaver === "Goddown" ? "text-warning" : ""
              }`}
            >
              {b.weaver}
            </td>

            <td className="px-3 py-2 text-muted">{b.date}</td>

            <td className="px-3 py-2 text-center">
              <div className="btn-group btn-group-sm">
                <button
                  className="btn btn-outline-primary fw-bold"
                  onClick={() => onShow(b)}
                >
                  Show
                </button>

                <button
                  className="btn btn-dark fw-bold"
                  onClick={() => onEdit(b)}
                >
                  Edit
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
