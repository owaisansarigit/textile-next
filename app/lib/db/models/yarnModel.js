import mongoose from 'mongoose';

const yarnSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Yarn name is required'],
        trim: true
    },
    count: {
        type: String,
        required: [true, 'Yarn count is required']
    },
    category: {
        type: String,
        required: [true, 'Yarn category is required'],
        enum: ['Cotton', 'Polyester', 'Viscose', 'Blend', 'Linen', 'Silk', 'Other']
    },
    bagWeight: {
        type: Number,
        required: [true, 'Bag weight is required'],
        min: [1, 'Bag weight must be at least 1 kg']
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
    ratePerKg: {
        type: Number,
        min: [0, 'Rate cannot be negative']
    },
    supplier: {
        name: String,
        contact: String
    },
    minimumStock: {
        type: Number,
        default: 0
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Notes cannot exceed 1000 characters']
    }
}, {
    timestamps: true
});

// Virtual field for total stock in kg
yarnSchema.virtual('totalStockKg').get(function () {
    return (this.stockBags * this.bagWeight) + this.looseStock;
});

yarnSchema.index({ name: 1, count: 1, category: 1 });

export const Yarn = mongoose.models.Yarn || mongoose.model('Yarn', yarnSchema);