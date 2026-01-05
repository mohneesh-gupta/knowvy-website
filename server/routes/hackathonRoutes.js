import express from 'express';
import { getHackathons, getHackathonById, createHackathon, deleteHackathon, getPendingHackathons, approveHackathon, rejectHackathon, getMyHackathons } from '../controllers/hackathonController.js';
import { protect, admin, approved } from '../middleware/protect.js';
import { requireOrganization } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public routes
router.route('/').get(getHackathons);
router.route('/:id').get(getHackathonById);

// Protected routes - not restricted to organization only
router.post('/', protect, approved, createHackathon);
router.delete('/:id', protect, deleteHackathon);

// User's own hackathons
router.get('/user/my', protect, getMyHackathons);

// Admin only routes
router.get('/admin/pending', protect, admin, getPendingHackathons);
router.put('/:id/approve', protect, admin, approveHackathon);
router.delete('/:id/reject', protect, admin, rejectHackathon);

export default router;
