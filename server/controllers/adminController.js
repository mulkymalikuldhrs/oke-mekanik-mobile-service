import db from '../db.js';

export const getStats = (req, res) => {
  try {
    const totalUsers = db.prepare('SELECT count(*) as count FROM users').get().count;
    const totalMechanics = db.prepare('SELECT count(*) as count FROM mechanics').get().count;
    const onlineMechanics = db.prepare('SELECT count(*) as count FROM mechanics WHERE is_online = 1').get().count;
    const totalBookings = db.prepare('SELECT count(*) as count FROM bookings').get().count;
    const activeBookings = db.prepare("SELECT count(*) as count FROM bookings WHERE status NOT IN ('completed', 'cancelled')").get().count;
    const completedBookings = db.prepare("SELECT count(*) as count FROM bookings WHERE status = 'completed'").get().count;
    const totalRevenue = db.prepare('SELECT COALESCE(SUM(estimated_cost), 0) as total FROM bookings WHERE status = \'completed\'').get().total;
    const avgRating = db.prepare('SELECT COALESCE(AVG(rating), 0) as avg FROM reviews').get().avg;
    const totalReviews = db.prepare('SELECT count(*) as count FROM reviews').get().count;
    const totalPayments = db.prepare('SELECT count(*) as count FROM payments').get().count;
    const totalMessages = db.prepare('SELECT count(*) as count FROM messages').get().count;

    const bookingsByStatus = db.prepare('SELECT status, count(*) as count FROM bookings GROUP BY status').all();
    const servicePopularity = db.prepare(`
      SELECT s.name, COUNT(b.id) as bookings, COALESCE(SUM(b.estimated_cost), 0) as revenue
      FROM services s LEFT JOIN bookings b ON s.id = b.service_id
      GROUP BY s.id ORDER BY bookings DESC
    `).all();

    res.json({
      totalUsers, totalMechanics, onlineMechanics,
      totalBookings, activeBookings, completedBookings,
      totalRevenue, avgRating: Math.round(avgRating * 10) / 10,
      totalReviews, totalPayments, totalMessages,
      bookingsByStatus, servicePopularity,
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal memuat statistik', error: err.message });
  }
};

export const getAllUsers = (req, res) => {
  try {
    const users = db.prepare('SELECT id, name, email, role, phone FROM users').all();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Gagal memuat data user' });
  }
};

export const toggleMechanicStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { isOnline } = req.body;
    db.prepare('UPDATE mechanics SET is_online = ? WHERE id = ?').run(isOnline ? 1 : 0, id);
    res.json({ success: true, id, isOnline });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengubah status mekanik' });
  }
};
