import express from 'express';
import { createReview } from '../controllers/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';
import authorizeRole from '../middlewares/authorizeRole.js';

const router = express.Router();

// Only customers can create reviews
router.post('/', protect, authorizeRole('customer'), createReview);

export default router;