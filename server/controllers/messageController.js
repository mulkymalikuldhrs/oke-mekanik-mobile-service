import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';

export const getMessagesByBookingId = (req, res) => {
  const { bookingId } = req.query;
  const messages = db.prepare('SELECT * FROM messages WHERE booking_id = ? ORDER BY created_at ASC').all(bookingId);
  res.json(messages.map(m => ({ id: m.id, bookingId: m.booking_id, senderId: m.sender_id, text: m.text, createdAt: m.created_at })));
};

export const sendMessage = (req, res) => {
  const { bookingId, text } = req.body;
  const id = uuidv4();

  const booking = db.prepare('SELECT user_id, mechanic_id FROM bookings WHERE id = ?').get(bookingId);
  const mechanic = db.prepare('SELECT id FROM mechanics WHERE user_id = ?').get(req.userId);

  if (!booking || (booking.user_id !== req.userId && (!mechanic || booking.mechanic_id !== mechanic.id))) {
    return res.status(403).json({ message: 'Akses ditolak' });
  }

  db.prepare('INSERT INTO messages (id, booking_id, sender_id, text) VALUES (?, ?, ?, ?)').run(id, bookingId, req.userId, text);
  const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(id);
  const response = { id: message.id, bookingId: message.booking_id, senderId: message.sender_id, text: message.text, createdAt: message.created_at };
  if (req.io) {
    req.io.to(bookingId).emit('new_message', response);
  }
  res.json(response);
};
