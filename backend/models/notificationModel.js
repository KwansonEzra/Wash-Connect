import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['booking_created', 'booking_accepted', 'booking_declined', 'booking_completed', 'booking_cancelled', 'system'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    link: {
      type: String, // e.g., "/booking/:id"
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying by user
notificationSchema.index({ user: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;