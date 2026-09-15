import mongoose from 'mongoose';
import serviceItemSchema from './serviceItemModel.js'; // Embedded schema

const hoursSchema = new mongoose.Schema({
  open: { type: String, required: true }, // HH:mm format
  close: { type: String, required: true }, // HH:mm format
  days: [{ type: Number, min: 0, max: 6 }] // Array of day numbers (0 = Sunday)
});

const lspSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // Each user can own only one LSP profile
    },
    shopName: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    logo: {
      type: String,
    },
    photos: [{
      type: String,
    }],
    idDocumentUrl: {
      type: String,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'State',
      required: true,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
    },
    addressLine: {
      type: String,
    },
    geo: {
      lat: Number,
      lng: Number,
    },
    servicesOffered: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceCategory',
    }],
    pricing: [serviceItemSchema], // Embedded array of service items
    hours: hoursSchema,
    acceptsCustomOrders: {
      type: Boolean,
      default: false,
    },
    turnaroundHours: {
      type: Number,
    },
    offersDelivery: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient searching
lspSchema.index({ state: 1, location: 1 });
lspSchema.index({ isActive: 1, isVerified: 1 });

const LSP = mongoose.model('LSP', lspSchema);

export default LSP;