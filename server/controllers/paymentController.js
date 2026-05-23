import db from '../db.js';

export const createPayment = (req, res) => {
    const { bookingId, amount, paymentMethod, status } = req.body;
    const booking = db.prepare('SELECT user_id FROM bookings WHERE id = ?').get(bookingId);
    if (!booking || booking.user_id !== req.userId) { return res.status(403).json({ message: 'Akses ditolak' }); }

    const id = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;
    db.prepare('INSERT INTO payments (id, booking_id, amount, payment_method, status) VALUES (?, ?, ?, ?, ?)')
      .run(id, bookingId, amount, paymentMethod, status);
    res.json({ id, status });
};

export const getPaymentByBookingId = (req, res) => {
    const { bookingId } = req.query;
    const payment = db.prepare('SELECT * FROM payments WHERE booking_id = ?').get(bookingId);
    if (payment) {
        res.json({ id: payment.id, amount: payment.amount, status: payment.status, paymentMethod: payment.payment_method });
    } else { res.status(404).json({ message: 'Pembayaran tidak ditemukan' }); }
};
