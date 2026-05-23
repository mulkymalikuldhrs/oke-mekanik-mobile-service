import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const getAllMechanics = (req, res) => {
  const mechanics = db.prepare('SELECT * FROM mechanics').all();
  const formatted = mechanics.map(m => ({
    ...m,
    speciality: m.speciality ? m.speciality.split(', ') : [],
    isOnline: !!m.is_online,
    pricePerHour: m.price_per_hour
  }));
  res.json(formatted);
};

export const getNearbyMechanics = (req, res) => {
  const { lat, lng, radius } = req.query;
  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);
  const searchRadius = parseFloat(radius) || 10;

  if (isNaN(userLat) || isNaN(userLng)) {
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }

  const mechanics = db.prepare('SELECT * FROM mechanics WHERE is_online = 1').all();
  const nearby = mechanics
    .map(m => ({
      ...m,
      speciality: m.speciality ? m.speciality.split(', ') : [],
      isOnline: !!m.is_online,
      pricePerHour: m.price_per_hour,
      distance: getDistance(userLat, userLng, m.lat, m.lng)
    }))
    .filter(m => m.distance <= searchRadius)
    .sort((a, b) => a.distance - b.distance);

  res.json(nearby);
};

export const getMechanicById = (req, res) => {
  const mechanic = db.prepare('SELECT * FROM mechanics WHERE id = ? OR user_id = ?').get(req.params.id, req.params.id);
  if (mechanic) {
    res.json({
      ...mechanic,
      speciality: mechanic.speciality ? mechanic.speciality.split(', ') : [],
      isOnline: !!mechanic.is_online,
      pricePerHour: mechanic.price_per_hour
    });
  } else {
    res.status(404).json({ message: 'Mekanik tidak ditemukan' });
  }
};

export const registerMechanic = (req, res) => {
  const { speciality, experience, phone, identityNumber, bio } = req.body;
  const id = uuidv4();

  const user = db.prepare('SELECT name FROM users WHERE id = ?').get(req.userId);

  try {
    db.prepare(`
      INSERT INTO mechanics (id, user_id, name, speciality, years_of_experience, phone, identity_number, bio, is_online)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, req.userId, user.name, speciality, experience, phone, identityNumber, bio, 1);

    res.json({ success: true, mechanicId: id });
  } catch (error) {
    res.status(400).json({ message: 'Gagal mendaftarkan mekanik' });
  }
};

export const updateMechanicStatus = (req, res) => {
  const { isOnline } = req.body;
  const mechanic = db.prepare('SELECT user_id FROM mechanics WHERE id = ? OR user_id = ?').get(req.params.id, req.params.id);

  if (!mechanic || mechanic.user_id !== req.userId) {
    return res.status(403).json({ message: 'Akses ditolak' });
  }

  db.prepare('UPDATE mechanics SET is_online = ? WHERE id = ? OR user_id = ?').run(isOnline ? 1 : 0, req.params.id, req.params.id);
  res.json({ success: true });
};

export const updateMechanicLocation = (req, res) => {
  const { lat, lng } = req.body;
  const mechanic = db.prepare('SELECT user_id FROM mechanics WHERE id = ? OR user_id = ?').get(req.params.id, req.params.id);

  if (!mechanic || mechanic.user_id !== req.userId) {
    return res.status(403).json({ message: 'Akses ditolak' });
  }

  db.prepare('UPDATE mechanics SET lat = ?, lng = ? WHERE id = ? OR user_id = ?').run(lat, lng, req.params.id, req.params.id);

  if (req.io) {
    const activeBooking = db.prepare("SELECT id FROM bookings WHERE mechanic_id = (SELECT id FROM mechanics WHERE user_id = ?) AND status IN ('otw', 'working')").get(req.userId);
    if (activeBooking) {
      req.io.to(activeBooking.id).emit('location_updated', { lat, lng });
    }
  }

  res.json({ success: true });
};
