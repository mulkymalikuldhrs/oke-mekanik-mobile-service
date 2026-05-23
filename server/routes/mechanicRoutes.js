import express from 'express';
import {
  getAllMechanics,
  getNearbyMechanics,
  getMechanicById,
  registerMechanic,
  updateMechanicStatus,
  updateMechanicLocation
} from '../controllers/mechanicController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllMechanics);
router.get('/nearby', getNearbyMechanics);
router.get('/:id', getMechanicById);
router.post('/register', verifyToken, registerMechanic);
router.patch('/:id/status', verifyToken, updateMechanicStatus);
router.patch('/:id/location', verifyToken, updateMechanicLocation);

export default router;
