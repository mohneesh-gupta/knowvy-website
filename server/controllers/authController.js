import asyncHandler from 'express-async-handler';
import Admin from '../models/Admin.js';
import Student from '../models/Student.js';
import Organization from '../models/Organization.js';
import Mentor from '../models/Mentor.js';
import generateToken from '../utils/generateToken.js';

// Helper function to check if email exists in any collection
const checkEmailExists = async (email) => {
    const admin = await Admin.findOne({ email });
    if (admin) return { exists: true, userType: 'admin' };

    const student = await Student.findOne({ email });
    if (student) return { exists: true, userType: 'student' };

    const organization = await Organization.findOne({ email });
    if (organization) return { exists: true, userType: 'organization' };

    const mentor = await Mentor.findOne({ email });
    if (mentor) return { exists: true, userType: 'mentor' };

    return { exists: false };
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Search across all user collections
    let user = null;
    let userType = null;

    user = await Admin.findOne({ email });
    if (user) userType = 'admin';

    if (!user) {
        user = await Student.findOne({ email });
        if (user) userType = 'student';
    }

    if (!user) {
        user = await Organization.findOne({ email });
        if (user) userType = 'organization';
    }

    if (!user) {
        user = await Mentor.findOne({ email });
        if (user) userType = 'mentor';
    }

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            userType: userType,
            avatar: user.avatar,
            bio: user.bio,
            phone: user.phone,
            // Include type-specific fields
            ...(userType === 'student' && { college: user.college, skills: user.skills }),
            ...(userType === 'organization' && { website: user.website, organizationType: user.organizationType }),
            ...(userType === 'mentor' && { expertise: user.expertise, company: user.company }),
            token: generateToken(user._id, userType),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, userType, ...otherFields } = req.body;

    // Check if email exists in any collection
    const emailCheck = await checkEmailExists(email);
    if (emailCheck.exists) {
        res.status(400);
        throw new Error('User already exists');
    }

    let user;

    switch (userType) {
        case 'admin':
            // Check if admin already exists
            const adminExists = await Admin.findOne({});
            if (adminExists) {
                res.status(403);
                throw new Error('Admin account already exists. Only one admin is allowed.');
            }
            user = await Admin.create({ name, email, password, ...otherFields });
            break;

        case 'student':
            user = await Student.create({
                name,
                email,
                password,
                avatar: otherFields.avatar,
                bio: otherFields.bio,
                phone: otherFields.phone,
                college: otherFields.college,
                skills: otherFields.skills,
                year: otherFields.year,
                enrollmentNumber: otherFields.enrollmentNumber,
                branch: otherFields.branch
            });
            break;

        case 'organization':
            user = await Organization.create({
                name,
                email,
                password,
                avatar: otherFields.avatar,
                bio: otherFields.bio,
                phone: otherFields.phone,
                website: otherFields.website,
                address: otherFields.address,
                organizationType: otherFields.organizationType,
                industry: otherFields.industry,
                size: otherFields.size
            });
            break;

        case 'mentor':
            user = await Mentor.create({
                name,
                email,
                password,
                avatar: otherFields.avatar,
                bio: otherFields.bio,
                phone: otherFields.phone,
                expertise: otherFields.expertise,
                experience: otherFields.experience,
                company: otherFields.company,
                designation: otherFields.designation,
                linkedIn: otherFields.linkedIn,
                github: otherFields.github
            });
            break;

        default:
            res.status(400);
            throw new Error('Invalid user type');
    }

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            userType: userType,
            avatar: user.avatar,
            bio: user.bio,
            phone: user.phone,
            token: generateToken(user._id, userType),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    // req.user and req.userType are set by protect middleware
    res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        userType: req.userType,
        avatar: req.user.avatar,
        bio: req.user.bio,
        phone: req.user.phone,
        // Include type-specific fields
        ...(req.userType === 'student' && {
            college: req.user.college,
            skills: req.user.skills,
            year: req.user.year,
            branch: req.user.branch
        }),
        ...(req.userType === 'organization' && {
            website: req.user.website,
            organizationType: req.user.organizationType,
            verificationStatus: req.user.verificationStatus
        }),
        ...(req.userType === 'mentor' && {
            expertise: req.user.expertise,
            company: req.user.company,
            availability: req.user.availability,
            rating: req.user.rating
        }),
        ...(req.userType === 'admin' && {
            permissions: req.user.permissions
        })
    });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = req.user;
    const userType = req.userType;

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Update common fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;

    // Update type-specific fields
    if (userType === 'student') {
        user.college = req.body.college !== undefined ? req.body.college : user.college;
        user.skills = req.body.skills !== undefined ? req.body.skills : user.skills;
        user.year = req.body.year !== undefined ? req.body.year : user.year;
        user.branch = req.body.branch !== undefined ? req.body.branch : user.branch;
    } else if (userType === 'organization') {
        user.website = req.body.website !== undefined ? req.body.website : user.website;
        user.address = req.body.address !== undefined ? req.body.address : user.address;
        user.organizationType = req.body.organizationType || user.organizationType;
    } else if (userType === 'mentor') {
        user.expertise = req.body.expertise !== undefined ? req.body.expertise : user.expertise;
        user.experience = req.body.experience !== undefined ? req.body.experience : user.experience;
        user.company = req.body.company !== undefined ? req.body.company : user.company;
        user.designation = req.body.designation !== undefined ? req.body.designation : user.designation;
        user.linkedIn = req.body.linkedIn !== undefined ? req.body.linkedIn : user.linkedIn;
        user.github = req.body.github !== undefined ? req.body.github : user.github;
        user.availability = req.body.availability || user.availability;
    }

    // Only update password if provided and not empty
    if (req.body.password && req.body.password.trim() !== '') {
        user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        userType: userType,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        phone: updatedUser.phone,
        token: generateToken(updatedUser._id, userType),
    });
});

export { authUser, registerUser, getUserProfile, updateUserProfile };
