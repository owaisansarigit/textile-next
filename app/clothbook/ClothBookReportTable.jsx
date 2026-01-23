"use client";
import { Table, Form, Row, Col, Button, Badge, Spinner } from "react-bootstrap";
import { useState, useMemo } from "react";
import { useClothBook } from "./useClothBook";

export default function ClothBookReportTable() {
  const {
    clothBooks,
    loading,
    selectedDate,
    setSelectedDate,
    refetchClothBooks,
  } = useClothBook();

  const [filters, setFilters] = useState({
    weaver: "",
    cloth: "",
  });

  const resetFilters = () => setFilters({ weaver: "", cloth: "" });

  /* ================= TRANSFORM API DATA ================= */
  const rows = useMemo(() => {
    const map = {};

    clothBooks.forEach((cb) => {
      const weaver = cb.wLedgerId?.name || "Unknown";

      if (!map[weaver]) map[weaver] = { weaver, quantities: {} };

      cb.cloths.forEach((c) => {
        const clothName = c.cloth?.name;
        if (!clothName) return;

        map[weaver].quantities[clothName] =
          (map[weaver].quantities[clothName] || 0) + c.quantity;
      });
    });

    return Object.values(map);
  }, [clothBooks]);

  /* ================= QUALITIES ================= */
  const qualities = useMemo(
    () => [...new Set(rows.flatMap((r) => Object.keys(r.quantities)))],
    [rows],
  );

  /* ================= FILTER ================= */
  const isFiltered = filters.weaver || filters.cloth;

  const filteredRows = rows.filter(
    (r) => !filters.weaver || r.weaver === filters.weaver,
  );

  /* ================= TOTALS ================= */
  const columnTotals = useMemo(() => {
    const totals = {};
    qualities.forEach((q) => (totals[q] = 0));

    filteredRows.forEach((r) => {
      qualities.forEach((q) => {
        totals[q] += r.quantities[q] || 0;
      });
    });

    return totals;
  }, [filteredRows, qualities]);

  const grandTotal = Object.values(columnTotals).reduce((a, b) => a + b, 0);

  if (loading) return <Spinner animation="border" />;

  return (
    <>
      {/* ================= FILTER BAR ================= */}
      <Row className="mb-2 g-2 align-items-end">
        <Col md={2}>
          <Form.Control
            type="date"
            size="sm"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              refetchClothBooks(e.target.value);
            }}
          />
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

      {/* ================= MAIN TABLE ================= */}
      <div className="table-responsive">
        <Table
          bordered
          size="sm"
          className={`text-nowrap ${
            isFiltered ? "table-warning border-warning" : ""
          }`}
        >
          <thead className={isFiltered ? "table-warning" : "table-light"}>
            <tr>
              <th>#</th>
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
                    <td key={q} className="text-end py-1">
                      {r.quantities[q] || ""}
                    </td>
                  ))}
                  <td className="text-end fw-bold">{rowTotal}</td>
                </tr>
              );
            })}
          </tbody>

          <tfoot className="table-secondary fw-bold">
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
        <div className="mt-3" style={{ maxWidth: 350 }}>
          <h6 className="mb-2">Quality-wise Summary</h6>
          <Table bordered size="sm">
            <tbody>
              {qualities.map((q) => (
                <tr key={q}>
                  <td>{q}</td>
                  <td className="text-end fw-bold">{columnTotals[q]}</td>
                </tr>
              ))}
              <tr className="table-secondary fw-bold">
                <td>Total</td>
                <td className="text-end">{grandTotal}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}
