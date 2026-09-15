import asyncHandler from '../middlewares/asyncHandler.js';
import State from '../models/stateModel.js';
import Location from '../models/locationModel.js';

// @desc    Fetch all states
// @route   GET /api/locations/states
// @access  Public
const getStates = asyncHandler(async (req, res) => {
  const states = await State.find({ isActive: true }).select('_id name code');
  res.json(states);
});

// @desc    Fetch locations by state ID
// @route   GET /api/locations
// @access  Public
const getLocationsByState = asyncHandler(async (req, res) => {
  const { state } = req.query;

  if (!state) {
    res.status(400);
    throw new Error('State ID is required');
  }

  const locations = await Location.find({ state, isActive: true }).select('_id name area');
  res.json(locations);
});

// @desc    Create a state
// @route   POST /api/locations/states
// @access  Private (Admin)
const createState = asyncHandler(async (req, res) => {
  const { name, code } = req.body;

  const stateExists = await State.findOne({ name });

  if (stateExists) {
    res.status(400);
    throw new Error('State already exists');
  }

  const state = new State({
    name,
    code,
  });

  const createdState = await state.save();
  res.status(201).json(createdState);
});

// @desc    Update a state
// @route   PUT /api/locations/states/:id
// @access  Private (Admin)
const updateState = asyncHandler(async (req, res) => {
  const { name, code, isActive } = req.body;

  const state = await State.findById(req.params.id);

  if (state) {
    state.name = name || state.name;
    state.code = code || state.code;
    state.isActive = isActive ?? state.isActive;

    const updatedState = await state.save();
    res.json(updatedState);
  } else {
    res.status(404);
    throw new Error('State not found');
  }
});

// @desc    Delete a state
// @route   DELETE /api/locations/states/:id
// @access  Private (Admin)
const deleteState = asyncHandler(async (req, res) => {
  const state = await State.findById(req.params.id);

  if (state) {
    // Check if there are locations associated with this state
    const locations = await Location.find({ state: state._id });
    if (locations.length > 0) {
      res.status(400);
      throw new Error('Cannot delete state with associated locations');
    }
    await state.deleteOne();
    res.json({ message: 'State removed' });
  } else {
    res.status(404);
    throw new Error('State not found');
  }
});

// @desc    Create a location
// @route   POST /api/locations
// @access  Private (Admin)
const createLocation = asyncHandler(async (req, res) => {
  const { name, state, area } = req.body;

  const stateDoc = await State.findById(state);
  if (!stateDoc) {
    res.status(400);
    throw new Error('Invalid state ID');
  }

  // Check if location already exists for this state
  const locationExists = await Location.findOne({ state, name });

  if (locationExists) {
    res.status(400);
    throw new Error('Location already exists for this state');
  }

  const location = new Location({
    name,
    state,
    area,
  });

  const createdLocation = await location.save();
  res.status(201).json(createdLocation);
});

// @desc    Update a location
// @route   PUT /api/locations/:id
// @access  Private (Admin)
const updateLocation = asyncHandler(async (req, res) => {
  const { name, state, area, isActive } = req.body;

  const location = await Location.findById(req.params.id);

  if (location) {
    // Allow updating state if needed, but validate it exists
    if (state) {
      const stateDoc = await State.findById(state);
      if (!stateDoc) {
        res.status(400);
        throw new Error('Invalid state ID');
      }
      location.state = state;
    }
    location.name = name || location.name;
    location.area = area || location.area;
    location.isActive = isActive ?? location.isActive;

    const updatedLocation = await location.save();
    res.json(updatedLocation);
  } else {
    res.status(404);
    throw new Error('Location not found');
  }
});

// @desc    Delete a location
// @route   DELETE /api/locations/:id
// @access  Private (Admin)
const deleteLocation = asyncHandler(async (req, res) => {
  const location = await Location.findById(req.params.id);

  if (location) {
    await location.deleteOne();
    res.json({ message: 'Location removed' });
  } else {
    res.status(404);
    throw new Error('Location not found');
  }
});

export { getStates, getLocationsByState, createState, updateState, deleteState, createLocation, updateLocation, deleteLocation };