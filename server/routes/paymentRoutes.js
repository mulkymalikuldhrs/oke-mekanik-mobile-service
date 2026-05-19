import express from 'express';
import { createPayment, getPaymentByBookingId } from '../controllers/paymentController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createPayment);
router.get('/', verifyToken, getPaymentByBookingId);

export default router;
