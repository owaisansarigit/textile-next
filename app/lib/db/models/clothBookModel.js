import mongoose from 'mongoose';

const clothBookSchema = new mongoose.Schema({
    wLedgerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WLedger',
        required: true
    }
}, {
    timestamps: true
});

export const ClothBook = mongoose.model('ClothBook', clothBookSchema);