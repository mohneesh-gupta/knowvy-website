import mongoose from 'mongoose';

const hostRequestSchema = mongoose.Schema({
    eventName: { type: String, required: true },
    eventType: { type: String, enum: ['hackathon', 'workshop', 'seminar', 'competition'], required: true },
    poster: { type: String }, // Cloudinary URL
    description: { type: String, required: true },
    expectedParticipants: { type: Number, required: true },
    sponsorshipNeeded: { type: Boolean, default: false },
    contactDetails: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, {
    timestamps: true
});

const HostRequest = mongoose.model('HostRequest', hostRequestSchema);

export default HostRequest;
