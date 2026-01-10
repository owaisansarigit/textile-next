import { connectDB } from "../../lib/db/mongo";
import { WLedger } from "../../lib/db/models/wLedgerModel";
import { NextResponse } from "next/server";


const data = [
    {
        "name": "Ramesh Weaver",
        "alias": "RW-01",
        "group": "695fbc98671a96f61c0a005c",
        "opYarnBalance": 120,
        "opYarnBalanceDate": "2024-04-01T00:00:00.000Z",
        "currentYarnBalance": 120,
        "contact": {
            "phone": "9876543210",
            "email": "ramesh@weavers.com",
            "address": "Surat, Gujarat"
        },
        "status": "active"
    },
    {
        "name": "Suresh Weaver",
        "alias": "SW-02",
        "group": "695fbc98671a96f61c0a005c",
        "opYarnBalance": 85,
        "opYarnBalanceDate": "2024-04-01T00:00:00.000Z",
        "currentYarnBalance": 70,
        "contact": {
            "phone": "9898989898",
            "email": "suresh@weavers.com",
            "address": "Bhiwandi, Maharashtra"
        },
        "status": "active"
    }
]

const GET = async () => {
    await connectDB();
    // data.forEach(async (d) => WLedger.create(d))
    const ledgers = await WLedger.find().populate("group")
    ledgers.forEach(g => console.log(`   • ${g.name} →  ${g.group.name}`))
    return NextResponse.json(ledgers);
}

const POST = async (req) => {
    await connectDB();

    const body = await req.json();

    // set current balance = opening balance on creation
    body.currentYarnBalance = body.opYarnBalance || 0;

    const ledger = await WLedger.create(body);

    return NextResponse.json(ledger, { status: 201 });
}

export { GET, POST };