import express from 'express';
import { diagnoseProblem } from '../controllers/aiController.js';

const router = express.Router();

router.post('/diagnose', (req, res, next) => {
  console.log(`[AI:${req.id}] Diagnostic request received`);
  diagnoseProblem(req, res, next);
});

export default router;
