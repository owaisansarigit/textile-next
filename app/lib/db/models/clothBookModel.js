import mongoose from 'mongoose';

const clothBookSchema = new mongoose.Schema({
    wLedgerId: { type: mongoose.Schema.Types.ObjectId, ref: 'WLedger', required: true },
    cloths: [{
        cloth: { type: mongoose.Schema.Types.ObjectId, ref: 'Cloth', required: true },
        quantity: { type: Number }
    }],
    yarnWeight: [{
        yarnCategory: { type: String, enum: ['Cotton', 'Viscose', 'CP', 'PC', 'Roto'] },
        yarnCount: { type: Number },
        quantityKg: { type: Number, required: true }
    }]
}, {
    timestamps: true
});
export const ClothBook = mongoose.models.ClothBook || mongoose.model('ClothBook', clothBookSchema);