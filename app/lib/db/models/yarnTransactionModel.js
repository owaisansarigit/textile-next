import mongoose from 'mongoose';

const yarnTransactionsSchema = new mongoose.Schema({
    wLedgerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WLedger',
        required: true
    },
    clothBookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClothBook',
        required: true
    },
    yarnId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Yarn'
    },
    quantity: {
        type: Number,
        required: true
    },
    transactionType: {
        type: String,
        enum: ['issue', 'receipt', 'adjustment'],
        required: true
    },
    remarks: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

export const YarnTransactions = mongoose.model('YarnTransactions', yarnTransactionsSchema);