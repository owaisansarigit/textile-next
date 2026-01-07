import { Schema, model, models } from "mongoose";

export interface ILedger {
  name: string;
  balance: number;
  balanceType: "CR" | "DR";
  createdAt?: Date;
  updatedAt?: Date;
}

const LedgerSchema = new Schema<ILedger>(
  {
    name: { type: String, required: true },
    balance: { type: Number, required: true },
    balanceType: {
      type: String,
      enum: ["CR", "DR"],
      required: true,
    },
  },
  { timestamps: true }
);

export const Ledger = models.Ledger || model<ILedger>("Ledger", LedgerSchema);
