import mongoose from 'mongoose';

const yarnTransactionsSchema = new mongoose.Schema({
    wLedgerId: { type: mongoose.Schema.Types.ObjectId, ref: 'WLedger' },
    yarnId: { type: mongoose.Schema.Types.ObjectId, ref: 'Yarn' },
    clothBookId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClothBook' },
    transactionType: { type: String, enum: ['issue', 'receipt', 'adjustment'], required: true },
    quantity: { type: Number, required: true },
    openingBalance: { type: Number, required: true },
    closingBalance: { type: Number, required: true },
    remarks: { type: String, trim: true }
}, {
    timestamps: true
});

export const YarnTransactions = mongoose.model('YarnTransactions', yarnTransactionsSchema);