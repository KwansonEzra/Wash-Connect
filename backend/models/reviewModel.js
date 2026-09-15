import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    lsp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LSP',
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true, // Prevent multiple reviews per booking
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying by LSP
reviewSchema.index({ lsp: 1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;