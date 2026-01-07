import { ledgers, Ledger } from "./data";

export const getAllLedgers = () => ledgers;

export const getLedgerById = (id: string) =>
  ledgers.find((l) => l.id === id);

export const getLedgersByBalanceType = (type: "CR" | "DR") =>
  ledgers.filter((l) => l.balanceType === type);

export const createLedger = (data: Omit<Ledger, "id">) => {
  const newLedger: Ledger = {
    id: (ledgers.length + 1).toString(),
    ...data,
  };
  ledgers.push(newLedger);
  return newLedger;
};

export const updateLedger = (id: string, data: Partial<Ledger>) => {
  const index = ledgers.findIndex((l) => l.id === id);
  if (index === -1) return null;

  ledgers[index] = { ...ledgers[index], ...data };
  return ledgers[index];
};

export const deleteLedger = (id: string) => {
  const index = ledgers.findIndex((l) => l.id === id);
  if (index === -1) return false;

  ledgers.splice(index, 1);
  return true;
};
