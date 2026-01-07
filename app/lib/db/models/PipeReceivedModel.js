import mongoose from 'mongoose';

const pipeReceivedsSchema = new mongoose.Schema({
    wLedgerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WLedger',
        required: true
    },
    pipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pipe',
        required: true
    },
    slipNo: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    quantity: {
        type: Number,
        default: 1
    },
    remarks: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

export const PipeReceiveds = mongoose.model('PipeReceiveds', pipeReceivedsSchema);