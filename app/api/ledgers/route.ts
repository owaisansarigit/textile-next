// import {
//   getAllLedgers,
//   getLedgersByBalanceType,
//   createLedger,
// } from "./service";

// export const GET = async (req: Request) => {
//   const { searchParams } = new URL(req.url);
//   const balanceType = searchParams.get("balanceType");

//   if (balanceType === "CR" || balanceType === "DR") {
//     return Response.json({
//       success: true,
//       data: getLedgersByBalanceType(balanceType),
//     });
//   }

//   return Response.json({
//     success: true,
//     data: getAllLedgers(),
//   });
// };

// export const POST = async (req: Request) => {
//   try {
//     const body = await req.json();

//     const ledger = createLedger({
//       name: body.name,
//       balance: body.balance,
//       balanceType: body.balanceType,
//     });

//     return Response.json(
//       { success: true, data: ledger },
//       { status: 201 }
//     );
//   } catch {
//     return Response.json(
//       { success: false, message: "Invalid data" },
//       { status: 400 }
//     );
//   }
// };

import { getAllLedgers, createLedger } from "../ledgers/service";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const balanceType = searchParams.get("balanceType") as "CR" | "DR";

  const data = await getAllLedgers(balanceType);

  return Response.json({ success: true, data });
};

export const POST = async (req: Request) => {
  const body = await req.json();

  const ledger = await createLedger(body);

  return Response.json({ success: true, data: ledger }, { status: 201 });
};
