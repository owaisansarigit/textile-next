import mongoose from 'mongoose';
const yarnSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: ['Cotton', 'Viscose', 'CP', 'PC', 'Roto'] },
    count: { type: Number, enum: [23, 40, 60, 80] },
    stockBags: { type: Number, default: 0, },
    bagWeight: { type: Number, min: [0, 'Bags Weight cannot be negative'] },
    stockWeight: { type: Number, min: [0, 'Stock Weight cannot be negative'] },
    looseStock: { type: Number, min: [0, 'Loose stock cannot be negative'] },
}, { timestamps: true });
yarnSchema.index({ name: 1, count: 1, category: 1 });
export const Yarn = mongoose.models.Yarn || mongoose.model('Yarn', yarnSchema);