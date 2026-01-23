"use client";
import { Table, Form, Row, Col, Button, Badge } from "react-bootstrap";
import { useState, useMemo } from "react";

export default function ClothBookReportTable() {
  const rows = [
    {
      weaver: "K.B",
      quantities: { "Cloth A": 10, "Cloth B": 5, "Cloth C": 2 },
    },
    { weaver: "R.A", quantities: { "Cloth A": 6, "Cloth B": 4, "Cloth C": 0 } },
    {
      weaver: "Qurban",
      quantities: { "Cloth A": 3, "Cloth B": 2, "Cloth C": 1 },
    },
  ];

  const qualities = useMemo(
    () => [...new Set(rows.flatMap((r) => Object.keys(r.quantities)))],
    [rows],
  );

  const [filters, setFilters] = useState({
    date: "today",
    weaver: "",
    cloth: "",
  });

  const resetFilters = () =>
    setFilters({ date: "today", weaver: "", cloth: "" });

  /* ===== Detect filtered state ===== */
  const isFiltered =
    filters.weaver || filters.cloth || filters.date !== "today";

  const filteredRows = rows.filter(
    (r) => !filters.weaver || r.weaver === filters.weaver,
  );

  const columnTotals = qualities.reduce((acc, q) => {
    acc[q] = filteredRows.reduce((s, r) => s + (r.quantities[q] || 0), 0);
    return acc;
  }, {});

  const grandTotal = Object.values(columnTotals).reduce((a, b) => a + b, 0);

  return (
    <>
      {/* ================= FILTER BAR ================= */}
      <Row className="mb-2 align-items-end g-2">
        <Col md={2}>
          <Form.Select
            size="sm"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="custom">Custom</option>
          </Form.Select>
        </Col>

        <Col md={2}>
          <Form.Select
            size="sm"
            value={filters.weaver}
            onChange={(e) => setFilters({ ...filters, weaver: e.target.value })}
          >
            <option value="">All Weavers</option>
            {[...new Set(rows.map((r) => r.weaver))].map((w) => (
              <option key={w}>{w}</option>
            ))}
          </Form.Select>
        </Col>

        <Col md={2}>
          <Form.Select
            size="sm"
            value={filters.cloth}
            onChange={(e) => setFilters({ ...filters, cloth: e.target.value })}
          >
            <option value="">All Qualities</option>
            {qualities.map((q) => (
              <option key={q}>{q}</option>
            ))}
          </Form.Select>
        </Col>

        <Col md={2}>
          <Button size="sm" variant="outline-secondary" onClick={resetFilters}>
            Reset
          </Button>
        </Col>

        {isFiltered && (
          <Col md="auto">
            <Badge bg="warning" text="dark">
              Filtered View
            </Badge>
          </Col>
        )}
      </Row>

      {/* ================= TABLE ================= */}
      <div className="table-responsive">
        <Table
          bordered
          size="sm"
          className={`text-nowrap align-middle ${
            isFiltered ? "table-warning border-warning" : ""
          }`}
        >
          <thead className={isFiltered ? "table-warning" : "table-light"}>
            <tr>
              <th style={{ width: 50 }}>#</th>
              <th>Weaver</th>
              {qualities.map((q) => (
                <th key={q} className="text-end">
                  {q}
                </th>
              ))}
              <th className="text-end">Total</th>
            </tr>
          </thead>

          <tbody>
            {filteredRows.map((r, i) => {
              const rowTotal = qualities.reduce(
                (s, q) => s + (r.quantities[q] || 0),
                0,
              );

              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{r.weaver}</td>
                  {qualities.map((q) => (
                    <td key={q} className="text-end py-1 px-2">
                      {r.quantities[q] || ""}
                    </td>
                  ))}
                  <td className="text-end fw-bold">{rowTotal}</td>
                </tr>
              );
            })}
          </tbody>

          <tfoot className="fw-bold table-secondary">
            <tr>
              <td colSpan={2}>Total</td>
              {qualities.map((q) => (
                <td key={q} className="text-end">
                  {columnTotals[q]}
                </td>
              ))}
              <td className="text-end">{grandTotal}</td>
            </tr>
          </tfoot>
        </Table>
        {/* ================= QUALITY SUMMARY ================= */}
        {qualities.length > 0 && (
          <div className="mt-3" style={{ maxWidth: 350 }}>
            <h6 className="mb-2">Quality-wise Summary</h6>

            <Table bordered size="sm" className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Quality</th>
                  <th className="text-end">Quantity</th>
                </tr>
              </thead>

              <tbody>
                {qualities.map((q) => (
                  <tr key={q}>
                    <td>{q}</td>
                    <td className="text-end fw-bold">{columnTotals[q]}</td>
                  </tr>
                ))}
              </tbody>

              <tfoot className="table-secondary fw-bold">
                <tr>
                  <td>Total</td>
                  <td className="text-end">{grandTotal}</td>
                </tr>
              </tfoot>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}
