import express from 'express';
import { getServiceCategories, getServiceCategoryById, createServiceCategory, updateServiceCategory, deleteServiceCategory } from '../controllers/serviceCatalogController.js';
import { protect } from '../middlewares/authMiddleware.js';
import authorizeRole from '../middlewares/authorizeRole.js';
import checkId from '../middlewares/checkId.js';

const router = express.Router();

router.route('/')
  .get(getServiceCategories)
  .post(protect, authorizeRole('admin'), createServiceCategory);

router.route('/:id')
  .get(checkId, getServiceCategoryById)
  .put(protect, authorizeRole('admin'), checkId, updateServiceCategory)
  .delete(protect, authorizeRole('admin'), checkId, deleteServiceCategory);

export default router;