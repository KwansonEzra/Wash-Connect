import asyncHandler from '../middlewares/asyncHandler.js';
import User from '../models/userModel.js';
import LSP from '../models/lspModel.js';
import Booking from '../models/bookingModel.js';
import State from '../models/stateModel.js';
import Location from '../models/locationModel.js';
import ServiceCategory from '../models/serviceCategoryModel.js';

// @desc    Get dashboard metrics
// @route   GET /api/admin/metrics
// @access  Private (Admin)
const getMetrics = asyncHandler(async (req, res) => {
  const totalCustomers = await User.countDocuments({ role: 'customer' });
  const totalLSPs = await LSP.countDocuments({});
  const totalBookings = await Booking.countDocuments({});
  const totalBookingsToday = await Booking.countDocuments({
    createdAt: {
      $gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of today
      $lt: new Date(new Date().setHours(23, 59, 59, 999)) // End of today
    }
  });

  // Metrics per state
  const bookingsPerState = await Booking.aggregate([
    {
      $lookup: {
        from: 'lsps',
        localField: 'lsp',
        foreignField: '_id',
        as: 'lspDetails'
      }
    },
    {
      $unwind: '$lspDetails'
    },
    {
      $lookup: {
        from: 'states',
        localField: 'lspDetails.state',
        foreignField: '_id',
        as: 'stateDetails'
      }
    },
    {
      $unwind: '$stateDetails'
    },
    {
      $group: {
        _id: '$stateDetails._id',
        stateName: { $first: '$stateDetails.name' },
        bookingCount: { $sum: 1 }
      }
    }
  ]);

  res.json({
    totalCustomers,
    totalLSPs,
    totalBookings,
    totalBookingsToday,
    bookingsPerState,
  });
});

// @desc    Get all users (for admin)
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password'); // Exclude password
  res.json(users);
});

// @desc    Get all LSPs (for admin)
// @route   GET /api/admin/lsps
// @access  Private (Admin)
const getAllLSPs = asyncHandler(async (req, res) => {
  const lsps = await LSP.find({})
    .populate('owner', 'username email')
    .populate('state', 'name')
    .populate('location', 'name');
  res.json(lsps);
});

// @desc    Get all bookings (for admin)
// @route   GET /api/admin/bookings
// @access  Private (Admin)
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({})
    .populate('customer', 'username email')
    .populate('lsp', 'shopName')
    .populate('items.category', 'name');
  res.json(bookings);
});

// @desc    Get LSPs pending verification (for admin)
// @route   GET /api/admin/lsps/pending
// @access  Private (Admin)
const getPendingLSPs = asyncHandler(async (req, res) => {
  const lsps = await LSP.find({ isVerified: false })
    .populate('owner', 'username email')
    .populate('state', 'name')
    .populate('location', 'name');
  res.json(lsps);
});

export { getMetrics, getAllUsers, getAllLSPs, getAllBookings, getPendingLSPs };