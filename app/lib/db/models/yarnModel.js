import mongoose from 'mongoose';
const yarnSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    count: { type: String },
    category: {
        type: String,
        required: [true, 'Yarn category is required'],
        enum: ['Cotton', 'Viscose', 'CP', 'PC', 'Roto']
    },
    stockBags: {
        type: Number,
        default: 0,
        min: [0, 'Stock bags cannot be negative']
    },
    looseStock: {
        type: Number,
        default: 0,
        min: [0, 'Loose stock cannot be negative']
    },
}, { timestamps: true });
yarnSchema.index({ name: 1, count: 1, category: 1 });
export const Yarn = mongoose.models.Yarn || mongoose.model('Yarn', yarnSchema);