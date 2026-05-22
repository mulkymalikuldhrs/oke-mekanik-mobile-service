import express from 'express';
import { diagnoseProblem } from '../controllers/aiController.js';

const router = express.Router();

router.post('/diagnose', diagnoseProblem);

export default router;
