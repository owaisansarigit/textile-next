import mongoose from 'mongoose';

const clothSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    alias: { type: String, trim: true },
    yarnCategory: { type: String, enum: ['Cotton', 'Viscose', 'CP', 'PC', 'Roto'], required: true },
    yarnCount: { type: Number, required: true },
    weightPerPcs: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    stockDate: { type: Date, default: Date.now }
}, {
    timestamps: true
});

export const Cloth = mongoose.model('Cloth', clothSchema);