import express from 'express';
import {
  getMetrics,
  getAllUsers,
  getAllLSPs,
  getAllBookings,
  getPendingLSPs,
} from '../controllers/adminController.js';
import { protect } from '../middlewares/authMiddleware.js';
import authorizeRole from '../middlewares/authorizeRole.js';

const router = express.Router();

// Every route here is admin-only
router.use(protect, authorizeRole('admin'));

router.get('/metrics', getMetrics);
router.get('/users', getAllUsers);
router.get('/lsps/pending', getPendingLSPs);
router.get('/lsps', getAllLSPs);
router.get('/bookings', getAllBookings);

export default router;
