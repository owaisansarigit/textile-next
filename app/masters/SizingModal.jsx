"use client"
import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, Alert, Row, Col } from "react-bootstrap";
import { sizingService } from "../../db/dbServices";

const SizingModal = ({ show, onHide, editingSizing }) => {
  const [name, setName] = useState("");
  const [stock, setStock] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => {
    if (editingSizing) {
      setName(editingSizing.name || "");
      setStock(editingSizing.stock || []);
    } else {
      setName("");
      setStock([]);
    }
    setErrors({});
    if (show) setTimeout(() => nameRef.current?.focus(), 100);
  }, [editingSizing, show]);

  const addStockRow = () => {
    setStock([
      ...stock,
      { category: "", count: "", bagsBalance: 0, looseBalance: 0 },
    ]);
  };

  const updateStockRow = (index, field, value) => {
    const updated = [...stock];
    if (field === "bagsBalance" || field === "looseBalance") {
      updated[index][field] = Number(value) || 0;
    } else {
      updated[index][field] = value;
    }
    setStock(updated);
  };

  const removeStockRow = (index) => {
    setStock(stock.filter((_, i) => i !== index));
  };

  const validate = () => {
    if (!name.trim()) {
      setErrors({ name: "Sizing name is required" });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const data = {
        name: name.trim(),
        stock: stock.map((item) => ({
          category: item.category.trim(),
          count: item.count.trim(),
          bagsBalance: item.bagsBalance,
          looseBalance: item.looseBalance,
        })),
      };

      if (editingSizing) {
        await sizingService.updateSizing(editingSizing.id, data);
      } else {
        await sizingService.createSizing(data);
      }
      onHide();
    } catch (err) {
      console.error("Error saving sizing master:", err);
      setErrors({ submit: "Failed to save sizing master." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this sizing master permanently?")) return;
    try {
      await sizingService.deleteSizing(editingSizing.id);

      onHide();
    } catch (err) {
      setErrors({ submit: "Cannot delete: This sizing may be used in sets." });
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header closeButton={!isSubmitting}>
        <Modal.Title>
          {editingSizing ? "Edit Sizing Master" : "New Sizing Master"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {errors.submit && <Alert variant="danger">{errors.submit}</Alert>}

        <Form.Group className="mb-4">
          <Form.Label>Sizing Name *</Form.Label>
          <Form.Control
            ref={nameRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter sizing name"
            isInvalid={!!errors.name}
            disabled={isSubmitting}
          />
          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>
        </Form.Group>

        <div className="mb-4">
          <div className="d-flex justify-content-between mb-3">
            <Form.Label>Yarn Stock Details</Form.Label>
            <Button size="sm" onClick={addStockRow} disabled={isSubmitting}>
              + Add Stock Item
            </Button>
          </div>

          {stock.length === 0 ? (
            <div className="text-center text-muted py-4 border rounded bg-light">
              No stock items yet. Add yarn variants used in this sizing.
            </div>
          ) : (
            stock.map((item, idx) => (
              <Row key={idx} className="mb-3 g-2">
                <Col md={3}>
                  <Form.Control
                    placeholder="Category (e.g. Combed)"
                    value={item.category}
                    onChange={(e) =>
                      updateStockRow(idx, "category", e.target.value)
                    }
                  />
                </Col>
                <Col md={3}>
                  <Form.Control
                    placeholder="Count (e.g. 40s)"
                    value={item.count}
                    onChange={(e) =>
                      updateStockRow(idx, "count", e.target.value)
                    }
                  />
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="number"
                    placeholder="Bags"
                    value={item.bagsBalance}
                    onChange={(e) =>
                      updateStockRow(idx, "bagsBalance", e.target.value)
                    }
                  />
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="number"
                    step="0.01"
                    placeholder="Loose (kg)"
                    value={item.looseBalance}
                    onChange={(e) =>
                      updateStockRow(idx, "looseBalance", e.target.value)
                    }
                  />
                </Col>
                <Col md={2}>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeStockRow(idx)}
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            ))
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        {editingSizing && (
          <Button
            variant="outline-danger"
            onClick={handleDelete}
            className="me-auto"
            disabled={isSubmitting}
          >
            Delete Sizing
          </Button>
        )}
        <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : editingSizing ? "Update" : "Create"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SizingModal;
