import asyncHandler from '../middlewares/asyncHandler.js';
import Booking from '../models/bookingModel.js';
import LSP from '../models/lspModel.js';
import Notification from '../models/notificationModel.js';
import sendEmail from '../utils/sendEmail.js'; // Placeholder

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Customer)
const createBooking = asyncHandler(async (req, res) => {
  const { lsp: lspId, items, notes, notifyOnComplete, paymentMethod } = req.body;

  if (!lspId || !items || items.length === 0) {
    res.status(400);
    throw new Error('LSP ID and at least one item are required');
  }

  const lsp = await LSP.findById(lspId);
  if (!lsp) {
    res.status(404);
    throw new Error('LSP not found');
  }

  // Validate items and compute total (client-side total is for UX only)
  let computedSubtotal = 0;
  const processedItems = [];

  for (const item of items) {
    const { category, itemKey, label, qty } = item;
    if (qty <= 0) {
      res.status(400);
      throw new Error(`Quantity must be greater than 0 for item ${label}`);
    }

    // Find the price from the LSP's pricing list
    const lspPricingItem = lsp.pricing.find(p => p.category.toString() === category && p.itemKey === itemKey);
    if (!lspPricingItem) {
      res.status(400);
      throw new Error(`Invalid service item ${itemKey} for LSP ${lsp.shopName}`);
    }

    const unitPrice = lspPricingItem.unitPrice;
    const lineTotal = qty * unitPrice;
    computedSubtotal += lineTotal;

    processedItems.push({
      category,
      itemKey,
      label, // Denormalize for audit trail
      qty,
      unitPrice,
      lineTotal,
    });
  }

  const deliveryFee = 0; // MVP: No delivery fee
  const computedTotal = computedSubtotal + deliveryFee;

  const booking = new Booking({
    customer: req.user._id,
    lsp: lspId,
    items: processedItems,
    subtotal: computedSubtotal,
    deliveryFee,
    total: computedTotal,
    notes,
    notifyOnComplete: notifyOnComplete ?? true, // Default to true if not specified
    status: 'pending', // Initial status
    payment: { method: paymentMethod || 'Cash', status: 'pending' },
  });

  const createdBooking = await booking.save();

  // Emit notification to LSP
  const lspNotification = new Notification({
    user: lsp.owner, // Assuming owner is the user ID
    type: 'booking_created',
    title: 'New Booking Received',
    body: `You have a new booking from ${req.user.username}.`,
    link: `/lsp/bookings/${createdBooking._id}`, // Link to the booking details page for the LSP
  });
  await lspNotification.save();

  // Send email to LSP (placeholder)
  // await sendEmail({
  //   email: lsp.owner.email, // Need to populate owner email or fetch separately
  //   subject: 'New Booking',
  //   message: `You have received a new booking. Please check your dashboard.`
  // });

  res.status(201).json(createdBooking);
});

// @desc    Get bookings for logged-in customer
// @route   GET /api/bookings/mine
// @access  Private (Customer)
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ customer: req.user._id })
    .populate('lsp', 'shopName')
    .populate('items.category', 'name')
    .sort({ createdAt: -1 }); // Sort by newest first

  res.json(bookings);
});

// @desc    Get bookings for logged-in LSP (inbox)
// @route   GET /api/bookings/lsp
// @access  Private (LSP)
const getLSPBookings = asyncHandler(async (req, res) => {
  // There's no lspProfileId on the User document - an LSP's profile is
  // looked up by its owner reference, same as everywhere else in this file.
  const lsp = await LSP.findOne({ owner: req.user._id });

  if (!lsp) {
    res.status(404);
    throw new Error('LSP profile not found for this user');
  }

  const bookings = await Booking.find({ lsp: lsp._id })
    .populate('customer', 'username email')
    .populate('items.category', 'name')
    .sort({ createdAt: -1 });

  res.json(bookings);
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private (Customer, LSP who owns it, Admin)
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('customer', 'username email')
    .populate('lsp', 'shopName owner')
    .populate('items.category', 'name');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Authorization check: customer, LSP owner, or admin
  const isCustomer = req.user._id.toString() === booking.customer._id.toString();
  const isLSPOwner =
    booking.lsp?.owner && req.user._id.toString() === booking.lsp.owner.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isCustomer && !isLSPOwner && !isAdmin) {
    res.status(403);
    throw new Error('Access denied');
  }

  res.json(booking);
});

// @desc    Accept a booking (by LSP)
// @route   PUT /api/bookings/:id/accept
// @access  Private (LSP who owns the booking)
const acceptBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check if the requesting user is the LSP owner of this booking
  const lsp = await LSP.findOne({ owner: req.user._id });
  if (!lsp || lsp._id.toString() !== booking.lsp.toString()) {
    res.status(403);
    throw new Error('Access denied: Not the LSP owner of this booking');
  }

  if (booking.status !== 'pending') {
    res.status(400);
    throw new Error(`Cannot accept booking with status: ${booking.status}`);
  }

  booking.status = 'accepted';
  booking.acceptedAt = Date.now();
  const updatedBooking = await booking.save();

  // Emit notification to Customer
  const customerNotification = new Notification({
    user: booking.customer,
    type: 'booking_accepted',
    title: 'Booking Accepted',
    body: `Your booking with ${lsp.shopName} has been accepted.`,
    link: `/my-bookings/${updatedBooking._id}`,
  });
  await customerNotification.save();

  // Send email to Customer (placeholder)
  // await sendEmail({
  //   email: booking.customer.email, // Need to populate or fetch
  //   subject: 'Booking Accepted',
  //   message: `Your booking has been accepted by ${lsp.shopName}.`
  // });

  res.json(updatedBooking);
});

// @desc    Decline a booking (by LSP)
// @route   PUT /api/bookings/:id/decline
// @access  Private (LSP who owns the booking)
const declineBooking = asyncHandler(async (req, res) => {
  const { reason } = req.body; // Reason for decline is required
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check if the requesting user is the LSP owner of this booking
  const lsp = await LSP.findOne({ owner: req.user._id });
  if (!lsp || lsp._id.toString() !== booking.lsp.toString()) {
    res.status(403);
    throw new Error('Access denied: Not the LSP owner of this booking');
  }

  if (booking.status !== 'pending') {
    res.status(400);
    throw new Error(`Cannot decline booking with status: ${booking.status}`);
  }

  if (!reason) {
    res.status(400);
    throw new Error('Decline reason is required');
  }

  booking.status = 'declined';
  booking.declineReason = reason;
  const updatedBooking = await booking.save();

  // Emit notification to Customer
  const customerNotification = new Notification({
    user: booking.customer,
    type: 'booking_declined',
    title: 'Booking Declined',
    body: `Your booking with ${lsp.shopName} has been declined. Reason: ${reason}`,
    link: `/my-bookings/${updatedBooking._id}`,
  });
  await customerNotification.save();

  // Send email to Customer (placeholder)
  // await sendEmail({
  //   email: booking.customer.email, // Need to populate or fetch
  //   subject: 'Booking Declined',
  //   message: `Your booking has been declined by ${lsp.shopName}. Reason: ${reason}`
  // });

  res.json(updatedBooking);
});

// @desc    Mark a booking as completed (by LSP)
// @route   PUT /api/bookings/:id/complete
// @access  Private (LSP who owns the booking)
const completeBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check if the requesting user is the LSP owner of this booking
  const lsp = await LSP.findOne({ owner: req.user._id });
  if (!lsp || lsp._id.toString() !== booking.lsp.toString()) {
    res.status(403);
    throw new Error('Access denied: Not the LSP owner of this booking');
  }

  if (booking.status !== 'accepted' && booking.status !== 'in_progress') {
    res.status(400);
    throw new Error(`Cannot complete booking with status: ${booking.status}`);
  }

  booking.status = 'completed';
  booking.completedAt = Date.now();
  const updatedBooking = await booking.save();

  // Emit notification to Customer based on notifyOnComplete flag
  if (booking.notifyOnComplete) {
    const customerNotification = new Notification({
      user: booking.customer,
      type: 'booking_completed',
      title: 'Booking Ready!',
      body: `Your laundry from ${lsp.shopName} is ready for pickup/delivery.`,
      link: `/my-bookings/${updatedBooking._id}`,
    });
    await customerNotification.save();

    // Send email/SMS to Customer (placeholder)
    // if (req.user.notifyByEmail) {
    //   await sendEmail({
    //     email: booking.customer.email, // Need to populate or fetch
    //     subject: 'Laundry Ready',
    //     message: `Your laundry from ${lsp.shopName} is ready.`
    //   });
    // }
    // if (req.user.notifyBySms) {
    //   // await sendSms(req.user.phone, `Your laundry from ${lsp.shopName} is ready.`);
    // }
  }

  res.json(updatedBooking);
});

// @desc    Cancel a booking (by Customer)
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Customer who owns the booking)
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check if the requesting user is the customer owner of this booking
  if (req.user._id.toString() !== booking.customer.toString()) {
    res.status(403);
    throw new Error('Access denied: Not the customer owner of this booking');
  }

  if (booking.status !== 'pending') {
    res.status(400);
    throw new Error(`Cannot cancel booking with status: ${booking.status}. Only pending bookings can be cancelled by the customer.`);
  }

  booking.status = 'cancelled';
  const updatedBooking = await booking.save();

  // Emit notification to LSP
  const lsp = await LSP.findById(booking.lsp);
  const lspNotification = new Notification({
    user: lsp.owner,
    type: 'booking_cancelled', // Add this type to Notification model if needed
    title: 'Booking Cancelled',
    body: `The booking from ${req.user.username} has been cancelled.`,
    link: `/lsp/bookings/${updatedBooking._id}`,
  });
  await lspNotification.save();

  res.json(updatedBooking);
});



export { createBooking, getMyBookings, getLSPBookings, getBookingById, acceptBooking, declineBooking, completeBooking, cancelBooking };