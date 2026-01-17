"use client";
import { useEffect, useState } from "react";
import { Card, Button, Table } from "react-bootstrap";
import GroupModal from "./GroupModal";
const GroupTab = () => {
  const [groups, setgroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  const getAll = async () => {
    try {
      const res = await fetch("/api/groups");
      const data = await res.json();
      setgroups(data?.data || []);
    } catch (error) {}
  };
  useEffect(() => {
    getAll();
  }, []);

  const handleEdit = (group) => {
    setEditingGroup(group);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingGroup(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingGroup(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      try {
        const res = await fetch(`/api/groups/${id}`, { method: "DELETE" });
      } catch (error) {
      } finally {
        getAll();
      }
    }
  };

  return (
    <>
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center bg-white">
          <h6 className="mb-0">Account Groups</h6>
          <Button variant="primary" size="sm" onClick={handleAddNew}>
            + New Group
          </Button>
        </Card.Header>

        <Table borderless hover className="mb-0">
          <thead className="bg-light">
            <tr>
              <th>Group Name</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.length > 0 ? (
              groups.map((g) => (
                <tr key={g._id}>
                  <td>{g.name}</td>
                  <td className="text-end">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(g)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(g._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center text-muted py-4">
                  No groups found. Click "+ New Group" to add one.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>

      <GroupModal
        show={showModal}
        getAll={getAll}
        onHide={closeModal}
        editingGroup={editingGroup}
      />
    </>
  );
};

export default GroupTab;
