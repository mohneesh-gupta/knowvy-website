import express from 'express';
import { createHostRequest, getHostRequests } from '../controllers/hostController.js';
import { protect, admin } from '../middleware/protect.js';

const router = express.Router();

router.route('/').post(protect, createHostRequest).get(protect, admin, getHostRequests);

export default router;
