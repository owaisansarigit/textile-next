import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db/connect";
import { YarnTransactions } from "../../lib/db/models/yarnTransactionModel";
import { WLedger } from "../../lib/db/models/wLedgerModel";
import { Yarn } from "@/app/lib/db/models/yarnModel";

export async function GET() {
  try {
    await connectDB();
    const yarnTransactions = await YarnTransactions.find()
      .populate("wLedgerId")
      .populate("yarnId")
      .sort({
        createdAt: -1,
      });
    return NextResponse.json({ data: yarnTransactions });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch yarnTransactions" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const {
      wLedgerId,
      yarnId,
      transactionType,
      quantity,
      remarks,
      clothBookId,
    } = await req.json();

    console.log("📥 Request body received");

    const yarn = await Yarn.findById(yarnId);
    if (!yarn)
      return NextResponse.json({ error: "Yarn not found" }, { status: 404 });

    const wLedger = await WLedger.findById(wLedgerId);
    if (!wLedger)
      return NextResponse.json({ error: "WLedger not found" }, { status: 404 });

    let ledgerYarn = wLedger.currentYarnBalance.find(
      (y: any) => y.category === yarn.category && y.count === yarn.count,
    );

    if (!ledgerYarn) {
      console.log("➕ Creating new yarn balance entry");
      ledgerYarn = {
        category: yarn.category,
        count: yarn.count,
        quantityKg: 0,
      };
      wLedger.currentYarnBalance.push(ledgerYarn);
    }

    const openingBalance = ledgerYarn.quantityKg;
    let closingBalance = openingBalance;

    if (transactionType === "issue") {
      if (!clothBookId) {
        closingBalance += quantity; // yarn issued to weaver
      } else {
        if (openingBalance < quantity) {
          return NextResponse.json(
            { error: "Insufficient yarn balance in WLedger" },
            { status: 400 },
          );
        }
        closingBalance -= quantity; // yarn consumed
      }

      ledgerYarn.quantityKg = closingBalance;
    }

    await wLedger.save();
    console.log("💾 WLedger updated");

    const transaction = await YarnTransactions.create({
      wLedgerId,
      yarnId,
      clothBookId,
      transactionType,
      quantity,
      openingBalance,
      closingBalance,
      remarks,
    });

    console.log("🧾 Transaction saved:", transaction._id);

    return NextResponse.json({ created: transaction }, { status: 201 });
  } catch (error: any) {
    console.error("🔥 Yarn transaction error", error);
    return NextResponse.json(
      { error: error.message || "Failed to save yarn transaction" },
      { status: 500 },
    );
  }
}
