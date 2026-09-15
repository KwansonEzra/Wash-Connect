import express from 'express';
import { getStates, getLocationsByState, createState, updateState, deleteState, createLocation, updateLocation, deleteLocation } from '../controllers/locationController.js';
import { protect } from '../middlewares/authMiddleware.js';
import authorizeRole from '../middlewares/authorizeRole.js';
import checkId from '../middlewares/checkId.js';

const router = express.Router();

// Public routes
router.get('/states', getStates);
router.get('/', getLocationsByState); // Uses query param 'state'

// Admin routes for CRUD
router.route('/states')
  .post(protect, authorizeRole('admin'), createState);

router.route('/states/:id')
  .put(protect, authorizeRole('admin'), checkId, updateState)
  .delete(protect, authorizeRole('admin'), checkId, deleteState);

router.route('/')
  .post(protect, authorizeRole('admin'), createLocation);

router.route('/:id')
  .put(protect, authorizeRole('admin'), checkId, updateLocation)
  .delete(protect, authorizeRole('admin'), checkId, deleteLocation);

export default router;