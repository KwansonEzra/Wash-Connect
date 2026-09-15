import mongoose from 'mongoose';

const locationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'State',
      required: true,
    },
    area: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index
locationSchema.index({ state: 1, name: 1 }, { unique: true });

const Location = mongoose.model('Location', locationSchema);

export default Location;