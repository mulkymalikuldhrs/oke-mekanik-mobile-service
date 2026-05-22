import express from 'express';
import {
  createBooking,
  getBookings,
  getActiveBookings,
  getBookingById,
  updateBookingStatus
} from '../controllers/bookingController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createBooking);
router.get('/', verifyToken, getBookings);
router.get('/active', verifyToken, getActiveBookings);
router.get('/:id', verifyToken, getBookingById);
router.patch('/:id/status', verifyToken, updateBookingStatus);

export default router;
