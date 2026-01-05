import asyncHandler from 'express-async-handler';
import Notification from '../models/Notification.js';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user._id })
        .sort({ createdAt: -1 })
        .limit(20);
    res.json(notifications);
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);
    if (notification) {
        if (notification.recipient.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized');
        }
        notification.read = true;
        await notification.save();
        res.json({ message: 'Marked as read' });
    } else {
        res.status(404);
        throw new Error('Notification not found');
    }
});

// @desc    Mark all as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { recipient: req.user._id, read: false },
        { $set: { read: true } }
    );
    res.json({ message: 'All notifications marked as read' });
});

// Utility function to create notification
export const createNotification = async (data) => {
    try {
        await Notification.create(data);
    } catch (error) {
        console.error('Failed to create notification:', error);
    }
};
