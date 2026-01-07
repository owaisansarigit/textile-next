"use client"
import { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { groupService } from "../../db/dbServices";

const GroupModal = ({ show, onHide, editingGroup }) => {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingGroup) {
      setName(editingGroup.name || "");
    } else {
      setName("");
    }
    setErrors({});
    if (show) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [editingGroup, show]);

  const validate = () => {
    if (!name.trim()) {
      setErrors({ name: "Group name is required" });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (editingGroup) {
        await groupService.update(editingGroup.id, name);
      } else {
        await groupService.create(name);
      }
      onHide();
    } catch (err) {
      console.error(err);
      setErrors({ submit: "Failed to save group. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this group permanently?")) return;

    setIsSubmitting(true);
    try {
      await groupService.delete(editingGroup.id);
      onHide();
    } catch (err) {
      setErrors({
        submit: "Failed to delete group. It may have linked ledgers.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {editingGroup ? "Edit Group" : "Create New Group"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {errors.submit && (
          <Alert variant="danger" className="mb-3">
            {errors.submit}
          </Alert>
        )}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Group Name *</Form.Label>
            <Form.Control
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sundry Creditors"
              isInvalid={!!errors.name}
              disabled={isSubmitting}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        {editingGroup && (
          <Button
            variant="outline-danger"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="me-auto"
          >
            Delete Group
          </Button>
        )}

        <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
          Cancel
        </Button>

        <Button variant="primary" onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : editingGroup
            ? "Update Group"
            : "Create Group"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GroupModal;
