import express from 'express';
import { login, register, me, refresh, logout } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', (req, res, next) => {
  console.log(`[AUTH:${req.id}] Login attempt for ${req.body?.email}`);
  login(req, res, next);
});
router.post('/register', (req, res, next) => {
  console.log(`[AUTH:${req.id}] Registration attempt for ${req.body?.email}`);
  register(req, res, next);
});
router.get('/me', verifyToken, me);
router.post('/refresh', verifyToken, refresh);
router.post('/logout', logout);

export default router;
