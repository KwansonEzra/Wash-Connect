import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['customer', 'lsp', 'admin'],
      default: 'customer',
    },
    phone: {
      type: String,
    },
    defaultStateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'State',
    },
    defaultLocationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
    },
    notifyByEmail: {
      type: Boolean,
      default: true,
    },
    notifyBySms: {
      type: Boolean,
      default: false,
    },
    // For backward compatibility with base repo
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password.
// NOTE: both `return` before next() and calling next() in the hashing
// branch are required. Without `return`, an unmodified password would
// still fall through and get re-hashed (double-hashing) on every save.
// Without the trailing next(), a genuinely new/changed password would
// never signal completion and the save would hang.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual to determine isAdmin based on role
userSchema.virtual('computedIsAdmin').get(function () {
  return this.role === 'admin';
});

const User = mongoose.model('User', userSchema);

export default User;