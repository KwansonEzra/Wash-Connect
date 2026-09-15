import express from 'express';
import {
  getLSPs,
  getLSPById,
  createLSP,
  getMyLSP,
  updateLSP,
  updateLSPPricing,
  updateLSPAvailability,
  verifyLSP,
} from '../controllers/lspController.js';
import { protect } from '../middlewares/authMiddleware.js';
import authorizeRole from '../middlewares/authorizeRole.js';
import checkId from '../middlewares/checkId.js';

const router = express.Router();

router
  .route('/')
  .get(getLSPs)
  .post(protect, authorizeRole('lsp'), createLSP); // Only LSPs can create their profile

// Routes for the LSP managing their own profile.
// IMPORTANT: these must be registered before the '/:id' route below,
// otherwise Express would match '/mine' as an :id value instead.
router.get('/mine', protect, authorizeRole('lsp'), getMyLSP);
router.put('/mine', protect, authorizeRole('lsp'), updateLSP);
router.put('/mine/pricing', protect, authorizeRole('lsp'), updateLSPPricing);
router.put('/mine/availability', protect, authorizeRole('lsp'), updateLSPAvailability);

router.get('/:id', checkId, getLSPById);

// Route for admin to verify LSPs
router.put('/:id/verify', protect, checkId, authorizeRole('admin'), verifyLSP);

export default router;
