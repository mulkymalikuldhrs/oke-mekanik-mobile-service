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
router.post('/auto-dispatch', verifyToken, requireCustomer, (req, res, next) => {
  console.log(`[BOOKING:${req.id}] Auto-dispatch request from ${req.userId}`);
  createAutoDispatchBooking(req, res, next);
});

// SOS Emergency booking (customers only)
router.post('/sos', verifyToken, requireCustomer, (req, res, next) => {
  console.log(`[SOS:${req.id}] SOS Emergency request from ${req.userId}`);
  createSOSBooking(req, res, next);
});

// Regular booking with selected mechanic (customers only)
router.post('/', verifyToken, requireCustomer, (req, res, next) => {
  console.log(`[BOOKING:${req.id}] Manual booking request from ${req.userId} for mechanic ${req.body?.mechanicId}`);
  createBooking(req, res, next);
});

// Get bookings (filtered by user role in controller)
router.get('/', verifyToken, getBookings);
router.get('/active', verifyToken, getActiveBookings);
router.get('/:id', verifyToken, getBookingById);

// Update booking status (mechanics/workshops only)
router.patch('/:id/status', verifyToken, requireMechanic, updateBookingStatus);

export default router;
