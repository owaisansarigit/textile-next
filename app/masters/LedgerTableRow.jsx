"use client";
import { Button } from "react-bootstrap";
const LedgerTableRow = ({ ledger, groupName, onEdit, onDelete }) => {
  const {
    id: _id,
    name,
    alias,
    opYarnBalance,
    currentYarnBalance = 0,
  } = ledger;
  return (
    <tr key={id}>
      <td>{name}</td>
      <td>
        <small className="text-muted">{alias || "—"}</small>
      </td>
      <td>{groupName || "N/A"}</td>
      <td>{opYarnBalance} kg</td>
      <td
        className={`fw-bold ${
          currentYarnBalance > 0 ? "text-success" : "text-danger"
        }`}
      >
        {currentYarnBalance} kg
      </td>
      <td className="text-end">
        <Button
          variant="outline-secondary"
          size="sm"
          className="me-2"
          onClick={() => onEdit(ledger)}
        >
          Edit
        </Button>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => onDelete(ledger._id)}
        >
          Delete
        </Button>
      </td>
    </tr>
  );
};

export default LedgerTableRow;
