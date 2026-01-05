import asyncHandler from 'express-async-handler';

// Middleware to check if user is organization
const requireOrganization = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === 'organization' && req.user.isApproved) {
        return next();
    }
    res.status(403);
    throw new Error('Access denied. Organization role required and must be approved.');
});

// Middleware to check if user is mentor
const requireMentor = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === 'mentor' && req.user.isApproved) {
        return next();
    }
    res.status(403);
    throw new Error('Access denied. Mentor role required and must be approved.');
});

// Middleware to check if user is organization OR mentor OR admin
const requireOrganizationOrMentor = asyncHandler(async (req, res, next) => {
    if (
        req.user &&
        (req.user.role === 'organization' ||
            req.user.role === 'mentor' ||
            req.user.role === 'admin') &&
        req.user.isApproved
    ) {
        return next();
    }
    res.status(403);
    throw new Error('Access denied. Organization or Mentor role required and must be approved.');
});

// Middleware to check if user is admin
const requireAdmin = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === 'admin' && req.user.isApproved) {
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
