import asyncHandler from 'express-async-handler';
import MentorProfile from '../models/profiles/MentorProfile.js';

// @desc    Get all mentors
// @route   GET /api/mentors
// @access  Public
const getMentors = asyncHandler(async (req, res) => {
    const mentors = await MentorProfile.find({}).select('-password');
    res.json(mentors);
});

// @desc    Get single mentor by ID
// @route   GET /api/mentors/:id
// @access  Public
const getMentorById = asyncHandler(async (req, res) => {
    const mentor = await MentorProfile.findById(req.params.id).select('-password');

    if (mentor) {
        res.json(mentor);
    } else {
        res.status(404);
        throw new Error('Mentor not found');
    }
});

export { getMentors, getMentorById };
