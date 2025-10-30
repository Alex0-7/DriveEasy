import asyncHandler from '../middleware/asyncHandler.js';
import Booking from '../models/Booking.js';
import Car from '../models/Car.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {
  const {
    car: carId,
    startDate,
    endDate,
    pickupLocation,
    dropoffLocation,
    specialRequests
  } = req.body;

  // Check if car exists and is available
  const car = await Car.findById(carId);
  if (!car) {
    return res.status(404).json({
      success: false,
      message: 'Car not found'
    });
  }

  if (!car.available) {
    return res.status(400).json({
      success: false,
      message: 'Car is not available for booking'
    });
  }

  // Check for existing bookings that overlap
  const existingBooking = await Booking.findOne({
    car: carId,
    status: { $in: ['confirmed', 'active'] },
    $or: [
      {
        startDate: { $lte: new Date(endDate) },
        endDate: { $gte: new Date(startDate) }
      }
    ]
  });

  if (existingBooking) {
    return res.status(400).json({
      success: false,
      message: 'Car is already booked for the selected dates'
    });
  }

  // Calculate total amount
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const totalAmount = totalDays * car.pricePerDay;

  const booking = await Booking.create({
    user: req.user._id,
    car: carId,
    startDate: start,
    endDate: end,
    totalDays,
    totalAmount,
    pickupLocation,
    dropoffLocation,
    specialRequests
  });

  // Populate the booking with car details
  await booking.populate('car');

  res.status(201).json({
    success: true,
    data: booking
  });
});

// @desc    Get all bookings for user
// @route   GET /api/bookings/mybookings
// @access  Private
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('car')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate('car')
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('car')
    .populate('user', 'name email phone');

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  // Make sure user owns the booking or is admin
  if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this booking'
    });
  }

  res.json({
    success: true,
    data: booking
  });
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  // Make sure user owns the booking
  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to cancel this booking'
    });
  }

  // Check if booking can be cancelled
  if (booking.status === 'cancelled') {
    return res.status(400).json({
      success: false,
      message: 'Booking is already cancelled'
    });
  }

  if (booking.status === 'completed') {
    return res.status(400).json({
      success: false,
      message: 'Completed bookings cannot be cancelled'
    });
  }

  booking.status = 'cancelled';
  await booking.save();

  res.json({
    success: true,
    message: 'Booking cancelled successfully',
    data: booking
  });
});

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
export const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  await Booking.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Booking deleted successfully'
  });
});