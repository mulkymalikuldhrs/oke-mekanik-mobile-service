import express from 'express';
import { login, register, getMe, refreshToken, logout } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', verifyToken, getMe);
router.post('/refresh', verifyToken, refreshToken);
router.post('/logout', logout);

export default router;
