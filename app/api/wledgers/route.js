import { connectDB } from "../../lib/db/mongo";
import { WLedger } from "../../lib/db/models/wLedgerModel";
import { NextResponse } from "next/server";


const GET = async () => {
    await connectDB();
    const data = await WLedger.find()
        .populate('group')
        .populate('openingYarnBalance.yarn')
        .populate('currentYarnBalance.yarn');
    return NextResponse.json({ data });
}

const POST = async (req) => {
    await connectDB();
    const body = await req.json();
    const ledger = await WLedger.create(body);
    return NextResponse.json(ledger, { status: 201 });
}

export { GET, POST };