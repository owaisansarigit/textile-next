import mongoose from 'mongoose';

const beamDetailsSchema = new mongoose.Schema({
    beamNo: {
        type: String,
        required: true
    },
    cuts: {
        type: Number,
        required: true,
        min: [1, 'Cuts must be at least 1']
    },
    remarks: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['running', 'completed', 'hold'],
        default: 'running'
    }
});

const setSchema = new mongoose.Schema({
    setNo: {
        type: String,
        required: [true, 'Set number is required'],
        unique: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    sizing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sizing',
        required: true
    },
    yarn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Yarn',
        required: true
    },
    ends: {
        type: Number,
        required: [true, 'Ends count is required'],
        min: [1, 'Ends must be at least 1']
    },
    tl: {
        type: Number,
        required: [true, 'TL is required'],
        min: [1, 'TL must be at least 1']
    },
    yarnWeight: {
        type: Number,
        required: [true, 'Yarn weight is required'],
        min: [0, 'Yarn weight cannot be negative']
    },
    bagName: {
        type: String,
        trim: true
    },
    bagsUsed: {
        type: Number,
        default: 0,
        min: [0, 'Bags used cannot be negative']
    },
    usedYarnWeight: {
        type: Number,
        default: 0,
        min: [0, 'Used yarn weight cannot be negative']
    },
    openingBalance: {
        type: Number,
        default: 0,
        min: [0, 'Opening balance cannot be negative']
    },
    closingBalance: {
        type: Number,
        default: 0,
        min: [0, 'Closing balance cannot be negative']
    },
    totalCuts: {
        type: Number,
        default: 0,
        min: [0, 'Total cuts cannot be negative']
    },
    totalBeams: {
        type: Number,
        default: 0,
        min: [0, 'Total beams cannot be negative']
    },
    beamDetails: [beamDetailsSchema],
    status: {
        type: String,
        enum: ['running', 'completed', 'hold', 'cancelled'],
        default: 'running'
    },
    remarks: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Virtual for efficiency
setSchema.virtual('efficiency').get(function () {
    if (this.yarnWeight === 0) return 0;
    return (this.usedYarnWeight / this.yarnWeight) * 100;
});

setSchema.index({ setNo: 1 });
setSchema.index({ date: -1 });
setSchema.index({ status: 1 });
setSchema.index({ yarn: 1 });

export const Set = mongoose.models.Set || mongoose.model('Set', setSchema);