import express from 'express';
import {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar
} from '../controllers/carController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getCars)
  .post(protect, authorize('admin'), createCar);

router.route('/:id')
  .get(getCar)
  .put(protect, authorize('admin'), updateCar)
  .delete(protect, authorize('admin'), deleteCar);

export default router;