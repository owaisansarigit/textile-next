import mongoose from 'mongoose';
const wLedgerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        alias: { type: String, trim: true },
        group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
        openingYarnBalance: [{
            category: { type: String, enum: ['Cotton', 'Viscose', 'CP', 'PC', 'Roto'] },
            count: { type: Number, enum: [23, 40, 60, 80] },
            quantityKg: { type: Number, required: true },
            openingDate: { type: Date, default: Date.now }
        }],
        currentYarnBalance: [{
            category: { type: String, enum: ['Cotton', 'Viscose', 'CP', 'PC', 'Roto'] },
            count: { type: Number },
            quantityKg: { type: Number, required: true }
        },],
        contact: { phone: String, email: String, address: String }
    },
    { timestamps: true }
);

wLedgerSchema.pre('save', function () {
    if (this.isNew && this.openingYarnBalance?.length) {
        this.currentYarnBalance = this.openingYarnBalance.map(ob => ({
            category: ob.category,
            count: ob.count,
            quantityKg: ob.quantityKg
        }));
    }
});
wLedgerSchema.index({ name: 1, group: 1 }, { unique: true });
export const WLedger =
    mongoose.models.WLedger ??
    mongoose.model('WLedger', wLedgerSchema);
