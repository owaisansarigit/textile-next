"use client"
import React, { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Card, Button, Table, Spinner, Alert } from "react-bootstrap";
import textileDB from "../../db/textileDB";
import SizingModal from "./SizingModal";
import SizingTableRow from "./SizingTableRow";

const SizingTab = () => {
  const sizings = useLiveQuery(() => textileDB.sizing.toArray(), [], []);

  const [showModal, setShowModal] = useState(false);
  const [editingSizing, setEditingSizing] = useState(null);
  const [loadError, setLoadError] = useState(false);
    
  useLiveQuery(
    () => textileDB.sizing.toArray(),
    [],
    [],
    () => {},
    (err) => setLoadError(true)
  );

  const openCreate = () => {
    setEditingSizing(null);
    setShowModal(true);
  };

  const openEdit = (sizing) => {
    setEditingSizing(sizing);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSizing(null);
  };

  const isLoading = sizings === undefined && !loadError;

  return (
    <>
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center bg-white">
          <h6 className="mb-0">Sizing Masters</h6>
          <Button variant="primary" size="sm" onClick={openCreate}>
            + Add Sizing
          </Button>
        </Card.Header>

        <div className="table-responsive">
          {loadError ? (
            <Alert variant="danger" className="m-3">
              Failed to load sizing masters. Please refresh the page.
            </Alert>
          ) : (
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Sizing Name</th>
                  <th>Stock Items</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="3" className="text-center py-5">
                      <Spinner animation="border" size="sm" className="me-2" />
                      Loading sizing masters...
                    </td>
                  </tr>
                ) : sizings.length > 0 ? (
                  sizings.map((sizing) => (
                    <SizingTableRow
                      key={sizing.id}
                      sizing={sizing}
                      onEdit={openEdit}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted py-5">
                      No sizing masters found.
                      <br />
                      <small>
                        Click "+ Add Sizing" to create your first one (e.g.,
                        "40s Cotton").
                      </small>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </div>
      </Card>

      <SizingModal
        show={showModal}
        onHide={closeModal}
        editingSizing={editingSizing}
      />
    </>
  );
};

export default SizingTab;
