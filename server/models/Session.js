import mongoose from 'mongoose';

const sessionSchema = mongoose.Schema({
    title: { type: String, required: true },
    speakerName: { type: String, required: true },
    speakerImage: { type: String },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    mode: { type: String, enum: ['online', 'offline'], required: true },
    linkOrVenue: { type: String, required: true },
    description: { type: String, required: true },
    banner: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'createdByModel' },
    createdByModel: { type: String, required: true, enum: ['Admin', 'Organization', 'Mentor'] },
    approved: { type: Boolean, default: false },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    approvedAt: { type: Date }
}, {
    timestamps: true
});

const Session = mongoose.model('Session', sessionSchema);

export default Session;
