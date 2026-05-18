import express from 'express';
import { diagnose } from '../controllers/aiController.js';

const router = express.Router();

router.post('/diagnose', diagnose);

export default router;
