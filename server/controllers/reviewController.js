import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';

const createReviewSchema = z.object({
  bookingId: z.string().min(1),
  mechanicId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500, 'Komentar terlalu panjang (maks 500 karakter)').optional(),
});

export const getReviews = (req, res) => {
  const { mechanicId } = req.query;
  const reviews = mechanicId
    ? db.prepare('SELECT * FROM reviews WHERE mechanic_id = ? ORDER BY created_at DESC').all(mechanicId)
    : db.prepare('SELECT * FROM reviews ORDER BY created_at DESC').all();
  res.json(reviews.map(r => ({ id: r.id, bookingId: r.booking_id, userId: r.user_id, mechanicId: r.mechanic_id, rating: r.rating, comment: r.comment, createdAt: r.created_at })));
};

export const createReview = (req, res) => {
  try {
    const { bookingId, mechanicId, rating, comment } = createReviewSchema.parse(req.body);
    const id = uuidv4();
    const booking = db.prepare('SELECT user_id FROM bookings WHERE id = ?').get(bookingId);
    if (!booking || booking.user_id !== req.userId) { return res.status(403).json({ message: 'Akses ditolak' }); }

    // Prevent duplicate reviews for the same booking
    const existingReview = db.prepare('SELECT id FROM reviews WHERE booking_id = ?').get(bookingId);
    if (existingReview) {
      return res.status(400).json({ message: 'Anda sudah memberikan ulasan untuk booking ini' });
    }

    // Verify booking is completed before allowing review
    const bookingStatus = db.prepare('SELECT status FROM bookings WHERE id = ?').get(bookingId);
    if (bookingStatus?.status !== 'completed') {
      return res.status(400).json({ message: 'Hanya booking yang sudah selesai dapat diulas' });
    }

    db.prepare('INSERT INTO reviews (id, booking_id, user_id, mechanic_id, rating, comment) VALUES (?, ?, ?, ?, ?, ?)')
      .run(id, bookingId, req.userId, mechanicId, rating, comment || null);
    const stats = db.prepare('SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE mechanic_id = ?').get(mechanicId);
    db.prepare('UPDATE mechanics SET rating = ? WHERE id = ?').run(stats.avg, mechanicId);
    res.json(db.prepare('SELECT * FROM reviews WHERE id = ?').get(id));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validasi gagal', errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })) });
    }
    res.status(400).json({ message: 'Gagal menambahkan ulasan' });
  }
};
