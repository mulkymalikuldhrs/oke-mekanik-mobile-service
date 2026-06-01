import express from 'express';
import { login, register, me, refresh, logout } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', (req, res, next) => {
  console.log(`[TRACE:${req.id}] Login attempt: ${req.body.email}`);
  login(req, res, next);
});
router.post('/register', (req, res, next) => {
  console.log(`[TRACE:${req.id}] Register attempt: ${req.body.email} as ${req.body.role}`);
  register(req, res, next);
});
router.get('/me', verifyToken, me);
router.post('/refresh', verifyToken, refresh);
router.post('/logout', logout);

export default router;
