import express from 'express';
import { diagnoseProblem } from '../controllers/aiController.js';

const router = express.Router();

// AI diagnostic is public for better user experience
router.post('/diagnose', diagnoseProblem);

export default router;
