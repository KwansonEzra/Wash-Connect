import asyncHandler from '../middlewares/asyncHandler.js';
import LSP from '../models/lspModel.js';
import User from '../models/userModel.js';
import State from '../models/stateModel.js';
import Location from '../models/locationModel.js';

// @desc    Search LSPs by state and location
// @route   GET /api/lsps
// @access  Public
const getLSPs = asyncHandler(async (req, res) => {
  const { state, location, service, openNow } = req.query; // Query parameters

  let filter = { isActive: true, isVerified: true }; // Always filter active and verified

  if (state) {
    filter.state = state;
  }
  if (location) {
    filter.location = location;
  }
  if (service) {
    // Assuming service is an ObjectId referencing ServiceCategory
    filter.servicesOffered = service;
  }

  // If openNow is true, apply time-based filtering (simplified example)
  if (openNow === 'true') {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ...
    const currentTime = now.toTimeString().substring(0, 5); // HH:MM

    // Note: This filtering logic is complex and ideally handled in the database query or a separate aggregation pipeline.
    // For MVP, we'll fetch and filter in memory, but this isn't scalable.
    // A more robust solution would involve a MongoDB aggregation with date operators.
    // Here, we just fetch matching records assuming the state/location filter is applied first.
    // The actual time check would happen during the LSP detail view or booking creation.
    // For now, we'll just apply the basic state/location filter and let the client handle 'open now' visually or via a separate call if needed.
    // We'll focus on the basic filter here.
  }

  const lsps = await LSP.find(filter)
    .populate('owner', 'username email') // Populate relevant user info
    .populate('state', 'name') // Populate state name
    .populate('location', 'name') // Populate location name
    .populate('servicesOffered', 'name'); // Populate service category names

  res.json(lsps);
});

// @desc    Get LSP by ID
// @route   GET /api/lsps/:id
// @access  Public
const getLSPById = asyncHandler(async (req, res) => {
  const lsp = await LSP.findById(req.params.id)
    .populate('owner', 'username email')
    .populate('state', 'name')
    .populate('location', 'name')
    .populate('servicesOffered', 'name items allowsCustomItem')
    .populate({
      path: 'pricing.category',
      select: 'name items allowsCustomItem'
    });

  if (lsp) {
    res.json(lsp);
  } else {
    res.status(404);
    throw new Error('LSP not found');
  }
});

// @desc    Create LSP profile (for LSP user)
// @route   POST /api/lsps
// @access  Private (LSP)
const createLSP = asyncHandler(async (req, res) => {
  const { shopName, bio, idDocumentUrl, state, location, addressLine, servicesOffered, pricing, hours, acceptsCustomOrders, turnaroundHours, offersDelivery } = req.body;

  // Ensure user is LSP
  if (req.user.role !== 'lsp') {
    res.status(403);
    throw new Error('Forbidden: Only LSPs can create an LSP profile');
  }

  // Validate state and location exist
  const stateDoc = await State.findById(state);
  const locationDoc = await Location.findById(location);
  if (!stateDoc || !locationDoc) {
    res.status(400);
    throw new Error('Invalid state or location ID');
  }

  // Check if LSP profile already exists for this user
  const existingLSP = await LSP.findOne({ owner: req.user._id });
  if (existingLSP) {
    res.status(400);
    throw new Error('An LSP profile already exists for this user');
  }

  const lsp = new LSP({
    owner: req.user._id,
    shopName,
    bio,
    idDocumentUrl, // URL from multer upload
    state,
    location,
    addressLine,
    servicesOffered,
    pricing,
    hours,
    acceptsCustomOrders,
    turnaroundHours,
    offersDelivery,
    isActive: true, // Default to active when created
    isVerified: false, // Default to unverified, requires admin approval
  });

  const createdLSP = await lsp.save();
  res.status(201).json(createdLSP);
});

// @desc    Get the logged-in LSP user's own LSP profile
// @route   GET /api/lsps/mine
// @access  Private (LSP)
const getMyLSP = asyncHandler(async (req, res) => {
  const lsp = await LSP.findOne({ owner: req.user._id })
    .populate('state', 'name')
    .populate('location', 'name')
    .populate('servicesOffered', 'name items allowsCustomItem')
    .populate({
      path: 'pricing.category',
      select: 'name items allowsCustomItem',
    });

  if (lsp) {
    res.json(lsp);
  } else {
    res.status(404);
    throw new Error('LSP profile not found');
  }
});

// @desc    Update LSP profile (for LSP user)
// @route   PUT /api/lsps/mine
// @access  Private (LSP)
const updateLSP = asyncHandler(async (req, res) => {
  const { shopName, bio, logo, photos, state, location, addressLine, servicesOffered, pricing, hours, acceptsCustomOrders, turnaroundHours, offersDelivery } = req.body;

  // Ensure user is LSP
  if (req.user.role !== 'lsp') {
    res.status(403);
    throw new Error('Forbidden: Only LSPs can update an LSP profile');
  }

  const lsp = await LSP.findOne({ owner: req.user._id });

  if (lsp) {
    lsp.shopName = shopName || lsp.shopName;
    lsp.bio = bio || lsp.bio;
    lsp.logo = logo || lsp.logo;
    lsp.photos = photos || lsp.photos;
    lsp.state = state || lsp.state;
    lsp.location = location || lsp.location;
    lsp.addressLine = addressLine || lsp.addressLine;
    lsp.servicesOffered = servicesOffered || lsp.servicesOffered;
    lsp.pricing = pricing || lsp.pricing;
    lsp.hours = hours || lsp.hours;
    lsp.acceptsCustomOrders = acceptsCustomOrders ?? lsp.acceptsCustomOrders;
    lsp.turnaroundHours = turnaroundHours || lsp.turnaroundHours;
    lsp.offersDelivery = offersDelivery ?? lsp.offersDelivery;

    const updatedLSP = await lsp.save();
    res.json(updatedLSP);
  } else {
    res.status(404);
    throw new Error('LSP profile not found');
  }
});

// @desc    Update LSP pricing (for LSP user)
// @route   PUT /api/lsps/mine/pricing
// @access  Private (LSP)
const updateLSPPricing = asyncHandler(async (req, res) => {
  const { pricing } = req.body;

  // Ensure user is LSP
  if (req.user.role !== 'lsp') {
    res.status(403);
    throw new Error('Forbidden: Only LSPs can update pricing');
  }

  const lsp = await LSP.findOne({ owner: req.user._id });

  if (lsp) {
    lsp.pricing = pricing;
    const updatedLSP = await lsp.save();
    res.json(updatedLSP);
  } else {
    res.status(404);
    throw new Error('LSP profile not found');
  }
});

// @desc    Update LSP availability (for LSP user)
// @route   PUT /api/lsps/mine/availability
// @access  Private (LSP)
const updateLSPAvailability = asyncHandler(async (req, res) => {
  const { hours, acceptsCustomOrders } = req.body;

  // Ensure user is LSP
  if (req.user.role !== 'lsp') {
    res.status(403);
    throw new Error('Forbidden: Only LSPs can update availability');
  }

  const lsp = await LSP.findOne({ owner: req.user._id });

  if (lsp) {
    lsp.hours = hours || lsp.hours;
    lsp.acceptsCustomOrders = acceptsCustomOrders ?? lsp.acceptsCustomOrders;
    const updatedLSP = await lsp.save();
    res.json(updatedLSP);
  } else {
    res.status(404);
    throw new Error('LSP profile not found');
  }
});

// @desc    Verify LSP (for Admin)
// @route   PUT /api/lsps/:id/verify
// @access  Private (Admin)
const verifyLSP = asyncHandler(async (req, res) => {
  const { verified, reason } = req.body; // Assuming payload contains verification decision and optional reason

  const lsp = await LSP.findById(req.params.id);

  if (lsp) {
    lsp.isVerified = verified;
    // Optionally, if rejected, we could store the reason in a field or a separate log
    // For now, we'll just update the verification status.
    const updatedLSP = await lsp.save();
    res.json(updatedLSP);
  } else {
    res.status(404);
    throw new Error('LSP not found');
  }
});


export { getLSPs, getLSPById, createLSP, getMyLSP, updateLSP, updateLSPPricing, updateLSPAvailability, verifyLSP };