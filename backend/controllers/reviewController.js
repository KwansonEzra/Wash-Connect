import asyncHandler from '../middlewares/asyncHandler.js';
import Review from '../models/reviewModel.js';
import Booking from '../models/bookingModel.js';
import LSP from '../models/lspModel.js';

// @desc    Create a review for an LSP
// @route   POST /api/reviews
// @access  Private (Customer who completed a booking with the LSP)
const createReview = asyncHandler(async (req, res) => {
  const { lspId, bookingId, rating, comment } = req.body;

  // Validate rating
  if (!rating || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }

  // Check if booking exists and belongs to the user and is completed
  const booking = await Booking.findOne({ _id: bookingId, customer: req.user._id, status: 'completed' });
  if (!booking) {
    res.status(400);
    throw new Error('You can only review completed bookings');
  }

  // Check if LSP matches the booking's LSP
  if (booking.lsp.toString() !== lspId) {
    res.status(400);
    throw new Error('Booking does not match the provided LSP ID');
  }

  // Check if review already exists for this booking
  const existingReview = await Review.findOne({ booking: bookingId });
  if (existingReview) {
    res.status(400);
    throw new Error('Review already exists for this booking');
  }

  const review = new Review({
    lsp: lspId,
    customer: req.user._id,
    booking: bookingId,
    rating,
    comment,
  });

  const createdReview = await review.save();

  // Recalculate LSP average rating and review count
  const lsp = await LSP.findById(lspId);
  if (lsp) {
    const reviews = await Review.find({ lsp: lspId });
    const numReviews = reviews.length;
    const totalRating = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avgRating = totalRating / numReviews;

    lsp.rating = avgRating;
    lsp.numReviews = numReviews;
    await lsp.save();
  }

  res.status(201).json(createdReview);
});

export { createReview };