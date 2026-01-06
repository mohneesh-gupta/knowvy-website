import asyncHandler from 'express-async-handler';
import Session from '../models/Session.js';
import { createNotification } from './notificationController.js';

// Helper to get model name from userType
const getModelName = (userType) => {
    const modelMap = {
        'admin': 'Admin',
        'organization': 'Organization',
        'mentor': 'Mentor'
    };
    return modelMap[userType] || 'Organization';
};

// @desc    Get all approved sessions
// @route   GET /api/sessions
// @access  Public
const getSessions = asyncHandler(async (req, res) => {
    const sessions = await Session.find({ approved: true })
        .populate('createdBy', 'name email avatar')
        .sort({ date: 1 });
    res.json(sessions);
});

// @desc    Get single session by ID
// @route   GET /api/sessions/:id
// @access  Public
const getSessionById = asyncHandler(async (req, res) => {
    const session = await Session.findById(req.params.id)
        .populate('createdBy', 'name email avatar phone');

    if (session) {
        res.json(session);
    } else {
        res.status(404);
        throw new Error('Session not found');
    }
});

// @desc    Create a session
// @route   POST /api/sessions
// @access  Private (Organization/Mentor/Admin)
const createSession = asyncHandler(async (req, res) => {
    const { title, speakerName, speakerImage, date, time, mode, linkOrVenue, description, banner } = req.body;

    const session = new Session({
        title,
        speakerName,
        speakerImage,
        date,
        time,
        mode,
        linkOrVenue,
        description,
        banner,
        createdBy: req.user._id,
        createdByModel: getModelName(req.user.role),
        approved: false // Requires admin approval
    });

    const createdSession = await session.save();

    // Notify all admins about new session pending approval
    const User = (await import('../models/User.js')).default;
    const admins = await User.find({ role: 'admin' });

    for (const admin of admins) {
        await createNotification({
            recipient: admin._id,
            sender: req.user._id,
            type: 'admin_action',
            title: '📚 New Session Pending Approval',
            message: `${req.user.name} has submitted a new session "${title}" for review.`,
            link: '/admin/approvals'
        });
    }

    res.status(201).json(createdSession);
});

// @desc    Get pending sessions (admin only)
// @route   GET /api/sessions/admin/pending
// @access  Private/Admin
const getPendingSessions = asyncHandler(async (req, res) => {
    const sessions = await Session.find({ approved: false })
        .populate('createdBy', 'name email avatar')
        .sort({ createdAt: -1 });
    res.json(sessions);
});

// @desc    Approve session
// @route   PUT /api/sessions/:id/approve
// @access  Private/Admin
const approveSession = asyncHandler(async (req, res) => {
    const session = await Session.findById(req.params.id);

    if (session) {
        session.approved = true;
        session.approvedBy = req.user._id;
        session.approvedAt = Date.now();

        const updatedSession = await session.save();

        await createNotification({
            recipient: session.createdBy,
            type: 'event_approved',
            title: 'Session Approved! 📚',
            message: `Your session "${session.title}" has been approved and is now live!`,
            link: `/sessions/${session._id}`
        });

        res.json(updatedSession);
    } else {
        res.status(404);
        throw new Error('Session not found');
    }
});

// @desc    Reject/Delete session
// @route   DELETE /api/sessions/:id/reject
// @access  Private/Admin
const rejectSession = asyncHandler(async (req, res) => {
    const session = await Session.findById(req.params.id);

    if (session) {
        await session.deleteOne();
        res.json({ message: 'Session rejected and deleted' });
    } else {
        res.status(404);
        throw new Error('Session not found');
    }
});

// @desc    Get user's own sessions (both approved and pending)
// @route   GET /api/sessions/user/my
// @access  Private
const getMySessions = asyncHandler(async (req, res) => {
    const sessions = await Session.find({ createdBy: req.user._id })
        .populate('createdBy', 'name email avatar')
        .sort({ createdAt: -1 });
    res.json(sessions);
});

export { getSessions, createSession, getSessionById, getPendingSessions, approveSession, rejectSession, getMySessions };
