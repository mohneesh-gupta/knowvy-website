import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import Admin from '../models/Admin.js';
import Student from '../models/Student.js';
import Organization from '../models/Organization.js';
import Mentor from '../models/Mentor.js';

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const { id, userType } = decoded;

            let user;
            switch (userType) {
                case 'admin':
                    user = await Admin.findById(id).select('-password');
                    break;
                case 'student':
                    user = await Student.findById(id).select('-password');
                    break;
                case 'organization':
                    user = await Organization.findById(id).select('-password');
                    break;
                case 'mentor':
                    user = await Mentor.findById(id).select('-password');
                    break;
                default:
                    res.status(401);
                    throw new Error('Invalid user type');
            }

            if (!user) {
                res.status(401);
                throw new Error('User not found');
            }

            req.user = user;
            req.userType = userType;
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const admin = (req, res, next) => {
    if (req.userType && req.userType === 'admin') {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};

export { protect, admin };
