import mongoose from 'mongoose';
const wLedgerSchema = new mongoose.Schema({
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
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    opYarnBalance: {
        type: Number,
        default: 0,
        min: [0, 'Opening balance cannot be negative']
    },
    opYarnBalanceDate: {
        type: Date,
        default: Date.now
    },
    currentYarnBalance: {
        type: Number,
        default: 0,
        min: [0, 'Current balance cannot be negative']
    },
    contact: {
        phone: String,
        email: String,
        address: String
    },
}, {
    timestamps: true
});

wLedgerSchema.index({ name: 1, group: 1 });
wLedgerSchema.index({ status: 1 });

export const WLedger = mongoose.models.WLedger || mongoose.model('WLedger', wLedgerSchema);