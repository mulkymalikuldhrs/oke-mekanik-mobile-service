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
import { verifyToken, requireCustomer, requireMechanic } from '../middleware/authMiddleware.js';

const router = express.Router();

// Auto-dispatch: system finds nearest mechanic (customers only)
router.post('/auto-dispatch', verifyToken, requireCustomer, createAutoDispatchBooking);

// SOS Emergency booking (customers only)
router.post('/sos', verifyToken, requireCustomer, createSOSBooking);

// Regular booking with selected mechanic (customers only)
router.post('/', verifyToken, requireCustomer, createBooking);

// Get bookings (filtered by user role in controller)
router.get('/', verifyToken, getBookings);
router.get('/active', verifyToken, getActiveBookings);
router.get('/:id', verifyToken, getBookingById);

// Update booking status (mechanics/workshops only)
router.patch('/:id/status', verifyToken, requireMechanic, updateBookingStatus);

export default router;
