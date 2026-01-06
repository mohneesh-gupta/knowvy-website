import asyncHandler from 'express-async-handler';
import MentorProfile from '../models/profiles/MentorProfile.js';
import User from '../models/User.js';

// @desc    Get all mentors
// @route   GET /api/mentors
// @access  Public
const getMentors = asyncHandler(async (req, res) => {
    // Get all users with role 'mentor' and isApproved true
    const mentors = await User.find({
        role: 'mentor',
        isApproved: true
    }).select('-password');

    res.json(mentors);
});

// @desc    Get single mentor by User ID
// @route   GET /api/mentors/:id
// @access  Public
const getMentorById = asyncHandler(async (req, res) => {
    // Look up by User ID, not MentorProfile ID
    const mentor = await User.findById(req.params.id).select('-password');

    if (mentor && mentor.role === 'mentor') {
        // Optionally get additional profile data
        const profile = await MentorProfile.findOne({ user: mentor._id });

        res.json({
            ...mentor.toObject(),
            bio: profile?.bio || '',
            occupation: profile?.occupation || '',
            company: profile?.company || '',
            experience: profile?.experience || 0,
            expertise: profile?.expertise || [],
            specialty: profile?.specialty || ''
        });
    } else {
        res.status(404);
        throw new Error('Mentor not found');
    }
});

export { getMentors, getMentorById };
