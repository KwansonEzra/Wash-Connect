import asyncHandler from '../middlewares/asyncHandler.js';
import ServiceCategory from '../models/serviceCategoryModel.js';

// @desc    Fetch all service categories
// @route   GET /api/service-catalog
// @access  Public
const getServiceCategories = asyncHandler(async (req, res) => {
  const categories = await ServiceCategory.find({});
  res.json(categories);
});

// @desc    Fetch a single service category
// @route   GET /api/service-catalog/:id
// @access  Public
const getServiceCategoryById = asyncHandler(async (req, res) => {
  const category = await ServiceCategory.findById(req.params.id);

  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error('Service category not found');
  }
});

// @desc    Create a service category
// @route   POST /api/service-catalog
// @access  Private (Admin)
const createServiceCategory = asyncHandler(async (req, res) => {
  const { name, items, allowsCustomItem } = req.body;

  const categoryExists = await ServiceCategory.findOne({ name });

  if (categoryExists) {
    res.status(400);
    throw new Error('Service category already exists');
  }

  const category = new ServiceCategory({
    name,
    items,
    allowsCustomItem,
  });

  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
});

// @desc    Update a service category
// @route   PUT /api/service-catalog/:id
// @access  Private (Admin)
const updateServiceCategory = asyncHandler(async (req, res) => {
  const { name, items, allowsCustomItem } = req.body;

  const category = await ServiceCategory.findById(req.params.id);

  if (category) {
    category.name = name || category.name;
    category.items = items || category.items;
    category.allowsCustomItem = allowsCustomItem ?? category.allowsCustomItem;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error('Service category not found');
  }
});

// @desc    Delete a service category
// @route   DELETE /api/service-catalog/:id
// @access  Private (Admin)
const deleteServiceCategory = asyncHandler(async (req, res) => {
  const category = await ServiceCategory.findById(req.params.id);

  if (category) {
    await category.deleteOne();
    res.json({ message: 'Service category removed' });
  } else {
    res.status(404);
    throw new Error('Service category not found');
  }
});

export { getServiceCategories, getServiceCategoryById, createServiceCategory, updateServiceCategory, deleteServiceCategory };