import { connectDB } from "../../lib/db/mongo";
import { WLedger } from "../../lib/db/models/wLedgerModel";
import { NextResponse } from "next/server";


/**
 * GET all weaving ledgers
 */
export async function GET() {
    await connectDB();

    const ledgers = await WLedger.find()
        .populate("group", "name")
        .sort({ name: 1 });

    return NextResponse.json(ledgers);
}

/**
 * CREATE weaving ledger
 */
export async function POST(req) {
    await connectDB();

    const body = await req.json();

    // set current balance = opening balance on creation
    body.currentYarnBalance = body.opYarnBalance || 0;

    const ledger = await WLedger.create(body);

    return NextResponse.json(ledger, { status: 201 });
}
