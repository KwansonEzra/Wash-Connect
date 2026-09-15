import mongoose from 'mongoose';

const serviceCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    items: [{
      type: String, // e.g., ["tshirt", "trad", "trousers"]
    }],
    allowsCustomItem: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ServiceCategory = mongoose.model('ServiceCategory', serviceCategorySchema);

export default ServiceCategory;