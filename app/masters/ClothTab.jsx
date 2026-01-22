// "use client"
// import { useState } from "react";
// import { useLiveQuery } from "dexie-react-hooks";
// import { Card, Button, Table, Spinner, Alert } from "react-bootstrap";
// import textileDB from "../../db/textileDB";
// import ClothModal from "./ClothModal";
// import ClothTableRow from "./ClothTableRow";

// const ClothTab = () => {
//   const cloths = useLiveQuery(() => textileDB.cloth.toArray(), [], []);
//   const [showModal, setShowModal] = useState(false);
//   const [editingCloth, setEditingCloth] = useState(null);
//   const [loadError, setLoadError] = useState(false);

//   const openCreate = () => {
//     setEditingCloth(null);
//     setShowModal(true);
//   };

//   const openEdit = (cloth) => {
//     setEditingCloth(cloth);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setEditingCloth(null);
//   };

//   const isLoading = cloths === undefined && !loadError;

//   return (
//     <>
//       <Card className="shadow-sm">
//         <Card.Header className="d-flex justify-content-between align-items-center bg-white">
//           <h6 className="mb-0">Cloth Quality Masters</h6>
//           <Button variant="primary" size="sm" onClick={openCreate}>
//             + Add Cloth
//           </Button>
//         </Card.Header>

//         <div className="table-responsive">
//           {loadError ? (
//             <Alert variant="danger" className="m-3">
//               Failed to load cloth masters.
//             </Alert>
//           ) : (
//             <Table hover className="mb-0">
//               <thead className="bg-light">
//                 <tr>
//                   <th>Name</th>
//                   <th>Alias</th>
//                   <th>Yarn Category</th>
//                   <th>Weight (kg)</th>
//                   <th>Stock</th>
//                   <th>Last Stock Date</th>
//                   <th className="text-end">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {isLoading ? (
//                   <tr>
//                     <td colSpan="6" className="text-center py-5">
//                       <Spinner animation="border" size="sm" className="me-2" />
//                       Loading...
//                     </td>
//                   </tr>
//                 ) : cloths.length > 0 ? (
//                   cloths.map((cloth) => (
//                     <ClothTableRow
//                       key={cloth.id}
//                       cloth={cloth}
//                       onEdit={openEdit}
//                     />
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="6" className="text-center text-muted py-5">
//                       No cloth qualities found.
//                       <br />
//                       <small>Click "+ Add Cloth" to create one.</small>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </Table>
//           )}
//         </div>
//       </Card>

//       <ClothModal
//         show={showModal}
//         onHide={closeModal}
//         editingCloth={editingCloth}
//       />
//     </>
//   );
// };

// export default ClothTab;

"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, Button, Table, Spinner, Alert } from "react-bootstrap";
import ClothModal from "./ClothModal";
import ClothTableRow from "./ClothTableRow";

const ClothTab = () => {
  const [cloths, setCloths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingCloth, setEditingCloth] = useState(null);

  const fetchCloths = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(false);
      const res = await fetch("/api/cloths");
      if (!res.ok) {
        throw new Error("Failed to fetch cloths");
      }

      const data = await res.json();
      setCloths(data.data);
    } catch (err) {
      console.error(err);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCloths();
  }, [fetchCloths]);

  const openCreate = () => {
    setEditingCloth(null);
    setShowModal(true);
  };

  const openEdit = (cloth) => {
    setEditingCloth(cloth);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCloth(null);
  };

  return (
    <>
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center bg-white">
          <h6 className="mb-0">Cloth Quality Masters</h6>
          <Button variant="primary" size="sm" onClick={openCreate}>
            + Add Cloth
          </Button>
        </Card.Header>

        <div className="table-responsive">
          {loadError ? (
            <Alert variant="danger" className="m-3">
              Failed to load cloth masters.
            </Alert>
          ) : (
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Name</th>
                  <th>Alias</th>
                  <th>Yarn Category</th>
                  <th>Weight (kg)</th>
                  <th>Stock</th>
                  <th>Last Stock Date</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <Spinner animation="border" size="sm" className="me-2" />
                      Loading...
                    </td>
                  </tr>
                ) : cloths.length > 0 ? (
                  cloths.map((cloth) => (
                    <ClothTableRow
                      key={cloth.id}
                      cloth={cloth}
                      onEdit={openEdit}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-5">
                      No cloth qualities found.
                      <br />
                      <small>Click "+ Add Cloth" to create one.</small>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </div>
      </Card>

      <ClothModal
        show={showModal}
        onHide={closeModal}
        editingCloth={editingCloth}
        onSuccess={fetchCloths} // 🔑 call after save/update
      />
    </>
  );
};

export default ClothTab;
