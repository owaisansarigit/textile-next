import mongoose from 'mongoose';

const beamBookSchema = new mongoose.Schema({
    setId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Set',
        required: true
    },
    wLedgerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WLedger',
        required: true
    },
    pipeNo: {
        type: String,
        required: true
    },
    slipNo: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export const BeamBook = mongoose.model('BeamBook', beamBookSchema);