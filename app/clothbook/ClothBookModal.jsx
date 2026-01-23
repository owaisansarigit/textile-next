"use client";
import { Modal, Button, Form, Table, Spinner } from "react-bootstrap";
import { useClothBook } from "./useClothBook";
export default function ClothBookModal({ show, setShow }) {
  const {
    weavers,
    cloths,
    loading,
    error,
    ledgerId,
    setLedgerId,
    entries,
    addRow,
    updateRow,
    yarnSummary,
    payload,
  } = useClothBook();

  if (loading) return <Spinner animation="border" />;
  if (error) return <p>Failed to load data</p>;

  const handleSave = async () => {
    console.log("Payload to backend:", payload);
    // await api.post('/api/clothbook', payload)
    setShow(false);
  };

  return (
    <Modal
      size="md"
      centered
      show={show}
      onHide={() => setShow(false)}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Create Cloth Book</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Weaver Selection */}
        <Form.Group className="mb-3">
          <Form.Label>Weaver</Form.Label>
          <Form.Select
            value={ledgerId}
            onChange={(e) => setLedgerId(e.target.value)}
          >
            <option value="">Select Weaver</option>
            {weavers.map((w) => (
              <option key={w._id} value={w._id}>
                {w.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Cloth Entries */}
        <Table bordered>
          <thead>
            <tr>
              <th width="40%">Cloth</th>
              <th width="20%">Quantity</th>
              <th width="20%">Weight / Pcs</th>
              <th width="20%">Yarn Kg</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((row, index) => {
              const cloth = cloths.find((c) => c._id === row.clothId);

              return (
                <tr key={index}>
                  <td>
                    <Form.Select
                      value={row.clothId}
                      onChange={(e) =>
                        updateRow(index, "clothId", e.target.value)
                      }
                    >
                      <option value="">Select Cloth</option>
                      {cloths.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name} ({c.yarnCategory} {c.yarnCount})
                        </option>
                      ))}
                    </Form.Select>
                  </td>

                  <td>
                    <Form.Control
                      type="number"
                      min="0"
                      value={row.quantity}
                      onChange={(e) =>
                        updateRow(index, "quantity", e.target.value)
                      }
                    />
                  </td>

                  <td>{cloth ? cloth.weightPerPcs.toFixed(3) : "-"}</td>

                  <td>
                    <strong>{row.yarnWeight.toFixed(3)}</strong>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        <Button variant="secondary" onClick={addRow}>
          + Add Cloth
        </Button>

        {/* Yarn Summary */}
        {yarnSummary.length > 0 && (
          <>
            <hr />
            <h6>Yarn Consumption Summary</h6>
            <Table bordered size="sm">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Count</th>
                  <th>Total Kg</th>
                </tr>
              </thead>
              <tbody>
                {yarnSummary.map((y, i) => (
                  <tr key={i}>
                    <td>{y.yarnCategory}</td>
                    <td>{y.yarnCount}</td>
                    <td>{y.quantityKg.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Cancel
        </Button>
        <Button
          variant="primary"
          disabled={!ledgerId || entries.length === 0}
          onClick={handleSave}
        >
          Save Cloth Book
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
