import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db/connect";
import { Yarn } from "../../../lib/db/models/yarnModel";
export async function GET() {
  try {
    await connectDB();
    const yarns = await Yarn.find().lean();
    const data = yarns.map((y) => {
      const stockBags = y.stockBags || 0;
      const looseStock = y.looseStock || 0;
      const bagWeight = y.bagWeight || 0;
      const availableKg = stockBags * bagWeight + looseStock;
      return {
        _id: y._id,
        name: y.name,
        category: y.category,
        count: y.count,
        bagWeight,

        stockBags,
        looseStock,
        stockWeight: y.stockWeight || 0,
        availableKg,
        availableBags: bagWeight ? Math.floor(availableKg / bagWeight) : 0,
      };
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch yarn stock" },
      { status: 500 },
    );
  }
}
