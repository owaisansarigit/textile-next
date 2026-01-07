"use client"
import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Card, Button, Table, Spinner } from "react-bootstrap";
import textileDB from "../../db/textileDB";
import YarnModal from "./YarnModal";
import YarnTableRow from "./YarnTableRow";
import { yarnService } from "../../db/dbServices";

const YarnTab = () => {
  const yarns = useLiveQuery(() => textileDB.yarn.toArray(), [], []);
  const [showModal, setShowModal] = useState(false);
  const [editingYarn, setEditingYarn] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this yarn master?")) {
      try {
        await yarnService.delete(id);
      } catch (err) {
        console.error(err);
        alert("Failed to delete yarn master");
      }
    }
  };

  const openCreate = () => {
    setEditingYarn(null);
    setShowModal(true);
  };

  const openEdit = (yarn) => {
    setEditingYarn(yarn);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingYarn(null);
  };

  const isLoading = yarns === undefined;

  return (
    <>
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center bg-white">
          <h6 className="mb-0">Yarn Masters</h6>
          <Button variant="primary" size="sm" onClick={openCreate}>
            + Add Yarn
          </Button>
        </Card.Header>

        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Count</th>
                <th>Category</th>
                <th>Bags in Stock</th>
                <th>Quantity (kg)</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <Spinner animation="border" size="sm" className="me-2" />
                    Loading yarn masters...
                  </td>
                </tr>
              ) : yarns.length > 0 ? (
                yarns.map((yarn) => (
                  <YarnTableRow
                    key={yarn.id}
                    yarn={yarn}
                    onDelete={handleDelete}
                    onEdit={openEdit}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-5">
                    No yarn masters found.
                    <br />
                    <small>
                      Click "+ Add Yarn" to create your first yarn (e.g., 40s
                      Cotton).
                    </small>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      <YarnModal
        show={showModal}
        onHide={closeModal}
        editingYarn={editingYarn}
      />
    </>
  );
};

export default YarnTab;
