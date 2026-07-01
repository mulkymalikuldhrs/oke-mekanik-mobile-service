import express from 'express';
import { diagnoseProblem } from '../controllers/aiController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// AI diagnostic requires authentication to prevent abuse
// Maintain v7.0.1 implementation while restoring security
router.post('/diagnose', verifyToken, diagnoseProblem);

export default router;
