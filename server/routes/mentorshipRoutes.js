import express from 'express';
import { requestMentorship, getMyRequests, updateRequestStatus } from '../controllers/mentorshipController.js';
import { protect } from '../middleware/protect.js';
import { requireMentor } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Student: Request mentorship
router.post('/', protect, requestMentorship);

// All: Get own requests
router.get('/my-requests', protect, getMyRequests);

// Mentor: Update status
router.put('/:id', protect, requireMentor, updateRequestStatus);

export default router;
