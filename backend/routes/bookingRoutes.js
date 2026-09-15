import express from 'express';
import {
  createBooking,
  getMyBookings,
  getLSPBookings,
  getBookingById,
  acceptBooking,
  declineBooking,
  completeBooking,
  cancelBooking,
} from '../controllers/bookingController.js';
import { protect } from '../middlewares/authMiddleware.js';
import authorizeRole from '../middlewares/authorizeRole.js';
import checkId from '../middlewares/checkId.js';

const router = express.Router();

// Only customers can create bookings
router.post('/', protect, authorizeRole('customer'), createBooking);

// Get the logged-in customer's own bookings
router.get('/mine', protect, authorizeRole('customer'), getMyBookings);

// Route for LSPs to get their inbox of bookings
router.get('/lsp', protect, authorizeRole('lsp'), getLSPBookings);

// Accessible by customer, LSP owner, or admin (checked inside the controller)
router.get('/:id', protect, checkId, getBookingById);

// Each of these needs its own route definition - chaining them onto a
// single router.route('/:id').put(...) silently overwrites earlier
// handlers and passes strings where Express expects middleware functions.
router.put('/:id/accept', protect, checkId, authorizeRole('lsp'), acceptBooking);
router.put('/:id/decline', protect, checkId, authorizeRole('lsp'), declineBooking);
router.put('/:id/complete', protect, checkId, authorizeRole('lsp'), completeBooking);
router.put('/:id/cancel', protect, checkId, authorizeRole('customer'), cancelBooking);

export default router;
