// "use client"
// import { useState, useEffect } from "react";
// import { Modal, Button, Form, Row, Col } from "react-bootstrap";
// import { useLiveQuery } from "dexie-react-hooks";
// import { yarnService, clothService } from "../../db/dbServices";

// const ClothModal = ({ show, onHide, editingCloth }) => {
//   const categories = ["Cotton", "Rayon", "CP", "Roto"];
//   const counts = ["40", "42", "46", "60", "80"];
//   const [formData, setFormData] = useState({
//     name: "",
//     alias: "",
//     yarnCategory: "",
//     yarnCount: "",
//     weightPerPcs: "",
//     stock: "",
//     stockDate: new Date().toISOString().split("T")[0],
//   });
//   const [loading, setLoading] = useState(false);
//   const yarns = useLiveQuery(() => yarnService.getAll(), []);

//   useEffect(() => {
//     if (editingCloth) {
//       setFormData({
//         name: editingCloth.name || "",
//         alias: editingCloth.alias || "",
//         yarnCategory: editingCloth.yarnCategory || "",
//         yarnCount: editingCloth.yarnCount || "",
//         weightPerPcs: editingCloth.weightPerPcs || "",
//         stock: editingCloth.stock || "",
//         stockDate:
//           editingCloth.stockDate || new Date().toISOString().split("T")[0],
//       });
//     } else {
//       setFormData({
//         name: "",
//         alias: "",
//         yarnCategory: "",
//         yarnCount: "",
//         weightPerPcs: "",
//         stock: "",
//         stockDate: new Date().toISOString().split("T")[0],
//       });
//     }
//   }, [editingCloth]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       if (editingCloth) {
//         await clothService.update(editingCloth.id, formData);
//       } else {
//         await clothService.create(formData);
//       }
//       onHide();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to save cloth master");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal show={show} onHide={onHide} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>{editingCloth ? "Edit" : "Add"} Cloth Quality</Modal.Title>
//       </Modal.Header>
//       <Form onSubmit={handleSubmit}>
//         <Modal.Body>
//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>
//                   Cloth Name <span className="text-danger">*</span>
//                 </Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Alias</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="alias"
//                   value={formData.alias}
//                   onChange={handleChange}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>
//                   Yarn Category <span className="text-danger">*</span>
//                 </Form.Label>
//                 <Form.Select
//                   name="yarnCategory"
//                   value={formData.yarnCategory}
//                   onChange={handleChange}
//                   required
//                   disabled={!yarns}
//                 >
//                   <option value="">Select Yarn Category</option>
//                   {categories?.map((cat, index) => (
//                     <option key={index} value={cat}>
//                       {cat}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>
//                   Yarn Count <span className="text-danger">*</span>
//                 </Form.Label>
//                 <Form.Select
//                   name="yarnCount"
//                   value={formData.yarnCount}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="">Select Yarn Count</option>
//                   {counts?.map((count, index) => (
//                     <option key={index} value={count}>
//                       {count}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Weight Per Piece (kg)</Form.Label>
//                 <Form.Control
//                   type="number"
//                   step="0.001"
//                   min="0"
//                   name="weightPerPcs"
//                   value={formData.weightPerPcs}
//                   onChange={handleChange}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Current Stock (pieces)</Form.Label>
//                 <Form.Control
//                   type="number"
//                   min="0"
//                   name="stock"
//                   value={formData.stock}
//                   onChange={handleChange}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Stock Date</Form.Label>
//                 <Form.Control
//                   type="date"
//                   name="stockDate"
//                   value={formData.stockDate}
//                   onChange={handleChange}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={onHide}>
//             Cancel
//           </Button>
//           <Button variant="primary" type="submit" disabled={loading}>
//             {loading ? "Saving..." : "Save"}
//           </Button>
//         </Modal.Footer>
//       </Form>
//     </Modal>
//   );
// };

// export default ClothModal;

"use client";

import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const ClothModal = ({ show, onHide, editingCloth, onSuccess }) => {
  const categories = ["Cotton", "Rayon", "CP", "Roto"];
  const counts = ["40", "42", "46", "60", "80"];

  const [formData, setFormData] = useState({
    name: "",
    alias: "",
    yarnCategory: "",
    yarnCount: "",
    weightPerPcs: "",
    stock: "",
    stockDate: new Date().toISOString().split("T")[0],
  });

  const [loading, setLoading] = useState(false);

  /* Populate form when editing */
  useEffect(() => {
    if (editingCloth) {
      setFormData({
        name: editingCloth.name || "",
        alias: editingCloth.alias || "",
        yarnCategory: editingCloth.yarnCategory || "",
        yarnCount: editingCloth.yarnCount || "",
        weightPerPcs: editingCloth.weightPerPcs || "",
        stock: editingCloth.stock || "",
        stockDate:
          editingCloth.stockDate || new Date().toISOString().split("T")[0],
      });
    } else {
      setFormData({
        name: "",
        alias: "",
        yarnCategory: "",
        yarnCount: "",
        weightPerPcs: "",
        stock: "",
        stockDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [editingCloth]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingCloth ? `/api/cloths/${editingCloth.id}` : "/api/cloths";

      const method = editingCloth ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to save cloth");
      }

      onHide();
      onSuccess?.(); // refresh table
    } catch (err) {
      console.error(err);
      alert("Failed to save cloth master");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{editingCloth ? "Edit" : "Add"} Cloth Quality</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Cloth Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Alias</Form.Label>
                <Form.Control
                  type="text"
                  name="alias"
                  value={formData.alias}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Yarn Category <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="yarnCategory"
                  value={formData.yarnCategory}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Yarn Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Yarn Count <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="yarnCount"
                  value={formData.yarnCount}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Yarn Count</option>
                  {counts.map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Weight Per Piece (kg)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.001"
                  min="0"
                  name="weightPerPcs"
                  value={formData.weightPerPcs}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Current Stock (pieces)</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Stock Date</Form.Label>
                <Form.Control
                  type="date"
                  name="stockDate"
                  value={formData.stockDate}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ClothModal;
