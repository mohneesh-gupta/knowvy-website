import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import StudentProfile from '../models/profiles/StudentProfile.js';
import MentorProfile from '../models/profiles/MentorProfile.js';
import OrganizationProfile from '../models/profiles/OrganizationProfile.js';
import { createNotification } from './notificationController.js';

// @desc    Get all users pending approval
// @route   GET /api/admin/pending-users
// @access  Private/Admin
export const getPendingUsers = asyncHandler(async (req, res) => {
    // We only care about Mentors and Organizations as Students are auto-approved
    const users = await User.find({
        isApproved: false,
        role: { $in: ['mentor', 'organization'] },
        profileCompleted: true // Only show those who finished setup
    }).select('-password').sort({ createdAt: -1 });

    res.json(users);
});

// @desc    Approve a user
// @route   PUT /api/admin/approve-user/:id
// @access  Private/Admin
export const approveUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.isApproved = true;
        await user.save();

        await createNotification({
            recipient: user._id,
            type: 'approval',
            title: 'Account Approved! 🎉',
            message: `Welcome to Knowvy! Your ${user.role} account has been approved by the admin. You can now start hosting events.`,
            link: '/profile'
        });

        res.json({ message: 'User approved successfully', user });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Reject and delete a user
// @route   DELETE /api/admin/reject-user/:id
// @access  Private/Admin
export const rejectUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        // Delete profiles too
        const userId = user._id;
        if (user.role === 'student') await StudentProfile.deleteOne({ user: userId });
        if (user.role === 'mentor') await MentorProfile.deleteOne({ user: userId });
        if (user.role === 'organization') await OrganizationProfile.deleteOne({ user: userId });

        await user.deleteOne();
        res.json({ message: 'User rejected and account deleted' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});
