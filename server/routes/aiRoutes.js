import express from 'express';
import { diagnoseProblem } from '../controllers/aiController.js';

const router = express.Router();

// AI diagnostic is public in v7.0.1 for better initial UX
router.post('/diagnose', diagnoseProblem);

export default router;
