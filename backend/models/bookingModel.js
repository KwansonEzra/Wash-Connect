import mongoose from 'mongoose';

const bookingItemSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceCategory',
      required: true,
    },
    itemKey: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    lineTotal: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false, // Disable _id for embedded documents
  }
);

const paymentSchema = new mongoose.Schema({
  method: { type: String, required: true }, // e.g., 'cash', 'paypal'
  status: { type: String, default: 'pending' },
  ref: String, // Transaction reference
  paidAt: Date,
});

const bookingSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lsp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LSP',
      required: true,
    },
    items: [bookingItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
    notifyOnComplete: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    declineReason: {
      type: String,
    },
    acceptedAt: Date,
    completedAt: Date,
    payment: paymentSchema,
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying by customer and LSP
bookingSchema.index({ customer: 1 });
bookingSchema.index({ lsp: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;