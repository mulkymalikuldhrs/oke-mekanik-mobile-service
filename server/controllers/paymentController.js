import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';

export const createPayment = (req, res) => {
    const { bookingId, amount, paymentMethod } = req.body;
    const booking = db.prepare('SELECT user_id FROM bookings WHERE id = ?').get(bookingId);
    if (!booking || booking.user_id !== req.userId) { return res.status(403).json({ message: 'Akses ditolak' }); }

    const id = `PAY-${uuidv4().slice(0, 8)}`;
    // Payment always starts as 'pending' - status is never client-controlled
    db.prepare('INSERT INTO payments (id, booking_id, amount, payment_method, status) VALUES (?, ?, ?, ?, ?)')
      .run(id, bookingId, amount, paymentMethod, 'pending');
    res.json({ id, status: 'pending' });
};

export const getPaymentByBookingId = (req, res) => {
    const { bookingId } = req.query;
    const payment = db.prepare('SELECT * FROM payments WHERE booking_id = ?').get(bookingId);
    if (payment) {
        res.json({ id: payment.id, amount: payment.amount, status: payment.status, paymentMethod: payment.payment_method });
    } else { res.status(404).json({ message: 'Pembayaran tidak ditemukan' }); }
};
