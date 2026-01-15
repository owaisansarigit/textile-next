const mockTransactions = [
    {
        _id: "1",
        transactionType: "issue",
        quantity: 50,
        openingBalance: 200,
        closingBalance: 150,
        remarks: "Issued for production - Shirt order #101",
        createdAt: "2024-01-10T10:30:00Z",
        wLedgerId: { name: "Main Warehouse" },
        yarnId: { name: "Cotton Yarn 40s", color: "#FF5733" },
        clothBookId: { bookNumber: "CB-001" },
    },
    {
        _id: "2",
        transactionType: "receipt",
        quantity: 100,
        openingBalance: 150,
        closingBalance: 250,
        remarks: "New stock received from supplier",
        createdAt: "2024-01-12T14:20:00Z",
        wLedgerId: { name: "Main Warehouse" },
        yarnId: { name: "Polyester Yarn", color: "#33A8FF" },
        clothBookId: { bookNumber: "CB-002" },
    },
    {
        _id: "3",
        transactionType: "adjustment",
        quantity: -10,
        openingBalance: 250,
        closingBalance: 240,
        remarks: "Damaged stock adjustment",
        createdAt: "2024-01-15T09:15:00Z",
        wLedgerId: { name: "Main Warehouse" },
        yarnId: { name: "Wool Yarn", color: "#8A2BE2" },
        clothBookId: { bookNumber: "CB-003" },
    },
    {
        _id: "4",
        transactionType: "issue",
        quantity: 30,
        openingBalance: 240,
        closingBalance: 210,
        remarks: "For trouser production line",
        createdAt: "2024-01-18T11:45:00Z",
        wLedgerId: { name: "Warehouse B" },
        yarnId: { name: "Cotton Yarn 40s", color: "#FF5733" },
        clothBookId: { bookNumber: "CB-004" },
    },
];

const mockYarns = [
    { _id: "1", name: "Cotton Yarn 40s", color: "#FF5733" },
    { _id: "2", name: "Polyester Yarn", color: "#33A8FF" },
    { _id: "3", name: "Wool Yarn", color: "#8A2BE2" },
    { _id: "4", name: "Silk Yarn", color: "#FFC300" },
];

const mockLedgers = [
    { _id: "1", name: "Main Warehouse" },
    { _id: "2", name: "Warehouse B" },
    { _id: "3", name: "Production Floor" },
];

const mockClothBooks = [
    { _id: "1", bookNumber: "CB-001" },
    { _id: "2", bookNumber: "CB-002" },
    { _id: "3", bookNumber: "CB-003" },
    { _id: "4", bookNumber: "CB-004" },
];

export { mockTransactions, mockYarns, mockLedgers, mockClothBooks };