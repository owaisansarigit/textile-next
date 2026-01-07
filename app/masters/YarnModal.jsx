import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { yarnService } from "../../db/dbServices";

const categories = ["Cotton", "Rayon", "CP", "Roto"];
const counts = ["40", "42", "46", "60", "80"];

const YarnModal = ({ show, onHide, editingYarn }) => {
  const emptyForm = {
    name: "",
    count: "",
    category: "",
    bagWeight: 0,
    stockBags: 0,
    looseStock: 0.0,
  };
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingYarn) {
      setFormData({
        name: editingYarn.name || "",
        count: editingYarn.count || "",
        category: editingYarn.category || "",
        bagWeight: editingYarn.bagWeight || 0,
        stockBags: editingYarn.stockBags || 0,
        looseStock: editingYarn.looseStock || 0,
      });
    } else {
      setFormData(emptyForm);
    }
  }, [editingYarn]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingYarn) {
        alert(editingYarn.stockBags);
        await yarnService.update(editingYarn?.id, formData);
      } else {
        await yarnService.create(formData);
      }
      onHide();
      setFormData(emptyForm);
    } catch (err) {
      console.error(err);
      alert("Failed to save yarn master");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{editingYarn ? "Edit" : "Add"} Yarn Master</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Form.Group className="mb-3">
              <Form.Label>
                Bag Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="string"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Yarn Count <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="count"
                  value={formData.count}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Count</option>
                  {counts.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Category <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>
              Bag Weight (kg per bag) <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="bagWeight"
              value={formData.bagWeight}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Stock Bags</Form.Label>
                <Form.Control
                  type="number"
                  name="stockBags"
                  value={formData.stockBags}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Loose Stock (kg)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="looseStock"
                  value={formData.looseStock}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default YarnModal;
