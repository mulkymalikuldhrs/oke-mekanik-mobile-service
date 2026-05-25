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
  problem: z.string().min(3),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string()
  }),
  isEmergency: z.boolean().optional()
});

// Auto-dispatch schema (no mechanic pre-selected)
const autoDispatchSchema = z.object({
  serviceId: z.string(),
  vehicle: z.object({
    brand: z.string(),
    model: z.string(),
    year: z.string(),
    licensePlate: z.string()
  }),
  problem: z.string().min(3),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string()
  }),
  isEmergency: z.boolean().optional()
});

function deg2rad(deg) { return deg * (Math.PI / 180); }
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2-lat1);
  const dLon = deg2rad(lon2-lon1);
  const a = Math.sin(dLat/2)*Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1))*Math.cos(deg2rad(lat2))*
    Math.sin(dLon/2)*Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function formatBooking(b) {
  const mechanic = db.prepare('SELECT id, name, lat, lng, phone, rating, speciality, avatar, price_per_hour FROM mechanics WHERE id = ?').get(b.mechanic_id);
  const service = db.prepare('SELECT id, name, base_price, category, icon FROM services WHERE id = ?').get(b.service_id);
  const user = db.prepare('SELECT id, name, phone FROM users WHERE id = ?').get(b.user_id);
  
  return {
    id: b.id, 
    userId: b.user_id, 
    mechanicId: b.mechanic_id, 
    serviceId: b.service_id,
    vehicle: { brand: b.vehicle_brand, model: b.vehicle_model, year: b.vehicle_year, licensePlate: b.vehicle_license_plate },
    problem: b.problem, 
    status: b.status,
    location: { lat: b.location_lat, lng: b.location_lng, address: b.location_address },
    mechanicLocation: mechanic ? { lat: mechanic.lat, lng: mechanic.lng } : null,
    mechanic: mechanic ? {
      id: mechanic.id,
      name: mechanic.name,
      phone: mechanic.phone,
      rating: mechanic.rating,
      speciality: mechanic.speciality ? mechanic.speciality.split(', ') : [],
      avatar: mechanic.avatar,
      pricePerHour: mechanic.price_per_hour,
    } : null,
    service: service || null,
    customer: user ? { id: user.id, name: user.name, phone: user.phone } : null,
    estimatedCost: b.estimated_cost,
    finalCost: b.final_cost,
    isEmergency: !!b.is_emergency,
    etaMinutes: b.eta_minutes,
    createdAt: b.created_at,
    updatedAt: b.updated_at,
  };
}

export const createBooking = (req, res, next) => {
  try {
    const { mechanicId, serviceId, vehicle, problem, location, isEmergency } = bookingSchema.parse(req.body);
    const id = `BOOK-${Math.floor(1000 + Math.random() * 9000)}`;

    const service = db.prepare('SELECT base_price, name FROM services WHERE id = ?').get(serviceId);
    const mechanic = db.prepare('SELECT price_per_hour, lat, lng FROM mechanics WHERE id = ?').get(mechanicId);
    
    const basePrice = service?.base_price || 50000;
    const emergencySurcharge = isEmergency ? 50000 : 0;
    const distance = mechanic && location ? getDistance(location.lat, location.lng, mechanic.lat, mechanic.lng) : 5;
    const transportFee = Math.round(distance * 3000); // Rp 3000/km transport
    const estimatedCost = basePrice + emergencySurcharge + transportFee;
    const etaMinutes = Math.max(5, Math.round(distance / 30 * 60));

    db.prepare(`
      INSERT INTO bookings (
        id, user_id, mechanic_id, service_id, vehicle_brand, vehicle_model,
        vehicle_year, vehicle_license_plate, problem, status,
        location_lat, location_lng, location_address, estimated_cost, is_emergency, eta_minutes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, req.userId, mechanicId, serviceId, vehicle.brand, vehicle.model,
      vehicle.year, vehicle.licensePlate, problem, 'pending',
      location.lat, location.lng, location.address, estimatedCost,
      isEmergency ? 1 : 0, etaMinutes
    );

    const booking = formatBooking(db.prepare('SELECT * FROM bookings WHERE id = ?').get(id));
    
    // Notify mechanic via socket
    if (req.io) {
      req.io.emit('new_booking', booking);
    }

    res.json(booking);
  } catch (err) { next(err); }
};

// Auto-dispatch booking - finds nearest mechanic automatically
export const createAutoDispatchBooking = (req, res, next) => {
  try {
    const { serviceId, vehicle, problem, location, isEmergency } = autoDispatchSchema.parse(req.body);
    
    // Find nearest online mechanic
    const mechanics = db.prepare('SELECT * FROM mechanics WHERE is_online = 1').all();
    
    if (mechanics.length === 0) {
      return res.status(404).json({ 
        message: 'Tidak ada mekanik online saat ini. Silakan coba lagi nanti.',
        code: 'NO_MECHANIC_AVAILABLE'
      });
    }

    const sorted = mechanics
      .map(m => ({
        ...m,
        distance: getDistance(location.lat, location.lng, m.lat, m.lng),
      }))
      .filter(m => m.distance <= 20)
      .sort((a, b) => {
        if (isEmergency) return a.distance - b.distance;
        if (b.rating !== a.rating) return b.rating - a.rating;
        return a.distance - b.distance;
      });

    if (sorted.length === 0) {
      return res.status(404).json({
        message: 'Tidak ada mekanik tersedia di area Anda (radius 20km).',
        code: 'NO_MECHANIC_NEARBY'
      });
    }

    const bestMechanic = sorted[0];
    
    // Create the booking
    const id = `BOOK-${Math.floor(1000 + Math.random() * 9000)}`;
    const service = db.prepare('SELECT base_price, name FROM services WHERE id = ?').get(serviceId);
    
    const basePrice = service?.base_price || 50000;
    const emergencySurcharge = isEmergency ? 50000 : 0;
    const transportFee = Math.round(bestMechanic.distance * 3000);
    const estimatedCost = basePrice + emergencySurcharge + transportFee;
    const etaMinutes = Math.max(5, Math.round(bestMechanic.distance / 30 * 60));

    db.prepare(`
      INSERT INTO bookings (
        id, user_id, mechanic_id, service_id, vehicle_brand, vehicle_model,
        vehicle_year, vehicle_license_plate, problem, status,
        location_lat, location_lng, location_address, estimated_cost, is_emergency, eta_minutes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, req.userId, bestMechanic.id, serviceId, vehicle.brand, vehicle.model,
      vehicle.year, vehicle.licensePlate, problem, 'pending',
      location.lat, location.lng, location.address, estimatedCost,
      isEmergency ? 1 : 0, etaMinutes
    );

    const booking = formatBooking(db.prepare('SELECT * FROM bookings WHERE id = ?').get(id));
    
    // Notify mechanic via socket
    if (req.io) {
      req.io.emit('new_booking', booking);
    }

    res.json(booking);
  } catch (err) { next(err); }
};

export const getBookings = (req, res) => {
  const { userId, mechanicId, status } = req.query;
  let bookings;

  if (userId) {
    if (req.userId !== userId && req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Akses ditolak' });
    }
    bookings = db.prepare('SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC').all(userId);
  } else if (mechanicId) {
    const mech = db.prepare('SELECT id, user_id FROM mechanics WHERE id = ? OR user_id = ?').get(mechanicId, mechanicId);
    if (!mech || (mech.user_id && mech.user_id !== req.userId && req.userRole !== 'admin')) {
        return res.status(403).json({ message: 'Akses ditolak' });
    }
    bookings = db.prepare('SELECT * FROM bookings WHERE mechanic_id = ? ORDER BY created_at DESC').all(mech.id);
  } else {
    if (req.userRole === 'customer') {
      bookings = db.prepare('SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC').all(req.userId);
    } else if (req.userRole === 'mechanic' || req.userRole === 'workshop') {
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
    const bookings = db.prepare("SELECT * FROM bookings WHERE status NOT IN ('completed', 'cancelled') ORDER BY created_at DESC").all();
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
  const isAdmin = req.userRole === 'admin';

  if (!isOwner && !isAssignedMechanic && !isAdmin) {
    return res.status(403).json({ message: 'Akses ditolak' });
  }

  res.json(formatBooking(booking));
};

export const updateBookingStatus = (req, res) => {
  const { status, cancelReason } = req.body;
  const bookingOrig = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);

  if (!bookingOrig) { return res.status(404).json({ message: 'Booking tidak ditemukan' }); }

  const mechanic = db.prepare('SELECT id FROM mechanics WHERE user_id = ?').get(req.userId);
  const isOwner = bookingOrig.user_id === req.userId;
  const isAssignedMechanic = mechanic && bookingOrig.mechanic_id === mechanic.id;
  const isAdmin = req.userRole === 'admin';

  if (!isOwner && !isAssignedMechanic && !isAdmin) {
    return res.status(403).json({ message: 'Akses ditolak' });
  }

  // Validate status transitions
  const validTransitions = {
    'pending': ['accepted', 'cancelled'],
    'accepted': ['otw', 'cancelled'],
    'otw': ['arrived', 'cancelled'],
    'arrived': ['working', 'cancelled'],
    'working': ['completed'],
    'completed': [],
    'cancelled': [],
  };

  if (!validTransitions[bookingOrig.status]?.includes(status)) {
    return res.status(400).json({ 
      message: `Tidak bisa mengubah status dari "${bookingOrig.status}" ke "${status}"`,
      currentStatus: bookingOrig.status,
      requestedStatus: status
    });
  }

  const now = new Date().toISOString();
  db.prepare('UPDATE bookings SET status = ?, updated_at = ?, final_cost = ? WHERE id = ?').run(
    status, now,
    status === 'completed' ? bookingOrig.estimated_cost : null,
    req.params.id
  );

  if (req.io) {
    req.io.to(req.params.id).emit('status_updated', { status, bookingId: req.params.id });
    // Also broadcast for dashboard updates
    req.io.emit('booking_status_changed', { bookingId: req.params.id, status });
  }

  res.json(formatBooking(db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id)));
};

// SOS Emergency booking - instant dispatch with highest priority
export const createSOSBooking = (req, res, next) => {
  try {
    const { location, vehicle, problem } = req.body;
    
    if (!location?.lat || !location?.lng) {
      return res.status(400).json({ message: 'Lokasi GPS diperlukan untuk panggilan darurat' });
    }

    // Find nearest mechanic - prioritize emergency specialists
    const mechanics = db.prepare('SELECT * FROM mechanics WHERE is_online = 1').all();
    
    if (mechanics.length === 0) {
      return res.status(404).json({ 
        message: 'Tidak ada mekanik online saat ini. Hubungi 911 atau bengkel terdekat.',
        code: 'NO_MECHANIC_SOS'
      });
    }

    const sorted = mechanics
      .map(m => ({
        ...m,
        distance: getDistance(location.lat, location.lng, m.lat, m.lng),
        emergencyPriority: m.speciality?.toLowerCase().includes('darurat') || 
                          m.speciality?.toLowerCase().includes('darak') || 
                          m.speciality?.toLowerCase().includes('mogok') ? 2 : 1
      }))
      .filter(m => m.distance <= 25) // Wider radius for SOS
      .sort((a, b) => {
        // Emergency specialists first, then distance
        if (a.emergencyPriority !== b.emergencyPriority) return b.emergencyPriority - a.emergencyPriority;
        return a.distance - b.distance;
      });

    if (sorted.length === 0) {
      return res.status(404).json({
        message: 'Tidak ada mekanik tersedia dalam radius 25km. Hubungi 911.',
        code: 'NO_MECHANIC_SOS'
      });
    }

    const bestMechanic = sorted[0];
    const id = `SOS-${Math.floor(1000 + Math.random() * 9000)}`;
    const estimatedCost = 150000 + Math.round(bestMechanic.distance * 3000);
    const etaMinutes = Math.max(3, Math.round(bestMechanic.distance / 40 * 60)); // Faster for SOS

    db.prepare(`
      INSERT INTO bookings (
        id, user_id, mechanic_id, service_id, vehicle_brand, vehicle_model,
        vehicle_year, vehicle_license_plate, problem, status,
        location_lat, location_lng, location_address, estimated_cost, is_emergency, eta_minutes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, req.userId, bestMechanic.id, 'svc-darurat',
      vehicle?.brand || 'Unknown', vehicle?.model || 'Unknown',
      vehicle?.year || '', vehicle?.licensePlate || '', 
      problem || 'DARURAT - Kendaraan mogok', 'pending',
      location.lat, location.lng, location.address || 'Lokasi GPS', estimatedCost,
      1, etaMinutes
    );

    const booking = formatBooking(db.prepare('SELECT * FROM bookings WHERE id = ?').get(id));
    
    // High-priority notification
    if (req.io) {
      req.io.emit('sos_booking', booking);
      req.io.emit('new_booking', booking);
    }

    res.json(booking);
  } catch (err) { next(err); }
};
