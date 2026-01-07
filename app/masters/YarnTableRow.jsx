"use client"
import { Button, Badge } from "react-bootstrap";

const YarnTableRow = ({ yarn, onEdit, onDelete }) => {
  return (
    <tr>
      <td className="fw-medium align-middle">{yarn.count}</td>
      <td className="align-middle">{yarn.category}</td>
      <td className="align-middle">
        <Badge bg="info" pill>
          {yarn.bagsStock || 0} bags
        </Badge>
      </td>
      <td className="align-middle">{yarn.looseStock || 0} kg loose</td>
      <td className="text-end align-middle">
        <Button
          variant="outline-primary"
          className="me-2"
          size="sm"
          onClick={() => onEdit(yarn)}
        >
          Edit
        </Button>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => onDelete(yarn.id)}
        >
          Delete
        </Button>
      </td>
    </tr>
  );
};

export default YarnTableRow;
