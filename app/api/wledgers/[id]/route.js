
import { connectDB } from '../../../lib/db/connect'
import { WLedger } from "../../../lib/db/models/wLedgerModel";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    await connectDB();
    const ledger = await WLedger.findById(params.id).populate("group");
    if (!ledger) {
        return NextResponse.json(
            { message: "Ledger not found" },
            { status: 404 }
        );
    }
    return NextResponse.json(ledger);
}

export async function PUT(req, { params }) {
    await connectDB();
    const body = await req.json();
    const { id } = await params;
    const updated = await WLedger.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updated) { return NextResponse.json({ message: "Ledger not found" }, { status: 404 }); }
    return NextResponse.json(updated);
}

export async function DELETE(req, { params }) {
    await connectDB();
    const { id } = await params
    const deleted = await WLedger.findByIdAndDelete(id);
    if (!deleted) {
        return NextResponse.json(
            { message: "Ledger not found" },
            { status: 404 }
        );
    }
    return NextResponse.json({ success: true });
}
