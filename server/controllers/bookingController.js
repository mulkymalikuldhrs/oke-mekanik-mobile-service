import { z } from 'zod';
import db from '../db.js';

const bookingSchema = z.object({
  mechanicId: z.string(),
  serviceId: z.string(),
  vehicle: z.object({
    brand: z.string(),
    model: z.string(),
    year: z.string(),
    licensePlate: z.string()
  }),
  problem: z.string().min(5),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string()
  }),
  isEmergency: z.boolean().optional()
});

function formatBooking(b) {
  const mechanic = db.prepare('SELECT lat, lng FROM mechanics WHERE id = ?').get(b.mechanic_id);
  return {
    id: b.id, userId: b.user_id, mechanicId: b.mechanic_id, serviceId: b.service_id,
    vehicle: { brand: b.vehicle_brand, model: b.vehicle_model, year: b.vehicle_year, licensePlate: b.vehicle_license_plate },
    problem: b.problem, status: b.status,
    location: { lat: b.location_lat, lng: b.location_lng, address: b.location_address },
    mechanicLocation: mechanic ? { lat: mechanic.lat, lng: mechanic.lng } : null,
    estimatedCost: b.estimated_cost, createdAt: b.created_at
  };
}

export const createBooking = (req, res, next) => {
  try {
    const { mechanicId, serviceId, vehicle, problem, location, isEmergency } = bookingSchema.parse(req.body);
    const id = `BOOK-${Math.floor(1000 + Math.random() * 9000)}`;

    const service = db.prepare('SELECT base_price FROM services WHERE id = ?').get(serviceId);
    const estimatedCost = (service?.base_price || 50000) + (isEmergency ? 50000 : 0);

    db.prepare(`
      INSERT INTO bookings (
        id, user_id, mechanic_id, service_id, vehicle_brand, vehicle_model,
        vehicle_year, vehicle_license_plate, problem, status,
        location_lat, location_lng, location_address, estimated_cost
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, req.userId, mechanicId, serviceId, vehicle.brand, vehicle.model,
      vehicle.year, vehicle.licensePlate, problem, 'pending',
      location.lat, location.lng, location.address, estimatedCost
    );

    res.json(formatBooking(db.prepare('SELECT * FROM bookings WHERE id = ?').get(id)));
  } catch (err) { next(err); }
};

export const getBookings = (req, res) => {
  const { userId, mechanicId } = req.query;
  let bookings;

  if (userId) {
    if (req.userId !== userId && req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Akses ditolak' });
    }
    bookings = db.prepare('SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC').all(userId);
  } else if (mechanicId) {
    const mech = db.prepare('SELECT id, user_id FROM mechanics WHERE id = ? OR user_id = ?').get(mechanicId, mechanicId);
    if (!mech || (mech.user_id !== req.userId && req.userRole !== 'admin')) {
        return res.status(403).json({ message: 'Akses ditolak' });
    }
    bookings = db.prepare('SELECT * FROM bookings WHERE mechanic_id = ? ORDER BY created_at DESC').all(mech.id);
  } else {
    if (req.userRole === 'customer') {
      bookings = db.prepare('SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC').all(req.userId);
    } else if (req.userRole === 'mechanic') {
      const mech = db.prepare('SELECT id FROM mechanics WHERE user_id = ?').get(req.userId);
      bookings = mech ? db.prepare('SELECT * FROM bookings WHERE mechanic_id = ? ORDER BY created_at DESC').all(mech.id) : [];
    } else if (req.userRole === 'admin') {
      bookings = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
    } else {
      return res.status(403).json({ message: 'Akses ditolak' });
    }
  }
  res.json(bookings.map(formatBooking));
};

export const getActiveBookings = (req, res) => {
    const bookings = db.prepare("SELECT * FROM bookings WHERE status NOT IN ('completed', 'cancelled')").all();
    res.json(bookings.map(formatBooking));
};

export const getBookingById = (req, res) => {
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  if (!booking) {
    return res.status(404).json({ message: 'Booking tidak ditemukan' });
  }

  const mechanic = db.prepare('SELECT id FROM mechanics WHERE user_id = ?').get(req.userId);
  const isOwner = booking.user_id === req.userId;
  const isAssignedMechanic = mechanic && booking.mechanic_id === mechanic.id;

  if (!isOwner && !isAssignedMechanic && req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak' });
  }

  res.json(formatBooking(booking));
};

export const updateBookingStatus = (req, res) => {
  const { status } = req.body;
  const bookingOrig = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);

  if (!bookingOrig) { return res.status(404).json({ message: 'Booking tidak ditemukan' }); }

  const mechanic = db.prepare('SELECT id FROM mechanics WHERE user_id = ?').get(req.userId);
  if (bookingOrig.user_id !== req.userId && (!mechanic || bookingOrig.mechanic_id !== mechanic.id)) {
    return res.status(403).json({ message: 'Akses ditolak' });
  }

  db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, req.params.id);
  if (req.io) {
    req.io.to(req.params.id).emit('status_updated', { status });
  }
  res.json(formatBooking(db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id)));
};
