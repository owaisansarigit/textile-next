import mongoose from 'mongoose';

const sizingSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true }
}, {
    timestamps: true
});

export const Sizing = mongoose.model('Sizing', sizingSchema);