"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, Button, Table, Spinner } from "react-bootstrap";
import LedgerModal from "./LedgerModal";
import LedgerTableRow from "./LedgerTableRow";

const LedgerTab = () => {
  const [wledgers, setWledgers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [yarns, setYarns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLedger, setEditingLedger] = useState(null);

  const getAll = async () => {
    try {
      const res = await fetch("/api/wledgers");
      const data = await res.json();
      setWledgers(data?.data || []);
    } catch (error) {
      console.error("Failed to fetch ledgers:", error);
    }
  };

  const getGroups = async () => {
    try {
      const res = await fetch("/api/groups");
      const data = await res.json();
      setGroups(data?.data || []);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    }
  };

  const getYarns = async () => {
    try {
      const res = await fetch("/api/yarn");
      const data = await res.json();      
      setYarns(data || []);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([getAll(), getGroups(), getYarns()]);
      setLoading(false);
    };

    loadData();
  }, []);

  const groupMap = useMemo(() => {
    const map = {};
    groups.forEach((g) => {
      map[g._id] = g.name;
    });
    return map;
  }, [groups]);

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
    getAll();
  };

  const deleteLedger = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ledger?")) return;

    try {
      await fetch(`/api/wledgers/${id}`, { method: "DELETE" });
      setWledgers((prev) => prev.filter((l) => l._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete ledger.");
    }
  };

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
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <Spinner animation="border" size="sm" /> Loading ledgers...
                  </td>
                </tr>
              ) : wledgers.length > 0 ? (
                wledgers.map((ledger) => (
                  <LedgerTableRow
                    key={ledger._id}
                    ledger={ledger}
                    groupName={
                      groupMap[ledger?.group?._id] ||
                      ledger?.group?.name ||
                      "N/A"
                    }
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
        yarns={yarns}
      />
    </>
  );
};

export default LedgerTab;
