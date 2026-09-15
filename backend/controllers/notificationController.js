import asyncHandler from '../middlewares/asyncHandler.js';
import Notification from '../models/notificationModel.js';

// @desc    Get user's notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const { unread } = req.query; // Optional query to filter unread

  let filter = { user: req.user._id };
  if (unread === 'true') {
    filter.isRead = false;
  }

  const notifications = await Notification.find(filter).sort({ createdAt: -1 });
  res.json(notifications);
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  // Ensure user owns the notification
  if (notification.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Access denied');
  }

  notification.isRead = true;
  const updatedNotification = await notification.save();

  res.json(updatedNotification);
});

export { getNotifications, markNotificationAsRead };