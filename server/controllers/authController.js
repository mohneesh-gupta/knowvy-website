import asyncHandler from "express-async-handler";
import Admin from "../models/Admin.js";
import Student from "../models/Student.js";
import Organization from "../models/Organization.js";
import Mentor from "../models/Mentor.js";
import generateToken from "../utils/generateToken.js";

/**
 * 🔎 Helper: Check if email already exists across all user collections
 */
const checkEmailExists = async (email) => {
  const collections = [
    { model: Admin, type: "admin" },
    { model: Student, type: "student" },
    { model: Organization, type: "organization" },
    { model: Mentor, type: "mentor" },
  ];

  for (const { model, type } of collections) {
    const user = await model.findOne({ email });
    if (user) return { exists: true, userType: type };
  }

  return { exists: false };
};

/**
 * @desc    Login user (Admin / Student / Mentor / Organization)
 * @route   POST /api/auth/login
 * @access  Public
 */
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  let user = null;
  let userType = null;

  const collections = [
    { model: Admin, type: "admin" },
    { model: Student, type: "student" },
    { model: Organization, type: "organization" },
    { model: Mentor, type: "mentor" },
  ];

  for (const { model, type } of collections) {
    user = await model.findOne({ email });
    if (user) {
      userType = type;
      break;
    }
  }

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    userType,
    avatar: user.avatar,
    bio: user.bio,
    phone: user.phone,

    // ✅ ROLE-SPECIFIC (MATCHES SCHEMAS)
    ...(userType === "student" && {
      college: user.college,
      skills: user.skills,
      year: user.year,
      branch: user.branch,
    }),

    ...(userType === "mentor" && {
      occupation: user.occupation,
      specialtyField: user.specialtyField,
      experienceYears: user.experienceYears,
      skills: user.skills,
    }),

    ...(userType === "organization" && {
      orgName: user.orgName,
      location: user.location,
    }),

    ...(userType === "admin" && {
      permissions: user.permissions,
    }),

    token: generateToken(user._id, userType),
  });
});

/**
 * @desc    Register new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, userType, ...otherFields } = req.body;

  // 🔒 Prevent duplicate email across roles
  const emailCheck = await checkEmailExists(email);
  if (emailCheck.exists) {
    res.status(400);
    throw new Error("User already exists");
  }

  let user;

  switch (userType) {
    case "admin": {
      const adminExists = await Admin.findOne({});
      if (adminExists) {
        res.status(403);
        throw new Error("Admin account already exists. Only one admin is allowed.");
      }
      user = await Admin.create({ name, email, password, ...otherFields });
      break;
    }

    case "student":
      user = await Student.create({ name, email, password, ...otherFields });
      break;

    case "organization":
      user = await Organization.create({ name, email, password, ...otherFields });
      break;

    case "mentor":
      user = await Mentor.create({ name, email, password, ...otherFields });
      break;

    default:
      res.status(400);
      throw new Error("Invalid user type");
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    userType,
    avatar: user.avatar,
    bio: user.bio,
    phone: user.phone,
    token: generateToken(user._id, userType),
  });
});

/**
 * @desc    Get logged-in user's profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  const userType = req.userType;

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    userType,
    avatar: user.avatar,
    bio: user.bio,
    phone: user.phone,

    // Role-Specific Fields
    ...(userType === "student" && {
      college: user.college,
      skills: user.skills, // Ensure skills are returned
      year: user.year,
      branch: user.branch,
    }),

    ...(userType === "mentor" && {
      occupation: user.occupation,
      specialtyField: user.specialtyField, // Ensure specialtyField is returned
      experienceYears: user.experienceYears,
      skills: user.skills,
    }),

    ...(userType === "organization" && {
      orgName: user.orgName,
      location: user.location,
    }),

    ...(userType === "admin" && {
      permissions: user.permissions,
    }),
  });
});

/**
 * @desc    Update logged-in user's profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  const userType = req.userType;

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Update common fields
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.bio = req.body.bio || user.bio;
  user.phone = req.body.phone || user.phone;
  user.avatar = req.body.avatar || user.avatar;

  if (req.body.password) {
    user.password = req.body.password;
  }

  // Update role-specific fields
  if (userType === 'student') {
    user.college = req.body.college || user.college;
    user.skills = req.body.skills || user.skills;
  } else if (userType === 'organization') {
    user.orgName = req.body.orgName || user.orgName;
    user.location = req.body.location || user.location;
  } else if (userType === 'mentor') {
    user.occupation = req.body.occupation || user.occupation;
    user.experienceYears = req.body.experienceYears || user.experienceYears;
    user.specialtyField = req.body.specialtyField || user.specialtyField;
    user.skills = req.body.skills || user.skills;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    userType,
    avatar: updatedUser.avatar,
    bio: updatedUser.bio,
    phone: updatedUser.phone,
    token: generateToken(updatedUser._id, userType),

    // Role-Specific Fields
    ...(userType === "student" && {
      college: updatedUser.college,
      skills: updatedUser.skills,
      year: updatedUser.year,
      branch: updatedUser.branch,
    }),

    ...(userType === "mentor" && {
      occupation: updatedUser.occupation,
      specialtyField: updatedUser.specialtyField,
      experienceYears: updatedUser.experienceYears,
      skills: updatedUser.skills,
    }),

    ...(userType === "organization" && {
      orgName: updatedUser.orgName,
      location: updatedUser.location,
    }),

    ...(userType === "admin" && {
      permissions: updatedUser.permissions,
    }),
  });
});

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
};
