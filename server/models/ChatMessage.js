import mongoose from 'mongoose';

const chatMessageSchema = mongoose.Schema({
    mentorshipRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MentorshipRequest',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    attachments: [{
        type: String,
        url: String
    }]
}, {
    timestamps: true
});

// Index for faster queries
chatMessageSchema.index({ mentorshipRequest: 1, createdAt: -1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;
