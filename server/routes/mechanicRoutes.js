import express from 'express';
import {
  getAllMechanics,
  getNearbyMechanics,
  autoDispatch,
  getMechanicById,
  registerMechanic,
  updateMechanicStatus,
  updateMechanicLocation,
  getPendingBookings
} from '../controllers/mechanicController.js';
import { verifyToken, requireMechanic } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public endpoints (for customer browsing)
router.get('/', getAllMechanics);
router.get('/nearby', getNearbyMechanics);
router.post('/auto-dispatch', autoDispatch);
router.get('/:id', getMechanicById);

// Mechanic/Workshop-only endpoints
router.get('/pending-bookings', verifyToken, requireMechanic, getPendingBookings);
router.post('/register', verifyToken, registerMechanic);
router.patch('/:id/status', verifyToken, requireMechanic, updateMechanicStatus);
router.patch('/:id/location', verifyToken, requireMechanic, updateMechanicLocation);

export default router;
