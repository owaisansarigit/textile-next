import mongoose from 'mongoose';

const yarnIssuesSchema = new mongoose.Schema({
    wLedgerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WLedger',
        required: true
    },
    yarnId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Yarn',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    quantity: {
        type: Number,
        required: true
    },
    remarks: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

export const YarnIssues = mongoose.model('YarnIssues', yarnIssuesSchema);