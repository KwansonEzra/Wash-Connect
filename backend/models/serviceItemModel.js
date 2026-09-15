// This is an embedded schema, not a standalone model
import mongoose from 'mongoose';

const serviceItemSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceCategory', // This reference will be resolved when embedded in LSP
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
    unitPrice: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false, // Disable _id for embedded documents
  }
);

export default serviceItemSchema;