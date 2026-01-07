import mongoose from 'mongoose';

const pipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    alias: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

export const Pipe = mongoose.model('Pipe', pipeSchema);