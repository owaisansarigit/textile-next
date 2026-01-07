import React, { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Card, Button, Table } from "react-bootstrap";
import textileDB from "../../db/textileDB";
import GroupModal from "./GroupModal";
import { groupService } from "../../db/dbServices";

const GroupTab = () => {
  const groups = useLiveQuery(() => textileDB.groups.toArray()) || [];
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

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
      await groupService.delete(id);
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
                <tr key={g.id}>
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
                      onClick={() => handleDelete(g.id)}
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
        onHide={closeModal}
        editingGroup={editingGroup}
      />
    </>
  );
};

export default GroupTab;
