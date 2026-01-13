"use client";
import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
const emptyForm = {
  name: "",
  alias: "",
  group: "",
  openingYarnBalance: [],
};
const emptyYarnRow = {
  yarn: "",
  quantityKg: 0,
  openingDate: new Date().toISOString().split("T")[0],
};
const LedgerModal = ({ show, onHide, editingLedger, groups, yarns }) => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setForm(editingLedger || emptyForm);
  }, [editingLedger, show]);
  const updateField = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const updateYarn = (i, key, value) => {
    const list = [...form.openingYarnBalance];
    list[i] = { ...list[i], [key]: value };
    updateField("openingYarnBalance", list);
  };
  const addYarn = () =>
    updateField("openingYarnBalance", [
      ...form.openingYarnBalance,
      emptyYarnRow,
    ]);
  const removeYarn = (i) =>
    updateField(
      "openingYarnBalance",
      form.openingYarnBalance.filter((_, idx) => idx !== i)
    );
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      alias: form.alias || form.name.trim(),
    };
    try {
      await fetch(
        editingLedger ? `/api/wledgers/${editingLedger._id}` : "/api/wledgers",
        {
          method: editingLedger ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      onHide();
      setForm(emptyForm);
    } catch (err) {
      console.error(err);
      alert("Failed to save ledger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {editingLedger ? "Edit Ledger" : "Create Weaver Ledger"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Control
                placeholder="Ledger Name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </Col>
            <Col md={6}>
              <Form.Control
                placeholder="Alias (optional)"
                value={form.alias}
                onChange={(e) => updateField("alias", e.target.value)}
              />
            </Col>
          </Row>

          <Form.Select
            className="mt-3"
            value={form.group}
            onChange={(e) => updateField("group", e.target.value)}
          >
            <option value="">Select Group</option>
            {groups.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </Form.Select>

          <hr />

          <h6>Opening Yarn Balances</h6>

          {form.openingYarnBalance.map((y, i) => (
            <Row key={i} className="mb-2">
              <Col md={4}>
                <Form.Select
                  value={y.yarn}
                  onChange={(e) => updateYarn(i, "yarn", e.target.value)}
                >
                  <option value="">Yarn</option>
                  {yarns.map((yr) => (
                    <option key={yr._id} value={yr._id}>
                      {yr.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={3}>
                <Form.Control
                  type="number"
                  placeholder="Kg"
                  value={y.quantityKg}
                  onChange={(e) =>
                    updateYarn(i, "quantityKg", +e.target.value || 0)
                  }
                />
              </Col>

              <Col md={3}>
                <Form.Control
                  type="date"
                  value={y.openingDate}
                  onChange={(e) => updateYarn(i, "openingDate", e.target.value)}
                />
              </Col>

              <Col md={2}>
                <Button variant="outline-danger" onClick={() => removeYarn(i)}>
                  ✕
                </Button>
              </Col>
            </Row>
          ))}

          <Button size="sm" variant="outline-primary" onClick={addYarn}>
            + Add Yarn
          </Button>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          {editingLedger ? "Update" : "Create"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LedgerModal;
