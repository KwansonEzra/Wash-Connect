import express from 'express';
import { getNotifications, markNotificationAsRead } from '../controllers/notificationController.js';
import { protect } from '../middlewares/authMiddleware.js';
import checkId from '../middlewares/checkId.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.put('/:id/read', protect, checkId, markNotificationAsRead);

export default router;