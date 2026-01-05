import express from 'express';
import {
    completeProfile,
    getProfile,
    updateProfile,
} from '../controllers/profileController.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();

// Complete profile after OAuth signup
router.post('/complete-profile', protect, completeProfile);

// Get user profile
router.get('/', protect, getProfile);

// Update user profile
router.put('/', protect, updateProfile);

export default router;
