import asyncHandler from 'express-async-handler';

// Middleware to check if user is organization
const requireOrganization = asyncHandler(async (req, res, next) => {
    if (req.user && req.userType === 'organization') {
        return next();
    }
    res.status(403);
    throw new Error('Access denied. Organization role required.');
});

// Middleware to check if user is mentor
const requireMentor = asyncHandler(async (req, res, next) => {
    if (req.user && req.userType === 'mentor') {
        return next();
    }
    res.status(403);
    throw new Error('Access denied. Mentor role required.');
});

// Middleware to check if user is organization OR mentor OR admin
const requireOrganizationOrMentor = asyncHandler(async (req, res, next) => {
    if (
        req.user &&
        (req.userType === 'organization' ||
         req.userType === 'mentor' ||
         req.userType === 'admin')
    ) {
        return next();
    }
    res.status(403);
    throw new Error('Access denied. Organization or Mentor role required.');
});

// Middleware to check if user is admin
const requireAdmin = asyncHandler(async (req, res, next) => {
    if (req.user && req.userType === 'admin') {
        return next();
    }
    res.status(403);
    throw new Error('Access denied. Admin role required.');
});

export {
    requireOrganization,
    requireMentor,
    requireOrganizationOrMentor,
    requireAdmin
};
