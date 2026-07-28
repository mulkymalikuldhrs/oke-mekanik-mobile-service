import express from 'express';
import { diagnoseProblem } from '../controllers/aiController.js';

const router = express.Router();

// AI diagnostic made public to improve initial UX
router.post('/diagnose', diagnoseProblem);

export default router;
