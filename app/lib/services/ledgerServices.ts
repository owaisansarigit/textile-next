import { connectMongo } from "../db/mongo";
import { Ledger } from "../models/Ledger";

export const getAllLedgers = async (balanceType?: "CR" | "DR") => {
  await connectMongo();
  return Ledger.find(balanceType ? { balanceType } : {});
};

export const getLedgerById = async (id: string) => {
  await connectMongo();
  return Ledger.findById(id);
};

export const createLedger = async (data: {
  name: string;
  balance: number;
  balanceType: "CR" | "DR";
}) => {
  await connectMongo();
  return Ledger.create(data);
};

export const updateLedger = async (
  id: string,
  data: Partial<{
    name: string;
    balance: number;
    balanceType: "CR" | "DR";
  }>
) => {
  await connectMongo();
  return Ledger.findByIdAndUpdate(id, data, { new: true });
};

export const deleteLedger = async (id: string) => {
  await connectMongo();
  return Ledger.findByIdAndDelete(id);
};
