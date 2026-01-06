import express from 'express';
import { sendMessage, getMessages, getUnreadCount, getConversations } from '../controllers/chatController.js';
import { protect } from '../middleware/protect.js';

const router = express.Router();

// Get all conversations
router.get('/conversations', protect, getConversations);

// Get unread count
router.get('/unread/count', protect, getUnreadCount);

// Get messages for a specific request
router.get('/:requestId', protect, getMessages);

// Send a message
router.post('/:requestId', protect, sendMessage);

export default router;
