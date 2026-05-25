import express from 'express';
import {
  createBooking,
  createAutoDispatchBooking,
  createSOSBooking,
  getBookings,
  getActiveBookings,
  getBookingById,
  updateBookingStatus
} from '../controllers/bookingController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Auto-dispatch: system finds nearest mechanic
router.post('/auto-dispatch', verifyToken, createAutoDispatchBooking);

// SOS Emergency booking
router.post('/sos', verifyToken, createSOSBooking);

// Regular booking with selected mechanic
router.post('/', verifyToken, createBooking);

router.get('/', verifyToken, getBookings);
router.get('/active', verifyToken, getActiveBookings);
router.get('/:id', verifyToken, getBookingById);
router.patch('/:id/status', verifyToken, updateBookingStatus);

export default router;
