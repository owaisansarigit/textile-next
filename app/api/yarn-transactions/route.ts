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

export const POST = async (req: Request) => {
  try {
    await connectDB();

    const {
      wLedgerId,
      yarnId,
      transactionType, // "issue" | "receipt"
      issueMode, // "bag" | "loose"
      quantity, // kg (if loose)
      bags, // count (if bag)
      remarks,
      clothBookId,
    } = await req.json();

    /* ===================== Fetch ===================== */
    const yarn = await Yarn.findById(yarnId);
    if (!yarn) throw new Error("Yarn not found");

    const wLedger = await WLedger.findById(wLedgerId);
    if (!wLedger) throw new Error("Weaver ledger not found");

    /* ===================== Find / Create Ledger Yarn ===================== */
    let ledgerYarn = wLedger.currentYarnBalance.find(
      (y: any) => y.category === yarn.category && y.count === yarn.count,
    );

    if (!ledgerYarn) {
      wLedger.currentYarnBalance.push({
        category: yarn.category,
        count: yarn.count,
        quantityKg: 0,
      });

      // IMPORTANT: re-fetch tracked subdocument
      ledgerYarn = wLedger.currentYarnBalance.at(-1);
    }

    if (!ledgerYarn) {
      ledgerYarn = {
        category: yarn.category,
        count: yarn.count,
        quantityKg: 0,
      };
      wLedger.currentYarnBalance.push(ledgerYarn);
    }

    const openingBalance = ledgerYarn.quantityKg;

    /* ===================== Calculate Txn Kg ===================== */
    let txnKg = 0;

    if (issueMode === "bag") {
      if (!bags || bags <= 0) throw new Error("Invalid bag quantity");
      txnKg = bags * yarn.bagWeight;
    } else {
      if (!quantity || quantity <= 0) throw new Error("Invalid loose quantity");
      txnKg = quantity;
    }

    /* ===================== Validate Balances ===================== */
    if (transactionType === "issue") {
      if (yarn.stockWeight < txnKg) {
        throw new Error("Insufficient yarn stock");
      }
    }

    /* ===================== UPDATE WEAVER LEDGER ===================== */
    if (transactionType === "issue") {
      ledgerYarn.quantityKg += txnKg;
    } else {
      if (ledgerYarn.quantityKg < txnKg) {
        throw new Error("Insufficient weaver yarn balance");
      }
      ledgerYarn.quantityKg -= txnKg;
    }

    const closingBalance = ledgerYarn.quantityKg;

    /* ===================== UPDATE YARN MASTER ===================== */
    if (transactionType === "issue") {
      if (issueMode === "bag") {
        if (yarn.stockBags < bags) {
          throw new Error("Insufficient yarn bags");
        }
        yarn.stockBags -= bags;
      } else {
        let remaining = txnKg;

        if (yarn.looseStock >= remaining) {
          yarn.looseStock -= remaining;
          remaining = 0;
        } else {
          remaining -= yarn.looseStock;
          yarn.looseStock = 0;
        }

        while (remaining > 0) {
          if (yarn.stockBags <= 0) {
            throw new Error("Insufficient yarn bags");
          }

          yarn.stockBags -= 1;

          if (remaining <= yarn.bagWeight) {
            yarn.looseStock += yarn.bagWeight - remaining;
            remaining = 0;
          } else {
            remaining -= yarn.bagWeight;
          }
        }
      }

      yarn.stockWeight -= txnKg;
    }

    if (transactionType === "receipt") {
      yarn.looseStock += txnKg;
      yarn.stockWeight += txnKg;
    }

    if (yarn.stockWeight < 0) {
      throw new Error("Negative yarn stock not allowed");
    }

    /* ===================== SAVE ===================== */
    await Promise.all([wLedger.save(), yarn.save()]);

    /* ===================== TRANSACTION ===================== */
    const transaction = await YarnTransactions.create({
      wLedgerId,
      yarnId,
      clothBookId,
      transactionType,
      issueMode,
      quantity: txnKg,
      openingBalance,
      closingBalance,
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
};
