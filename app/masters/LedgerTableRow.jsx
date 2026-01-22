"use client";
import { useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";

const YarnBalanceModal = ({ show, onHide, ledger, groupName }) => {
  const getTotalQuantity = (balanceArray) => {
    return balanceArray.reduce(
      (total, item) => total + (item.quantityKg || 0),
      0,
    );
  };

  const totalOpening = getTotalQuantity(ledger?.openingYarnBalance || []);
  const totalCurrent = getTotalQuantity(ledger?.currentYarnBalance || []);

  return (
    <Modal show={show} onHide={onHide} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>
          Yarn Balance Details - {ledger?.name}
          {groupName && ` (${groupName})`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <div className="d-flex justify-content-between mb-3">
            <div>
              <h6>Opening Yarn Balance</h6>
              <h4 className="text-primary">{totalOpening.toFixed(2)} kg</h4>
            </div>
            <div>
              <h6>Current Yarn Balance</h6>
              <h4
                className={`fw-bold ${
                  totalCurrent > 0 ? "text-success" : "text-danger"
                }`}
              >
                {totalCurrent.toFixed(2)} kg
              </h4>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 mb-4">
            <h6>Current Balance Details</h6>
            {ledger?.currentYarnBalance?.length > 0 ? (
              <Table striped bordered size="sm">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Count</th>
                    <th>Quantity (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.currentYarnBalance.map((item, index) => (
                    <tr key={index}>
                      <td>{item.category || "—"}</td>
                      <td>{item.count || "—"}</td>
                      <td>{item.quantityKg?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="fw-bold">
                    <td colSpan="2">Total</td>
                    <td>{totalCurrent.toFixed(2)} kg</td>
                  </tr>
                </tfoot>
              </Table>
            ) : (
              <div className="text-muted p-3 border rounded text-center">
                No current yarn balance
              </div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 mb-4">
            <h6>Opening Balance Details</h6>
            {ledger?.openingYarnBalance?.length > 0 ? (
              <Table striped bordered size="sm">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Count</th>
                    <th>Quantity (kg)</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.openingYarnBalance.map((item, index) => (
                    <tr key={index}>
                      <td>{item.category || "—"}</td>
                      <td>{item.count || "—"}</td>
                      <td>{item.quantityKg?.toFixed(2)}</td>
                      <td>
                        {item.openingDate
                          ? new Date(item.openingDate).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="fw-bold">
                    <td colSpan="2">Total</td>
                    <td>{totalOpening.toFixed(2)} kg</td>
                    <td></td>
                  </tr>
                </tfoot>
              </Table>
            ) : (
              <div className="text-muted p-3 border rounded text-center">
                No opening yarn balance records
              </div>
            )}
          </div>
        </div>
        <div className="mt-4">
          <h6>Recent Yarn Transactions</h6>
          <div className="text-muted p-3 border rounded text-center">
            <p className="mb-0">Transaction history feature coming soon...</p>
            <small>
              This will show issue, receipt, and return transactions
            </small>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
const LedgerTableRow = ({ ledger, groupName, onEdit, onDelete }) => {
  const [showBalanceModal, setShowBalanceModal] = useState(false);

  const {
    name,
    alias,
    openingYarnBalance = [],
    currentYarnBalance = [],
  } = ledger;

  // Calculate totals
  const calculateTotal = (balanceArray) => {
    return balanceArray.reduce(
      (total, item) => total + (item.quantityKg || 0),
      0,
    );
  };

  const totalOpening = calculateTotal(openingYarnBalance);
  const totalCurrent = calculateTotal(currentYarnBalance);

  // Group by category for summary display
  const getCategorySummary = (balanceArray) => {
    const summary = {};
    balanceArray.forEach((item) => {
      const key = `${item.category || "Unknown"}-${item.count || "N/A"}`;
      if (!summary[key]) {
        summary[key] = {
          category: item.category || "Unknown",
          count: item.count || "N/A",
          quantity: 0,
        };
      }
      summary[key].quantity += item.quantityKg || 0;
    });
    return Object.values(summary);
  };

  const openingSummary = getCategorySummary(openingYarnBalance);
  const currentSummary = getCategorySummary(currentYarnBalance);

  return (
    <>
      <tr key={ledger._id} className="align-middle">
        <td className="py-1">{name}</td>

        <td className="py-1">
          <small className="text-muted">{alias || "—"}</small>
        </td>

        <td className="py-1">{groupName || "N/A"}</td>

        {/* Opening Balance */}
        <td className="py-1">
          <Button
            variant="link"
            className="p-0 text-decoration-none"
            onClick={() => setShowBalanceModal(true)}
            title="Click to view yarn details"
          >
            <div className="d-flex flex-column align-items-start lh-sm">
              <span className="fw-bold">{totalOpening.toFixed(2)} kg</span>

              <small className="text-muted lh-sm">
                {openingSummary.length > 0
                  ? openingSummary.map((item, idx) => (
                      <span key={idx}>
                        {item.category}-{item.count}: {item.quantity.toFixed(1)}{" "}
                        kg
                        {idx < openingSummary.length - 1 ? ", " : ""}
                      </span>
                    ))
                  : "No yarn"}
              </small>
            </div>
          </Button>
        </td>

        {/* Current Balance */}
        <td className="py-1">
          <Button
            variant="link"
            className={`p-0 text-decoration-none ${
              totalCurrent > 0 ? "text-success" : "text-danger"
            }`}
            onClick={() => setShowBalanceModal(true)}
            title="Click to view yarn details"
          >
            <div className="d-flex flex-column align-items-start lh-sm">
              <span className="fw-bold">{totalCurrent.toFixed(2)} kg</span>

              <small className="text-muted lh-sm">
                {currentSummary.length > 0
                  ? currentSummary.map((item, idx) => (
                      <span key={idx}>
                        {item.category}-{item.count}: {item.quantity.toFixed(1)}{" "}
                        kg
                        {idx < currentSummary.length - 1 ? ", " : ""}
                      </span>
                    ))
                  : "No balance"}
              </small>
            </div>
          </Button>
        </td>

        <td className="py-1 text-end">
          <Button
            variant="outline-secondary"
            size="sm"
            className="me-2"
            onClick={() => onEdit(ledger)}
          >
            Edit
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onDelete(ledger._id)}
          >
            Delete
          </Button>
        </td>
      </tr>

      <YarnBalanceModal
        show={showBalanceModal}
        onHide={() => setShowBalanceModal(false)}
        ledger={ledger}
        groupName={groupName}
      />
    </>
  );
};

export default LedgerTableRow;
