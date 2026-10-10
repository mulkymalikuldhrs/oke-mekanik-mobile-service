import express from 'express';
import { diagnoseProblem } from '../controllers/aiController.js';

const router = express.Router();

// Publicly accessible AI diagnostic for better UX on landing page
router.post('/diagnose', diagnoseProblem);

export default router;
