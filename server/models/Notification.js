import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: [
            'approval',      // Admin approved account
            'rejection',     // Admin rejected account
            'booking',       // New mentorship request
            'booking_update',// Mentor accepted/rejected
            'event_join',    // Someone joined an event
            'event_approved',// Admin approved hackathon/session
            'message'        // General notification
        ],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    link: {
        type: String         // Clickable link for the notification
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
