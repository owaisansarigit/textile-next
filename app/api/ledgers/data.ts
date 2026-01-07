export type Ledger = {
  id: string;
  name: string;
  balance: number;
  balanceType: "CR" | "DR";
};

export let ledgers: Ledger[] = [
  { id: "1", name: "Cash", balance: 50000, balanceType: "DR" },
  { id: "2", name: "Bank", balance: 120000, balanceType: "DR" },
  { id: "3", name: "Sales", balance: 90000, balanceType: "CR" },
  { id: "4", name: "Purchase", balance: 40000, balanceType: "DR" },
  { id: "5", name: "Capital", balance: 200000, balanceType: "CR" },
  { id: "6", name: "Rent Expense", balance: 15000, balanceType: "DR" },
  { id: "7", name: "Interest Income", balance: 8000, balanceType: "CR" },
  { id: "8", name: "Salary Expense", balance: 30000, balanceType: "DR" },
  { id: "9", name: "Commission", balance: 12000, balanceType: "CR" },
  { id: "10", name: "Misc Expense", balance: 7000, balanceType: "DR" },
];
