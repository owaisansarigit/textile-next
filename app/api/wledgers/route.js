import { connectDB } from "../../lib/db/connect";
import { WLedger } from "../../lib/db/models/wLedgerModel";
import { NextResponse } from "next/server";

const dbConnect = async () => {
    try {
        await connectDB();
    } catch (err) {
        throw new Error("Database connection failed");
    }
};

export const GET = async () => {
    try {
        await dbConnect();

        const data = await WLedger.find().populate("group");

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
};

export const POST = async (req) => {
    try {
        await dbConnect();

        const body = await req.json();
        if (!body) {
            return NextResponse.json(
                { success: false, message: "Request body is required" },
                { status: 400 }
            );
        }

        const ledger = await WLedger.create(body);

        return NextResponse.json(
            { success: true, data: ledger },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
};
