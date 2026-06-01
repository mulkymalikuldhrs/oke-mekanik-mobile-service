import express from 'express';
import { diagnoseProblem } from '../controllers/aiController.js';

const router = express.Router();

router.post('/diagnose', (req, res, next) => {
  console.log(`[TRACE:${req.id}] AI Diagnosis requested: ${req.body.problem?.substring(0, 50)}...`);
  diagnoseProblem(req, res, next);
});

export default router;
