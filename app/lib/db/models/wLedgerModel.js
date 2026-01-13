import mongoose from 'mongoose';
const openingYarnBalanceSchema = new mongoose.Schema(
    {
        category: { type: String, enum: ['Cotton', 'Viscose', 'CP', 'PC', 'Roto'] },
        count: { type: Number, enum: [23, 40, 60, 80] },
        quantityKg: { type: Number, required: true, },
        openingDate: { type: Date, default: Date.now }
    },
    { _id: false }
);
const currentYarnBalanceSchema = new mongoose.Schema(
    {
        count: { type: Number },
        category: { type: String, enum: ['Cotton', 'Viscose', 'CP', 'PC', 'Roto'] },
        quantityKg: { type: Number, required: true, }
    },
    { _id: false }
);

const wLedgerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        alias: { type: String, trim: true },
        group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
        openingYarnBalance: { type: [openingYarnBalanceSchema] },
        currentYarnBalance: { type: [currentYarnBalanceSchema], },
        contact: { phone: String, email: String, address: String }
    },
    { timestamps: true }
);
wLedgerSchema.index({ name: 1, group: 1 }, { unique: true });
export const WLedger = mongoose.models.WLedger || mongoose.model('WLedger', wLedgerSchema);
