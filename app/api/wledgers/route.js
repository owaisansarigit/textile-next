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
    },
    {
        "name": "Mahesh Textile",
        "alias": "MT-W",
        "group": "695fbc98671a96f61c0a005c",
        "opYarnBalance": 200,
        "opYarnBalanceDate": "2024-04-01T00:00:00.000Z",
        "currentYarnBalance": 160,
        "contact": {
            "phone": "9123456789",
            "address": "Ichalkaranji, Maharashtra"
        },
        "status": "active"
    },
    {
        "name": "Omkar Looms",
        "alias": "OML",
        "group": "695fbc98671a96f61c0a005c",
        "opYarnBalance": 50,
        "opYarnBalanceDate": "2024-04-01T00:00:00.000Z",
        "currentYarnBalance": 20,
        "contact": {
            "phone": "9012345678",
            "address": "Malegaon, Maharashtra"
        },
        "status": "active"
    },
    {
        "name": "Shiv Shakti Weaving",
        "alias": "SSW",
        "group": "695fbc98671a96f61c0a005c",
        "opYarnBalance": 300,
        "opYarnBalanceDate": "2024-04-01T00:00:00.000Z",
        "currentYarnBalance": 240,
        "contact": {
            "phone": "9988776655",
            "email": "shivshakti@loom.com",
            "address": "Varanasi, UP"
        },
        "status": "active"
    },
    {
        "name": "Patel Weavers",
        "alias": "PW-05",
        "group": "695fbc98671a96f61c0a005c",
        "opYarnBalance": 90,
        "opYarnBalanceDate": "2024-04-01T00:00:00.000Z",
        "currentYarnBalance": 90,
        "contact": {
            "phone": "9090909090",
            "address": "Surendranagar, Gujarat"
        },
        "status": "inactive"
    },
    {
        "name": "Kiran Powerloom",
        "alias": "KPL",
        "group": "695fbc98671a96f61c0a005c",
        "opYarnBalance": 140,
        "opYarnBalanceDate": "2024-04-01T00:00:00.000Z",
        "currentYarnBalance": 100,
        "contact": {
            "phone": "9555666777",
            "address": "Erode, Tamil Nadu"
        },
        "status": "active"
    },
    {
        "name": "Sai Nath Weaving",
        "alias": "SNW",
        "group": "695fbc98671a96f61c0a005c",
        "opYarnBalance": 60,
        "opYarnBalanceDate": "2024-04-01T00:00:00.000Z",
        "currentYarnBalance": 10,
        "contact": {
            "phone": "9444333222",
            "address": "Solapur, Maharashtra"
        },
        "status": "suspended"
    },
    {
        "name": "Vijay Textiles",
        "alias": "VT-W",
        "group": "695fbc98671a96f61c0a005c",
        "opYarnBalance": 180,
        "opYarnBalanceDate": "2024-04-01T00:00:00.000Z",
        "currentYarnBalance": 155,
        "contact": {
            "phone": "9333444555",
            "email": "vijay@textiles.com",
            "address": "Coimbatore, Tamil Nadu"
        },
        "status": "active"
    },
    {
        "name": "Ganesh Handloom",
        "alias": "GH-10",
        "group": "695fbc98671a96f61c0a005c",
        "opYarnBalance": 40,
        "opYarnBalanceDate": "2024-04-01T00:00:00.000Z",
        "currentYarnBalance": 40,
        "contact": {
            "phone": "9887766554",
            "address": "Chanderi, MP"
        },
        "status": "active"
    }
]

export async function GET() {
    await connectDB();
    const ledgers = await WLedger.find().populate("group")
    ledgers.forEach(g => console.log(`   • ${g.name} →  ${g.group.name}`))
    return NextResponse.json(ledgers);
}

export async function POST(req) {
    await connectDB();

    const body = await req.json();

    // set current balance = opening balance on creation
    body.currentYarnBalance = body.opYarnBalance || 0;

    const ledger = await WLedger.create(body);

    return NextResponse.json(ledger, { status: 201 });
}
