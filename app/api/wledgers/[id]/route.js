
import { connectDB } from '../../../lib/db/mongo'
import { WLedger } from "../../../lib/db/models/wLedgerModel";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    await connectDB();

    const ledger = await WLedger.findById(params.id).populate("group", "name");

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

    const updated = await WLedger.findByIdAndUpdate(
        params.id,
        body,
        { new: true, runValidators: true }
    );

    if (!updated) {
        return NextResponse.json(
            { message: "Ledger not found" },
            { status: 404 }
        );
    }

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
