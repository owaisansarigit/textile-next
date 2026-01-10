import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db/mongo";
import { Yarn } from "../../../lib/db/models/yarnModel";
import mongoose from "mongoose";

type Params = {
  params: {
    id: string;
  };
};

export async function GET(_req: Request, { params }: Params) {
  try {
    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid yarn ID" }, { status: 400 });
    }

    const yarn = await Yarn.findById(id);

    if (!yarn) {
      return NextResponse.json({ error: "Yarn not found" }, { status: 404 });
    }

    return NextResponse.json(yarn);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch yarn" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid yarn ID" }, { status: 400 });
    }
    const updatedYarn = await Yarn.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedYarn) {
      return NextResponse.json({ error: "Yarn not found" }, { status: 404 });
    }
    return NextResponse.json(updatedYarn);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update yarn" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid yarn ID" }, { status: 400 });
    }
    const deletedYarn = await Yarn.findByIdAndDelete(id);
    if (!deletedYarn) {
      return NextResponse.json({ error: "Yarn not found" }, { status: 404 });
    }
    return NextResponse.json(deletedYarn);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update yarn" },
      { status: 400 }
    );
  }
}
