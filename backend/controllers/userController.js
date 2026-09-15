import asyncHandler from '../middlewares/asyncHandler.js';
import User from '../models/userModel.js';
import generateToken from '../utils/createToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      phone: user.phone,
      // Omit sensitive fields like password
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Public registration must never grant 'admin' - that would let anyone
  // self-promote to admin simply by adding role: 'admin' to the request
  // body. Admin accounts are created separately (see seed script/README).
  const validPublicRoles = ['customer', 'lsp'];
  const userRole = validPublicRoles.includes(role) ? role : 'customer';

  const user = await User.create({
    username,
    email,
    password,
    role: userRole,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      // Omit sensitive fields like password
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      phone: user.phone,
      defaultStateId: user.defaultStateId,
      defaultLocationId: user.defaultLocationId,
      notifyByEmail: user.notifyByEmail,
      notifyBySms: user.notifyBySms,
      // isAdmin: user.computedIsAdmin, // Use virtual
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.defaultStateId = req.body.defaultStateId || user.defaultStateId;
    user.defaultLocationId = req.body.defaultLocationId || user.defaultLocationId;
    user.notifyByEmail = req.body.notifyByEmail ?? user.notifyByEmail; // Use nullish coalescing for booleans
    user.notifyBySms = req.body.notifyBySms ?? user.notifyBySms;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      defaultStateId: updatedUser.defaultStateId,
      defaultLocationId: updatedUser.defaultLocationId,
      notifyByEmail: updatedUser.notifyByEmail,
      notifyBySms: updatedUser.notifyBySms,
      // isAdmin: updatedUser.computedIsAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile };