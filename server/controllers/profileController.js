import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import StudentProfile from '../models/profiles/StudentProfile.js';
import MentorProfile from '../models/profiles/MentorProfile.js';
import OrganizationProfile from '../models/profiles/OrganizationProfile.js';
import AdminProfile from '../models/profiles/AdminProfile.js';

// @desc    Complete user profile after OAuth signup
// @route   POST /api/profile/complete-profile
// @access  Private
export const completeProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.profileCompleted) {
        res.status(400);
        throw new Error('Profile already completed');
    }

    const { role, profileData, name, password } = req.body;

    // Update User common fields
    if (name) user.name = name;
    if (password) user.password = password; // Will be hashed by pre-save hook

    // If role is not set (e.g. from OAuth default), set it now.
    // However, if user registered locally, role is already set.
    // If OAuth, role might be null or default? Prompt 1.1 said ensure 'role'.
    // If role is missing in User, we must set it.
    if (!user.role && role) {
        user.role = role;
    } else if (!user.role && !role) {
        res.status(400);
        throw new Error('Role is required');
    }

    let profile;
    const targetRole = user.role || role; // Use existing or new role

    // Check if profile already exists (idempotency)
    // Create appropriate profile based on role
    switch (targetRole) {
        case 'student':
            profile = await StudentProfile.create({
                user: user._id,
                ...profileData,
            });
            break;

        case 'mentor':
            profile = await MentorProfile.create({
                user: user._id,
                ...profileData,
            });
            break;

        case 'organization':
            profile = await OrganizationProfile.create({
                user: user._id,
                ...profileData,
            });
            break;

        case 'admin':
            profile = await AdminProfile.create({
                user: user._id,
                ...profileData,
            });
            break;

        default:
            res.status(400);
            throw new Error('Invalid user role');
    }

    // Mark profile as completed and set approval status
    user.role = targetRole;
    user.profileCompleted = true;
    user.isApproved = targetRole === 'student' || targetRole === 'admin';
    await user.save();

    res.status(201).json({
        success: true,
        message: 'Profile completed successfully',
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            userType: user.role, // For frontend compatibility
            profileCompleted: user.profileCompleted
        },
        profile,
    });
});

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    let profile;

    // Get appropriate profile based on role
    const role = user.role;
    const query = { user: user._id };

    switch (role) {
        case 'student':
            profile = await StudentProfile.findOne(query);
            break;
        case 'mentor':
            profile = await MentorProfile.findOne(query);
            break;
        case 'organization':
            profile = await OrganizationProfile.findOne(query);
            break;
        case 'admin':
            profile = await AdminProfile.findOne(query);
            break;
        default:
            // It's possible for a user to have no role if just created via OAuth and hasn't completed profile?
            // If so, profile is null.
            break;
    }

    res.status(200).json({
        success: true,
        user,
        profile,
    });
});

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Update User common fields
    if (req.body.name) user.name = req.body.name;
    // Password update should be handled separately or here if needed, but usually dedicated endpoint.
    // For now, allow name update.
    await user.save();

    let profile;
    const role = user.role;

    // Update appropriate profile based on role
    const updateData = req.body.profileData || req.body; // Support nested or flat structure, adhering to API design

    // We should strictly separate what goes to profile.
    // Assuming req.body contains profile fields directly or in `profileData`.
    // Let's assume the client sends mixed fields. We need to filter?
    // Mongoose `findOneAndUpdate` with `strict: false` might allow junk, but schemas define structure.
    // The previous implementation used `req.body`.

    const options = { new: true, runValidators: true };
    const query = { user: user._id };

    switch (role) {
        case 'student':
            profile = await StudentProfile.findOneAndUpdate(query, updateData, options);
            break;
        case 'mentor':
            profile = await MentorProfile.findOneAndUpdate(query, updateData, options);
            break;
        case 'organization':
            profile = await OrganizationProfile.findOneAndUpdate(query, updateData, options);
            break;
        case 'admin':
            profile = await AdminProfile.findOneAndUpdate(query, updateData, options);
            break;
        default:
            res.status(400);
            throw new Error('Invalid user role');
    }

    if (!profile && user.profileCompleted) {
        // Should not happen if profileCompleted is true
        res.status(404);
        throw new Error('Profile not found');
    }

    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user,
        profile,
    });
});
