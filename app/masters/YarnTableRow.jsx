"use client";
import { Button } from "react-bootstrap";
const YarnTableRow = ({ yarn, onEdit, onDelete }) => {
  return (
    <tr>
      <td className="text-center">{yarn.name}</td>
      <td className="text-center">{yarn.count}</td>
      <td className="text-center">{yarn.category}</td>
      <td className="text-center">{yarn.stockBags || 0} bags</td>
      <td className="text-center">{yarn.stockWeight || 0} kg loose</td>
      <td className="text-end">
        <Button
          variant="outline-primary"
          className="me-2"
          size="sm"
          onClick={() => onEdit(yarn)}
        >
          Edit
        </Button>
        <Button
          // disabled
          variant="outline-danger"
          size="sm"
          onClick={() => onDelete(yarn._id)}
        >
          Delete
        </Button>
      </td>
    </tr>
  );
};

export default YarnTableRow;
