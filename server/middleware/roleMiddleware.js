import asyncHandler from 'express-async-handler';

// Middleware to check if user is organization
const requireOrganization = asyncHandler(async (req, res, next) => {
    if (req.user && req.userType === 'organization') {
        next();
    } else {
        res.status(403);
        throw new Error('Access denied. Organization role required.');
    }
});

// Middleware to check if user is mentor
const requireMentor = asyncHandler(async (req, res, next) => {
    if (req.user && req.userType === 'mentor') {
        next();
    } else {
        res.status(403);
        throw new Error('Access denied. Mentor role required.');
    }
});

// Middleware to check if user is organization OR mentor
const requireOrganizationOrMentor = asyncHandler(async (req, res, next) => {
    if (req.user && (req.userType === 'organization' || req.userType === 'mentor' || req.userType === 'admin')) {
        next();
    } else {
        res.status(403);
        throw new Error('Access denied. Organization or Mentor role required.');
    }
});

// Middleware to check if user is admin (already exists in authMiddleware, but included for completeness)
const requireAdmin = asyncHandler(async (req, res, next) => {
    if (req.user && req.userType === 'admin') {
        next();
    } else {
        res.status(403);
        throw new Error('Access denied. Admin role required.');
    }
});

export { requireOrganization, requireMentor, requireOrganizationOrMentor, requireAdmin };
