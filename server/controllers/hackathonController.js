import asyncHandler from 'express-async-handler';
import Hackathon from '../models/Hackathon.js';

// Helper to get model name from userType
const getModelName = (userType) => {
    const modelMap = {
        'admin': 'Admin',
        'organization': 'Organization',
        'mentor': 'Mentor'
    };
    return modelMap[userType] || 'Organization';
};

// @desc    Fetch all approved hackathons
// @route   GET /api/hackathons
// @access  Public
const getHackathons = asyncHandler(async (req, res) => {
    const hackathons = await Hackathon.find({ approved: true })
        .populate('createdBy', 'name email avatar phone')
        .sort({ createdAt: -1 });
    res.json(hackathons);
});

// @desc    Fetch single hackathon
// @route   GET /api/hackathons/:id
// @access  Public
const getHackathonById = asyncHandler(async (req, res) => {
    const hackathon = await Hackathon.findById(req.params.id)
        .populate('createdBy', 'name email avatar phone');

    if (hackathon) {
        res.json(hackathon);
    } else {
        res.status(404);
        throw new Error('Hackathon not found');
    }
});

// @desc    Create a hackathon
// @route   POST /api/hackathons
// @access  Private/Organization/Mentor/Admin
const createHackathon = asyncHandler(async (req, res) => {
    const { title, theme, description, startDate, endDate, entryFee, website, banner, location, tags } = req.body;

    const hackathon = new Hackathon({
        title,
        theme,
        description,
        startDate,
        endDate,
        entryFee,
        website,
        banner,
        location,
        tags,
        createdBy: req.user._id,
        createdByModel: getModelName(req.userType),
        approved: false // Requires admin approval
    });

    const createdHackathon = await hackathon.save();
    res.status(201).json(createdHackathon);
});

// @desc    Delete a hackathon
// @route   DELETE /api/hackathons/:id
// @access  Private
const deleteHackathon = asyncHandler(async (req, res) => {
    const hackathon = await Hackathon.findById(req.params.id);

    if (hackathon) {
        // Check if user is the creator or admin
        if (hackathon.createdBy.toString() === req.user._id.toString() || req.userType === 'admin') {
            await hackathon.deleteOne();
            res.json({ message: 'Hackathon removed' });
        } else {
            res.status(403);
            throw new Error('Not authorized to delete this hackathon');
        }
    } else {
        res.status(404);
        throw new Error('Hackathon not found');
    }
});

// @desc    Get pending hackathons (admin only)
// @route   GET /api/hackathons/admin/pending
// @access  Private/Admin
const getPendingHackathons = asyncHandler(async (req, res) => {
    const hackathons = await Hackathon.find({ approved: false })
        .populate('createdBy', 'name email avatar')
        .sort({ createdAt: -1 });
    res.json(hackathons);
});

// @desc    Approve hackathon
// @route   PUT /api/hackathons/:id/approve
// @access  Private/Admin
const approveHackathon = asyncHandler(async (req, res) => {
    const hackathon = await Hackathon.findById(req.params.id);

    if (hackathon) {
        hackathon.approved = true;
        hackathon.approvedBy = req.user._id;
        hackathon.approvedAt = Date.now();

        const updatedHackathon = await hackathon.save();
        res.json(updatedHackathon);
    } else {
        res.status(404);
        throw new Error('Hackathon not found');
    }
});

// @desc    Reject/Delete hackathon
// @route   DELETE /api/hackathons/:id/reject
// @access  Private/Admin
const rejectHackathon = asyncHandler(async (req, res) => {
    const hackathon = await Hackathon.findById(req.params.id);

    if (hackathon) {
        await hackathon.deleteOne();
        res.json({ message: 'Hackathon rejected and deleted' });
    } else {
        res.status(404);
        throw new Error('Hackathon not found');
    }
});

// @desc    Get user's own hackathons (both approved and pending)
// @route   GET /api/hackathons/user/my
// @access  Private
const getMyHackathons = asyncHandler(async (req, res) => {
    const hackathons = await Hackathon.find({ createdBy: req.user._id })
        .populate('createdBy', 'name email avatar phone')
        .sort({ createdAt: -1 });
    res.json(hackathons);
});

export { getHackathons, getHackathonById, createHackathon, deleteHackathon, getPendingHackathons, approveHackathon, rejectHackathon, getMyHackathons };
