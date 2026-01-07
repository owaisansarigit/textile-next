// import { getLedgerById, updateLedger, deleteLedger } from "../service";

// export const GET = async (
//   _req: Request,
//   { params }: { params: { id: string } }
// ) => {
//   const ledger = getLedgerById(params.id);

//   if (!ledger) {
//     return Response.json(
//       { success: false, message: "Ledger not found" },
//       { status: 404 }
//     );
//   }

//   return Response.json({ success: true, data: ledger });
// };

// export const PUT = async (
//   req: Request,
//   { params }: { params: { id: string } }
// ) => {
//   const body = await req.json();
//   const updated = updateLedger(params.id, body);

//   if (!updated) {
//     return Response.json(
//       { success: false, message: "Ledger not found" },
//       { status: 404 }
//     );
//   }

//   return Response.json({ success: true, data: updated });
// };

// export const DELETE = async (
//   _req: Request,
//   { params }: { params: { id: string } }
// ) => {
//   const deleted = deleteLedger(params.id);

//   if (!deleted) {
//     return Response.json(
//       { success: false, message: "Ledger not found" },
//       { status: 404 }
//     );
//   }

//   return Response.json({
//     success: true,
//     message: "Ledger deleted",
//   });
// };

import {
  getLedgerById,
  updateLedger,
  deleteLedger,
} from "@/lib/services/ledger.service";

export const GET = async (
  _req: Request,
  { params }: { params: { id: string } }
) => {
  const ledger = await getLedgerById(params.id);

  if (!ledger)
    return Response.json(
      { success: false, message: "Not found" },
      { status: 404 }
    );

  return Response.json({ success: true, data: ledger });
};

export const PUT = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const body = await req.json();
  const updated = await updateLedger(params.id, body);

  return Response.json({ success: true, data: updated });
};

export const DELETE = async (
  _req: Request,
  { params }: { params: { id: string } }
) => {
  await deleteLedger(params.id);
  return Response.json({ success: true });
};
