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
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllMechanics);
router.get('/nearby', getNearbyMechanics);
router.post('/auto-dispatch', autoDispatch);
router.get('/pending-bookings', verifyToken, getPendingBookings);
router.get('/:id', getMechanicById);
router.post('/register', verifyToken, registerMechanic);
router.patch('/:id/status', verifyToken, updateMechanicStatus);
router.patch('/:id/location', verifyToken, updateMechanicLocation);

export default router;
