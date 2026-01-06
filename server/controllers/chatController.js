import asyncHandler from 'express-async-handler';
import ChatMessage from '../models/ChatMessage.js';
import MentorshipRequest from '../models/MentorshipRequest.js';
import { createNotification } from './notificationController.js';

// @desc    Send a chat message
// @route   POST /api/chat/:requestId
// @access  Private
export const sendMessage = asyncHandler(async (req, res) => {
    const { message } = req.body;
    const { requestId } = req.params;

    // Verify mentorship request exists and user is part of it
    const mentorshipRequest = await MentorshipRequest.findById(requestId);

    if (!mentorshipRequest) {
        res.status(404);
        throw new Error('Mentorship request not found');
    }

    // Check if user is either student or mentor in this request
    const isStudent = mentorshipRequest.student.toString() === req.user._id.toString();
    const isMentor = mentorshipRequest.mentor.toString() === req.user._id.toString();

    if (!isStudent && !isMentor) {
        res.status(403);
        throw new Error('Not authorized to send messages in this conversation');
    }

    // Determine receiver
    const receiver = isStudent ? mentorshipRequest.mentor : mentorshipRequest.student;

    // Create message
    const chatMessage = await ChatMessage.create({
        mentorshipRequest: requestId,
        sender: req.user._id,
        receiver,
        message
    });

    // Populate sender info
    await chatMessage.populate('sender', 'name avatar');

    // Notify receiver
    await createNotification({
        recipient: receiver,
        sender: req.user._id,
        type: 'message',
        title: '💬 New Message',
        message: `${req.user.name} sent you a message`,
        link: `/mentorship/chat/${requestId}`
    });

    res.status(201).json(chatMessage);
});

// @desc    Get chat messages for a mentorship request
// @route   GET /api/chat/:requestId
// @access  Private
export const getMessages = asyncHandler(async (req, res) => {
    const { requestId } = req.params;

    // Verify mentorship request exists and user is part of it
    const mentorshipRequest = await MentorshipRequest.findById(requestId);

    if (!mentorshipRequest) {
        res.status(404);
        throw new Error('Mentorship request not found');
    }

    // Check if user is either student or mentor in this request
    const isStudent = mentorshipRequest.student.toString() === req.user._id.toString();
    const isMentor = mentorshipRequest.mentor.toString() === req.user._id.toString();

    if (!isStudent && !isMentor) {
        res.status(403);
        throw new Error('Not authorized to view this conversation');
    }

    // Get all messages
    const messages = await ChatMessage.find({ mentorshipRequest: requestId })
        .populate('sender', 'name avatar')
        .populate('receiver', 'name avatar')
        .sort({ createdAt: 1 });

    // Mark messages as read for current user
    await ChatMessage.updateMany(
        {
            mentorshipRequest: requestId,
            receiver: req.user._id,
            read: false
        },
        { read: true }
    );

    res.json(messages);
});

// @desc    Get unread message count
// @route   GET /api/chat/unread/count
// @access  Private
export const getUnreadCount = asyncHandler(async (req, res) => {
    const count = await ChatMessage.countDocuments({
        receiver: req.user._id,
        read: false
    });

    res.json({ count });
});

// @desc    Get all conversations for current user
// @route   GET /api/chat/conversations
// @access  Private
export const getConversations = asyncHandler(async (req, res) => {
    // Get all mentorship requests where user is student or mentor and status is accepted
    const requests = await MentorshipRequest.find({
        $or: [
            { student: req.user._id },
            { mentor: req.user._id }
        ],
        status: 'accepted'
    })
        .populate('student', 'name avatar email')
        .populate('mentor', 'name avatar email')
        .sort({ updatedAt: -1 });

    // Get last message for each conversation
    const conversations = await Promise.all(
        requests.map(async (request) => {
            const lastMessage = await ChatMessage.findOne({
                mentorshipRequest: request._id
            })
                .sort({ createdAt: -1 })
                .populate('sender', 'name');

            const unreadCount = await ChatMessage.countDocuments({
                mentorshipRequest: request._id,
                receiver: req.user._id,
                read: false
            });

            return {
                request,
                lastMessage,
                unreadCount
            };
        })
    );

    res.json(conversations);
});
