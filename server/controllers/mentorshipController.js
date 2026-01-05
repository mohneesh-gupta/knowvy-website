import asyncHandler from 'express-async-handler';
import MentorshipRequest from '../models/MentorshipRequest.js';
import User from '../models/User.js';
import { createNotification } from './notificationController.js';

// @desc    Create a mentorship request
// @route   POST /api/mentorship
// @access  Private (Student)
export const requestMentorship = asyncHandler(async (req, res) => {
    const { mentorId, type, subject, message, preferredDate, preferredTime } = req.body;

    const mentor = await User.findById(mentorId);
    if (!mentor) {
        res.status(404);
        throw new Error('Mentor not found');
    }

    const mentorshipRequest = await MentorshipRequest.create({
        student: req.user._id,
        mentor: mentorId,
        type, // 'call' or 'message'
        subject,
        message,
        preferredDate,
        preferredTime,
        status: 'pending'
    });

    // Notify Mentor
    await createNotification({
        recipient: mentorId,
        sender: req.user._id,
        type: 'booking',
        title: 'New Mentorship Request',
        message: `${req.user.name} has requested a ${type} with you regarding "${subject}".`,
        link: '/mentorship/requests'
    });

    res.status(201).json(mentorshipRequest);
});

// @desc    Get requests for current user (either as student or mentor)
// @route   GET /api/mentorship/my-requests
// @access  Private
export const getMyRequests = asyncHandler(async (req, res) => {
    let requests;
    if (req.user.role === 'mentor') {
        requests = await MentorshipRequest.find({ mentor: req.user._id })
            .populate('student', 'name email avatar')
            .sort({ createdAt: -1 });
    } else {
        requests = await MentorshipRequest.find({ student: req.user._id })
            .populate('mentor', 'name email avatar occupation')
            .sort({ createdAt: -1 });
    }
    res.json(requests);
});

// @desc    Update request status (Accept/Reject)
// @route   PUT /api/mentorship/:id
// @access  Private (Mentor)
export const updateRequestStatus = asyncHandler(async (req, res) => {
    const { status, scheduledDate, scheduledTime, meetingLink, notes } = req.body;
    const request = await MentorshipRequest.findById(req.params.id);

    if (!request) {
        res.status(404);
        throw new Error('Request not found');
    }

    // Verify ownership
    if (request.mentor.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this request');
    }

    request.status = status;
    if (scheduledDate) request.scheduledDate = scheduledDate;
    if (scheduledTime) request.scheduledTime = scheduledTime;
    if (meetingLink) request.meetingLink = meetingLink;
    if (notes) request.notes = notes; // Rejection reason etc.

    await request.save();

    // Notify Student
    let notifTitle = '';
    let notifMessage = '';

    if (status === 'accepted') {
        notifTitle = 'Mentorship Request Accepted! ✅';
        notifMessage = `Good news! Your request has been accepted. Check details for the scheduled time.`;
    } else if (status === 'rejected') {
        notifTitle = 'Mentorship Request Update';
        notifMessage = `Your request was not accepted at this time.`;
    }

    if (notifTitle) {
        await createNotification({
            recipient: request.student,
            sender: req.user._id,
            type: 'booking_update',
            title: notifTitle,
            message: notifMessage,
            link: '/mentorship/my-requests'
        });
    }

    res.json(request);
});
