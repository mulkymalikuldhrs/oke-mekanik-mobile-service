import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';

export const getReviews = (req, res) => {
  const { mechanicId } = req.query;
  const reviews = mechanicId
    ? db.prepare('SELECT * FROM reviews WHERE mechanic_id = ? ORDER BY created_at DESC').all(mechanicId)
    : db.prepare('SELECT * FROM reviews ORDER BY created_at DESC').all();
  res.json(reviews.map(r => ({ id: r.id, bookingId: r.booking_id, userId: r.user_id, mechanicId: r.mechanic_id, rating: r.rating, comment: r.comment, createdAt: r.created_at })));
};

export const createReview = (req, res) => {
  const { bookingId, mechanicId, rating, comment } = req.body;
  const id = uuidv4();
  const booking = db.prepare('SELECT user_id FROM bookings WHERE id = ?').get(bookingId);
  if (!booking || booking.user_id !== req.userId) { return res.status(403).json({ message: 'Akses ditolak' }); }

  try {
    db.prepare('INSERT INTO reviews (id, booking_id, user_id, mechanic_id, rating, comment) VALUES (?, ?, ?, ?, ?, ?)')
      .run(id, bookingId, req.userId, mechanicId, rating, comment);
    const stats = db.prepare('SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE mechanic_id = ?').get(mechanicId);
    db.prepare('UPDATE mechanics SET rating = ? WHERE id = ?').run(stats.avg, mechanicId);
    res.json(db.prepare('SELECT * FROM reviews WHERE id = ?').get(id));
  } catch (error) { res.status(400).json({ message: 'Gagal menambahkan ulasan' }); }
};
