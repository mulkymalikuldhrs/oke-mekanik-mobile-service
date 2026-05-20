import express from 'express';
import { getMessagesByBookingId, sendMessage } from '../controllers/messageController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getMessagesByBookingId);
router.post('/', verifyToken, sendMessage);

export default router;
