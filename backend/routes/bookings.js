import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookings,
  getBooking,
  cancelBooking,
  deleteBooking
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createBooking)
  .get(authorize('admin'), getBookings);

router.get('/mybookings', getMyBookings);
router.route('/:id')
  .get(getBooking)
  .delete(authorize('admin'), deleteBooking);

router.put('/:id/cancel', cancelBooking);

export default router;