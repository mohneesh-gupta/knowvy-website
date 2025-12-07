import asyncHandler from 'express-async-handler';
import HostRequest from '../models/HostRequest.js';

// @desc    Create a host request
// @route   POST /api/host
// @access  Private
const createHostRequest = asyncHandler(async (req, res) => {
    const { eventName, eventType, poster, description, expectedParticipants, sponsorshipNeeded, contactDetails } = req.body;

    const request = new HostRequest({
        eventName,
        eventType,
        poster,
        description,
        expectedParticipants,
        sponsorshipNeeded,
        contactDetails,
        user: req.user._id,
    });

    const createdRequest = await request.save();
    res.status(201).json(createdRequest);
});

// @desc    Get all host requests
// @route   GET /api/host
// @access  Private (Admin)
const getHostRequests = asyncHandler(async (req, res) => {
    const requests = await HostRequest.find({}).populate('user', 'name email');
    res.json(requests);
});

export { createHostRequest, getHostRequests };
