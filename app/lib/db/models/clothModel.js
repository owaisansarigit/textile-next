import mongoose from 'mongoose';

const clothSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    alias: {
        type: String,
        trim: true
    },
    yarnCategory: {
        type: String,
        required: true
    },
    yarnCount: {
        type: String,
        required: true
    },
    weightPerPcs: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        default: 0
    },
    stockDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export const Cloth = mongoose.model('Cloth', clothSchema);