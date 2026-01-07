"use client"
import { useState, useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Card, Button, Table, Spinner } from "react-bootstrap";
import textileDB from "../../db/textileDB";
import LedgerModal from "./LedgerModal";
import LedgerTableRow from "./LedgerTableRow";

const LedgerTab = () => {  
  const groups = useLiveQuery(() => textileDB.groups.toArray(), [], []);
  const ledgers = useLiveQuery(() => textileDB.wLedgers.toArray(), [], []);

  const [showModal, setShowModal] = useState(false);
  const [editingLedger, setEditingLedger] = useState(null);

  const openEdit = (ledger) => {
    setEditingLedger(ledger);
    setShowModal(true);
  };

  const openCreate = () => {
    setEditingLedger(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingLedger(null);
  };

  const deleteLedger = async (id) => {
    if (window.confirm("Are you sure you want to delete this ledger?")) {
      try {
        await textileDB.wLedgers.delete(id);
      } catch (err) {
        alert("Failed to delete ledger. It may be in use.");
      }
    }
  };
  
  const groupMap = useMemo(() => {
    const map = {};
    groups.forEach((g) => {
      map[g.id] = g.name;
    });
    return map;
  }, [groups]);
  
  const isLoading = groups === undefined || ledgers === undefined;

  return (
    <>
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center bg-white">
          <h6 className="mb-0">Weaver Ledger List</h6>
          <Button variant="primary" size="sm" onClick={openCreate}>
            + Add Ledger
          </Button>
        </Card.Header>

        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Name</th>
                <th>Alias</th>
                <th>Group</th>
                <th>Op. Balance</th>
                <th>Current Balance</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <Spinner animation="border" size="sm" /> Loading ledgers...
                  </td>
                </tr>
              ) : ledgers.length > 0 ? (
                ledgers.map((ledger) => (
                  <LedgerTableRow
                    key={ledger.id}
                    ledger={ledger}
                    groupName={groupMap[ledger.groupId] || "N/A"}
                    onEdit={openEdit}
                    onDelete={deleteLedger}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-5">
                    No ledgers found.
                    <br />
                    <small>
                      Click "+ Add Ledger" to create your first one.
                    </small>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      <LedgerModal
        show={showModal}
        onHide={closeModal}
        editingLedger={editingLedger}
        groups={groups}
      />
    </>
  );
};

export default LedgerTab;
