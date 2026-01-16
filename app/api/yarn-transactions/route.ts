import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db/connect";
import { YarnTransactions } from "../../lib/db/models/yarnTransactionModel";
import { WLedger } from "../../lib/db/models/wLedgerModel";
import { Yarn } from "@/app/lib/db/models/yarnModel";

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

// export async function POST(req: Request) {
//   try {
//     await connectDB();
//     const body = await req.json();
//     console.log(body);
//     const { wLedgerId, yarnId, transactionType, quantity, remarks } = body;
//     const wLedger = await WLedger.findById(wLedgerId);
//     const yarn = await Yarn.findById(yarnId);

//     const dataToSave = {
//       wLedgerId,
//       yarnId,
//       transactionType,
//       quantity,
//       remarks,
//       // clothBookId,
//       // openingBalance,
//       // closingBalance,
//     };
//     console.log(dataToSave);
//     // const created = await YarnTransactions.create(body);
//     return NextResponse.json({ created: dataToSave }, { status: 201 });
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || "Failed to create yarn" },
//       { status: 400 }
//     );
//   }
// }

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      wLedgerId,
      yarnId,
      transactionType, // "issue"
      quantity,
      remarks,
      clothBookId,
    } = body;

    const yarn = await Yarn.findById(yarnId);
    if (!yarn) {
      return NextResponse.json({ error: "Yarn not found" }, { status: 404 });
    }

    const wLedger = await WLedger.findById(wLedgerId);
    if (!wLedger) {
      return NextResponse.json({ error: "WLedger not found" }, { status: 404 });
    }

    // 🔍 Find yarn entry in WLedger
    let ledgerYarn = wLedger.yarns.find(
      (y: any) => y.category === yarn.category && y.count === yarn.count
    );

    // 🆕 If not exists → create with 0 balance
    if (!ledgerYarn) {
      ledgerYarn = {
        category: yarn.category,
        count: yarn.count,
        balance: 0,
      };
      wLedger.yarns.push(ledgerYarn);
    }

    const openingBalance = ledgerYarn.balance;
    let closingBalance = openingBalance;

    // =============================
    // ISSUE LOGIC (TEXTILE CORRECT)
    // =============================
    if (transactionType === "issue") {
      // 🧵 Yarn GIVEN to weaver
      if (!clothBookId) {
        closingBalance = openingBalance + quantity;
        ledgerYarn.balance = closingBalance;
      }

      // 🪡 Yarn CONSUMED using cloth book
      if (clothBookId) {
        if (openingBalance < quantity) {
          return NextResponse.json(
            { error: "Insufficient yarn balance in WLedger" },
            { status: 400 }
          );
        }

        closingBalance = openingBalance - quantity;
        ledgerYarn.balance = closingBalance;
      }
    }

    await wLedger.save();

    // =============================
    // SAVE TRANSACTION
    // =============================
    const transaction = await YarnTransactions.create({
      wLedgerId,
      yarnId,
      clothBookId: clothBookId || undefined,
      transactionType,
      quantity,
      openingBalance,
      closingBalance,
      remarks,
    });

    console.log(transaction)
    

    return NextResponse.json({ created: transaction }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to save yarn transaction" },
      { status: 500 }
    );
  }
}
