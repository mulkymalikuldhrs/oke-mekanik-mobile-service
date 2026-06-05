import express from 'express';
import { diagnoseProblem } from '../controllers/aiController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// AI diagnostic requires authentication to prevent abuse
router.post('/diagnose', verifyToken, diagnoseProblem);

export default router;
