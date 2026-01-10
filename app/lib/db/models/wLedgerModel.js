import mongoose from 'mongoose';
const openingYarnBalanceSchema = new mongoose.Schema(
    {
        yarn: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Yarn',
            required: true
        },
        quantityKg: {
            type: Number,
            required: true,
            min: [0, 'Opening balance cannot be negative']
        },
        openingDate: {
            type: Date,
            default: Date.now
        }
    },
    { _id: false }
);
const currentYarnBalanceSchema = new mongoose.Schema(
    {
        yarn: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Yarn',
            required: true
        },
        quantityKg: {
            type: Number,
            required: true,
            min: [0, 'Current balance cannot be negative']
        }
    },
    { _id: false }
);
const wLedgerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        alias: {
            type: String,
            trim: true
        },
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
            required: true
        },
        openingYarnBalance: {
            type: [openingYarnBalanceSchema],
            default: []
        },
        currentYarnBalance: {
            type: [currentYarnBalanceSchema],
            default: []
        },
        contact: {
            phone: String,
            email: String,
            address: String
        }
    },
    { timestamps: true }
);
wLedgerSchema.index({ name: 1, group: 1 }, { unique: true });
export const WLedger = mongoose.models.WLedger || mongoose.model('WLedger', wLedgerSchema);
