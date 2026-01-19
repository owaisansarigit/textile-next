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
      issueMode,
      quantity,
      bags,
      remarks,
      clothBookId,
    } = await req.json();

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
      ledgerYarn = {
        category: yarn.category,
        count: yarn.count,
        quantityKg: 0,
      };
      wLedger.currentYarnBalance.push(ledgerYarn);
    }

    const openingBalance = ledgerYarn.quantityKg;
    const bagWeight = yarn.bagWeight;

    /* ---------- Issued / Received KG ---------- */
    const txnKg = issueMode === "bag" ? (bags || 0) * bagWeight : quantity || 0;

    if (txnKg <= 0)
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });

    /* ---------- Update Weaver Ledger ---------- */
    const delta =
      transactionType === "issue"
        ? txnKg + openingBalance
        : txnKg - openingBalance;

    if (openingBalance + delta < 0)
      return NextResponse.json(
        { error: "Insufficient yarn balance in weaver ledger" },
        { status: 400 },
      );

    ledgerYarn.quantityKg += delta;

    /* ---------- Update Yarn Stock ---------- */
    if (transactionType === "issue") {
      if (issueMode === "bag") {
        if (yarn.stockBags < bags)
          return NextResponse.json(
            { error: "Insufficient yarn bags" },
            { status: 400 },
          );

        yarn.stockBags -= bags;
      } else {
        let remaining = quantity;

        // Use loose first
        if (yarn.looseStock >= remaining) {
          yarn.looseStock -= remaining;
          remaining = 0;
        } else {
          remaining -= yarn.looseStock;
          yarn.looseStock = 0;
        }

        // Break bags if needed
        while (remaining > 0) {
          if (yarn.stockBags <= 0)
            return NextResponse.json(
              { error: "Insufficient yarn stock" },
              { status: 400 },
            );

          yarn.stockBags -= 1;

          if (remaining <= bagWeight) {
            yarn.looseStock += bagWeight - remaining;
            remaining = 0;
          } else {
            remaining -= bagWeight;
          }
        }
      }

      yarn.stockWeight -= txnKg;
    }

    /* ---------- Receipt ---------- */
    if (transactionType === "receipt") {
      yarn.looseStock += txnKg;
      yarn.stockWeight += txnKg;
    }

    if (yarn.stockWeight < 0)
      return NextResponse.json(
        { error: "Negative yarn stock not allowed" },
        { status: 400 },
      );

    /* ---------- Save ---------- */
    await Promise.all([wLedger.save(), yarn.save()]);

    const transaction = await YarnTransactions.create({
      wLedgerId,
      yarnId,
      clothBookId,
      transactionType,
      issueMode,
      quantity: txnKg,
      openingBalance,
      closingBalance: ledgerYarn.quantityKg,
      remarks,
    });

    return NextResponse.json({ created: transaction }, { status: 201 });
  } catch (error: any) {
    console.error("🔥 Yarn transaction error", error);
    return NextResponse.json(
      { error: error.message || "Transaction failed" },
      { status: 500 },
    );
  }
}
