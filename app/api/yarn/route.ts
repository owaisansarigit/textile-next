import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db/mongo";
import { Yarn } from "../../lib/db/models/yarnModel";

export async function GET() {
  try {
    await connectDB();
    const yarns = await Yarn.find().sort({ createdAt: -1 });
    return NextResponse.json(yarns);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch yarns" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const yarn = await Yarn.create(body);
    return NextResponse.json(yarn, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create yarn" },
      { status: 400 }
    );
  }
}