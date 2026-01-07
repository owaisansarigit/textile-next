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
