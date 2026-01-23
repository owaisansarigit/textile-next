"use client";
import { Button, Spinner } from "react-bootstrap";
import { useClothBook } from "./useClothBook";
import ClothBookModal from "./ClothBookModal";
import ClothBookReportTable from "./ClothBookReportTable";
import { useState } from "react";

export default function ClothBookPage() {
  const [show, setShow] = useState(false);
  const { loading, error } = useClothBook();

  if (loading) return <Spinner animation="border" />;
  if (error) return <p>Something went wrong</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h4>Day Book</h4>
        <Button onClick={() => setShow(true)}>Create Cloth Book</Button>
      </div>
      <ClothBookReportTable />
      <ClothBookModal show={show} setShow={setShow} />
    </div>
  );
}
