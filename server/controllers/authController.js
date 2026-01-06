import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import AdminProfile from "../models/profiles/AdminProfile.js";
import StudentProfile from "../models/profiles/StudentProfile.js";
import OrganizationProfile from "../models/profiles/OrganizationProfile.js";
import MentorProfile from "../models/profiles/MentorProfile.js";
import generateToken from "../utils/generateToken.js";

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user in User collection (Auth only)
  const user = await User.findOne({ email });

  if (user) {
    // If user exists but is a Google user AND has no password
    if (user.authProvider === 'google' && !user.password) {
      res.status(401);
      throw new Error("This account uses Google Login. Please click 'Continue with Google'.");
    }

    if (await user.matchPassword(password)) {
      // Legacy support: if role is missing but userType exists (from old docs)
      const legacyUserType = user.get('userType', null, { strict: false });
      if (!user.role && legacyUserType) {
        user.role = legacyUserType;
        await user.save(); // Migrate on the fly
      }

      // Return JWT and basic User info
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        userType: user.role, // For frontend compatibility
        profileCompleted: user.profileCompleted,
        isApproved: user.isApproved,
        token: generateToken(user._id),
      });
      return; // Prevent fall-through
    }
  }

  res.status(401);
  throw new Error("Invalid email or password");
});

/**
 * @desc    Register new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, ...otherFields } = req.body;

  // 1. Validate email uniqueness in User
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // 2. Create User
  const user = await User.create({
    name,
    email,
    password,
    role,
    authProvider: 'local',
    profileCompleted: true, // Local signup requires all fields immediately
    isApproved: role === 'student' || role === 'admin',
  });

  if (user) {
    // 3. Create corresponding role profile
    const profileData = {
      user: user._id,
      ...otherFields,
      // Note: name/email are in User, but some profiles might want them duplicated?
      // Based on my sanitization in Phase 1, I removed name/email from profiles.
      // So simple strictly role-specific fields here.
      // We must ensure the FE sends correct fields.
    };

    try {
      switch (role) {
        case "student":
          await StudentProfile.create(profileData);
          break;
        case "mentor":
          await MentorProfile.create(profileData);
          break;
        case "organization":
          await OrganizationProfile.create(profileData);
          break;
        case "admin":
          // Check if admin exists is handled? Usually first admin.
          // For now just create.
          await AdminProfile.create(profileData);
          break;
        default:
          throw new Error("Invalid role");
      }
    } catch (profileError) {
      // Rollback user creation if profile fails
      await User.findByIdAndDelete(user._id);
      throw profileError;
    }

    // Notify admins if mentor or organization needs approval
    if (role === 'mentor' || role === 'organization') {
      const { createNotification } = await import('./notificationController.js');
      const admins = await User.find({ role: 'admin' });

      for (const admin of admins) {
        await createNotification({
          recipient: admin._id,
          sender: user._id,
          type: 'admin_action',
          title: '👤 New Account Pending Approval',
          message: `A new ${role} account "${name}" has registered and needs approval.`,
          link: '/admin/approvals'
        });
      }
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileCompleted: user.profileCompleted,
      isApproved: user.isApproved,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

/**
 * @desc    Handle Google OAuth Callback
 * @route   GET /api/auth/google/callback
 * @access  Public
 */
const googleCallback = asyncHandler(async (req, res) => {
  // req.user is set by Passport middleware before this controller is called
  const user = req.user;

  if (!user) {
    res.status(401);
    throw new Error("Authentication failed");
  }

  const token = generateToken(user._id);

  // Redirect to client
  // Determine redirect URL based on profile completion
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const targetPath = user.profileCompleted ? '/' : '/complete-profile';

  // Construct redirect with token
  // Use a query param or a temporary code? Using token directly for simplicity as per common SPA patterns, 
  // though cookies are safer (Phase 7.2 mentions secure cookies in production).
  // For now, implementing token in query.
  res.redirect(`${clientUrl}${targetPath}?token=${token}`);
});

export {
  authUser,
  registerUser,
  googleCallback,
};
