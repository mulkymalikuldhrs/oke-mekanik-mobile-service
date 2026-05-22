import express from 'express';
import { getUserById, updateUserProfile } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:id', verifyToken, getUserById);
router.put('/:id', verifyToken, updateUserProfile);

export default router;
