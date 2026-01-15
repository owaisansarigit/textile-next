import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db/connect";
import { YarnTransactions } from "../../lib/db/models/yarnTransactionModel";

export async function GET() {
  try {
    await connectDB();
    const yarnTransactions = await YarnTransactions.find().sort({
      createdAt: -1,
    });
    return NextResponse.json(yarnTransactions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch yarnTransactions" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    console.log(body);
    // const created = await YarnTransactions.create(body);
    // return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create yarn" },
      { status: 400 }
    );
  }
}
