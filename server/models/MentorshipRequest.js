import mongoose from 'mongoose';

const mentorshipRequestSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentor',
        required: true
    },
    type: {
        type: String,
        enum: ['call', 'message'],
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    preferredDate: {
        type: Date
    },
    preferredTime: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed'],
        default: 'pending'
    },
    mentorResponse: {
        type: String
    },
    scheduledDate: {
        type: Date
    },
    scheduledTime: {
        type: String
    },
    meetingLink: {
        type: String
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

const MentorshipRequest = mongoose.model('MentorshipRequest', mentorshipRequestSchema);

export default MentorshipRequest;
