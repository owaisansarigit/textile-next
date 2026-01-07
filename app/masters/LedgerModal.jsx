"use client"
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { ledgerService } from "../../db/dbServices";

const LedgerModal = ({ show, onHide, editingLedger, groups }) => {
  const [form, setForm] = useState({
    name: "",
    alias: "",
    groupId: "",
    opYarnBalance: 0,
    opYarnBalanceDate: new Date().toISOString().split("T")[0],
  });  
  useEffect(() => {
    if (editingLedger) {
      setForm(editingLedger);
    } else {
      setForm({
        name: "",
        alias: "",
        groupId: "",
        opYarnBalance: 0,
        opYarnBalanceDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [editingLedger, show]);

  const handleSave = async () => {
    const finalForm = {
      ...form,
      alias: form.alias || form.name.trim(),
    };
    if (editingLedger) {
      await ledgerService.update(editingLedger.id, finalForm);
    } else {
      await ledgerService.create(finalForm);
    }
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {editingLedger ? "Edit Ledger" : "Create New Weaver Ledger"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Ledger Name *</Form.Label>
                <Form.Control
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter ledger name"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Alias (optional)</Form.Label>
                <Form.Control
                  type="text"
                  value={form.alias}
                  onChange={(e) => setForm({ ...form, alias: e.target.value })}
                  placeholder="Auto-filled from name"
                />
                <Form.Text className="text-muted">
                  Leave empty to use Ledger Name as alias
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Under Group *</Form.Label>
            <Form.Select
              value={form.groupId}
              onChange={(e) => setForm({ ...form, groupId: e.target.value })}
              required
            >
              <option value="">Select a group...</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Opening Yarn Balance (kg)</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.opYarnBalance}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      opYarnBalance: Number(e.target.value) || 0,
                    })
                  }
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>As On Date</Form.Label>
                <Form.Control
                  type="date"
                  value={form.opYarnBalanceDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      opYarnBalanceDate: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          {editingLedger ? "Update" : "Create"} Ledger
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LedgerModal;
