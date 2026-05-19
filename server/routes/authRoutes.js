import express from 'express';
import { login, register, me, refresh, logout } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', verifyToken, me);
router.post('/refresh', verifyToken, refresh);
router.post('/logout', logout);

export default router;
