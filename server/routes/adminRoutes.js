import { Router } from 'express';
import { getStats, getAllUsers, toggleMechanicStatus } from '../controllers/adminController.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/stats', authenticate, requireAdmin, getStats);
router.get('/users', authenticate, requireAdmin, getAllUsers);
router.patch('/mechanics/:id/status', authenticate, requireAdmin, toggleMechanicStatus);

export default router;
