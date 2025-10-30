import asyncHandler from '../middleware/asyncHandler.js';
import Car from '../models/Car.js';

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
export const getCars = asyncHandler(async (req, res) => {
  const {
    type,
    fuelType,
    transmission,
    minPrice,
    maxPrice,
    available,
    search,
    page = 1,
    limit = 12
  } = req.query;

  // Build filter object
  let filter = {};
  
  if (type) filter.type = type;
  if (fuelType) filter.fuelType = fuelType;
  if (transmission) filter.transmission = transmission;
  if (available !== undefined) filter.available = available === 'true';
  
  // Price range filter
  if (minPrice || maxPrice) {
    filter.pricePerDay = {};
    if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
    if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
  }

  // Search filter
  if (search) {
    filter.$or = [
      { make: { $regex: search, $options: 'i' } },
      { model: { $regex: search, $options: 'i' } },
      { type: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;

  const cars = await Car.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Car.countDocuments(filter);

  res.json({
    success: true,
    count: cars.length,
    total,
    pagination: {
      page: Number(page),
      pages: Math.ceil(total / limit)
    },
    data: cars
  });
});

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
export const getCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    return res.status(404).json({
      success: false,
      message: 'Car not found'
    });
  }

  res.json({
    success: true,
    data: car
  });
});

// @desc    Create car
// @route   POST /api/cars
// @access  Private/Admin
export const createCar = asyncHandler(async (req, res) => {
  const car = await Car.create(req.body);

  res.status(201).json({
    success: true,
    data: car
  });
});

// @desc    Update car
// @route   PUT /api/cars/:id
// @access  Private/Admin
export const updateCar = asyncHandler(async (req, res) => {
  let car = await Car.findById(req.params.id);

  if (!car) {
    return res.status(404).json({
      success: false,
      message: 'Car not found'
    });
  }

  car = await Car.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json({
    success: true,
    data: car
  });
});

// @desc    Delete car
// @route   DELETE /api/cars/:id
// @access  Private/Admin
export const deleteCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    return res.status(404).json({
      success: false,
      message: 'Car not found'
    });
  }

  await Car.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Car deleted successfully'
  });
});