import mongoose from 'mongoose';

const hackathonSchema = mongoose.Schema({
    title: { type: String, required: true },
    theme: { type: String },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    entryFee: { type: Number, default: 0 },
    website: { type: String },
    banner: { type: String },
    location: { type: String, required: true },
    tags: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'createdByModel' },
    createdByModel: { type: String, required: true, enum: ['Admin', 'Organization', 'Mentor'] },
    approved: { type: Boolean, default: false },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    approvedAt: { type: Date }
}, {
    timestamps: true
});

const Hackathon = mongoose.model('Hackathon', hackathonSchema);

export default Hackathon;
