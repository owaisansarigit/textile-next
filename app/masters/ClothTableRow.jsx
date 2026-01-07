import { Button, Badge } from "react-bootstrap";
const ClothTableRow = ({ cloth, onEdit }) => {
  return (
    <tr>
      <td className="fw-medium align-middle">{cloth.name}</td>
      <td className="align-middle">{cloth.alias || "-"}</td>
      <td className="align-middle">{cloth.yarnCategory}</td>
      <td className="align-middle">{cloth.weightPerPcs || 0} kg/pcs</td>
      <td className="align-middle">
        <Badge bg="success" pill>
          {cloth.stock || 0} pcs
        </Badge>
      </td>
      <td className="align-middle text-muted small">
        {cloth.stockDate || "-"}
      </td>
      <td className="text-end align-middle">
        <Button
          disabled
          variant="outline-primary"
          size="sm"
          onClick={() => onEdit(cloth)}
        >
          Edit
        </Button>
      </td>
    </tr>
  );
};
export default ClothTableRow;