import express from 'express';
import { getSessions, createSession, getSessionById, getPendingSessions, approveSession, rejectSession, getMySessions } from '../controllers/sessionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { requireOrganizationOrMentor } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getSessions);
router.get('/:id', getSessionById);

// Protected routes
router.post('/', protect, requireOrganizationOrMentor, createSession);

// User's own sessions
router.get('/user/my', protect, getMySessions);

// Admin only routes
router.get('/admin/pending', protect, admin, getPendingSessions);
router.put('/:id/approve', protect, admin, approveSession);
router.delete('/:id/reject', protect, admin, rejectSession);

export default router;
