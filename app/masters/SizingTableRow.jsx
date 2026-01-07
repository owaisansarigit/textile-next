// src/components/masters/SizingTableRow.jsx
import React from "react";
import { Button, Badge } from "react-bootstrap";

const SizingTableRow = ({ sizing, onEdit }) => {
  const stockCount = sizing.stock?.length || 0;

  return (
    <tr>
      <td className="fw-medium align-middle">{sizing.name}</td>
      <td className="align-middle">
        {stockCount > 0 ? (
          <Badge bg="success" pill>
            {stockCount} stock item{stockCount > 1 ? "s" : ""}
          </Badge>
        ) : (
          <span className="text-muted fst-italic">No stock</span>
        )}
      </td>
      <td className="text-end align-middle">
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => onEdit(sizing)}
        >
          Edit
        </Button>
      </td>
    </tr>
  );
};

export default SizingTableRow;
