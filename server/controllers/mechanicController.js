import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';

function deg2rad(deg) { return deg * (Math.PI / 180); }

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat/2)*Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1))*Math.cos(deg2rad(lat2))*
    Math.sin(dLon/2)*Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function formatMechanic(m) {
  return {
    ...m,
    speciality: m.speciality ? m.speciality.split(', ') : [],
    isOnline: !!m.is_online,
    pricePerHour: m.price_per_hour,
    isWorkshop: !!m.is_workshop,
    yearsOfExperience: m.years_of_experience,
  };
}

export const getAllMechanics = (req, res) => {
  const mechanics = db.prepare('SELECT * FROM mechanics').all();
  res.json(mechanics.map(formatMechanic));
};

export const getNearbyMechanics = (req, res) => {
  const { lat, lng, radius, serviceId } = req.query;
  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);
  const searchRadius = parseFloat(radius) || 15;

  if (isNaN(userLat) || isNaN(userLng)) {
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }

  // Get online mechanics
  let mechanics = db.prepare('SELECT * FROM mechanics WHERE is_online = 1').all();

  // If serviceId provided, filter by specialty match
  if (serviceId) {
    const service = db.prepare('SELECT name, category FROM services WHERE id = ?').get(serviceId);
    if (service && service.category === 'emergency') {
      // For emergency, only get mechanics with emergency-related specialties
      mechanics = mechanics.filter(m => 
        m.speciality?.toLowerCase().includes('darurat') || 
        m.speciality?.toLowerCase().includes('darak') || 
        m.speciality?.toLowerCase().includes('mogok') ||
        m.speciality?.toLowerCase().includes('bantuan')
      );
    }
  }

  const nearby = mechanics
    .map(m => ({
      ...formatMechanic(m),
      distance: getDistance(userLat, userLng, m.lat, m.lng),
      etaMinutes: Math.max(5, Math.round(getDistance(userLat, userLng, m.lat, m.lng) / 30 * 60)), // Assume 30km/h avg speed
    }))
    .filter(m => m.distance <= searchRadius)
    .sort((a, b) => a.distance - b.distance);

  res.json(nearby);
};

export const autoDispatch = (req, res) => {
  const { lat, lng, serviceId, isEmergency } = req.body;
  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);

  if (isNaN(userLat) || isNaN(userLng)) {
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }

  // Find nearest online mechanic
  const mechanics = db.prepare('SELECT * FROM mechanics WHERE is_online = 1').all();
  
  if (mechanics.length === 0) {
    return res.status(404).json({ 
      message: 'Tidak ada mekanik online saat ini',
      found: false 
    });
  }

  const sorted = mechanics
    .map(m => ({
      ...formatMechanic(m),
      distance: getDistance(userLat, userLng, m.lat, m.lng),
      etaMinutes: Math.max(5, Math.round(getDistance(userLat, userLng, m.lat, m.lng) / 30 * 60)),
    }))
    .filter(m => m.distance <= 20) // Max 20km radius
    .sort((a, b) => {
      // For emergency, prioritize fastest arrival
      if (isEmergency) return a.etaMinutes - b.etaMinutes;
      // Otherwise prioritize rating then distance
      if (b.rating !== a.rating) return b.rating - a.rating;
      return a.distance - b.distance;
    });

  if (sorted.length === 0) {
    return res.status(404).json({
      message: 'Tidak ada mekanik tersedia di area Anda',
      found: false
    });
  }

  const best = sorted[0];
  res.json({ mechanic: best, found: true });
};

export const getMechanicById = (req, res) => {
  const mechanic = db.prepare('SELECT * FROM mechanics WHERE id = ? OR user_id = ?').get(req.params.id, req.params.id);
  if (mechanic) {
    res.json(formatMechanic(mechanic));
  } else {
    res.status(404).json({ message: 'Mekanik tidak ditemukan' });
  }
};

export const registerMechanic = (req, res) => {
  const { speciality, experience, phone, identityNumber, bio, vehicleType, vehiclePlate } = req.body;
  const id = uuidv4();
  const user = db.prepare('SELECT name FROM users WHERE id = ?').get(req.userId);

  try {
    db.prepare(`
      INSERT INTO mechanics (id, user_id, name, speciality, years_of_experience, phone, identity_number, bio, is_online, vehicle_type, vehicle_plate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, req.userId, user.name, speciality, experience, phone, identityNumber, bio || 'Mekanik profesional mitra Oke Mekanik', 1, vehicleType || 'motorcycle', vehiclePlate || '');

    // Also get user location if available, default to Jakarta
    res.json({ success: true, mechanicId: id });
  } catch (error) {
    console.error('Mechanic registration error:', error);
    res.status(400).json({ message: 'Gagal mendaftarkan mekanik' });
  }
};

export const updateMechanicStatus = (req, res) => {
  const { isOnline } = req.body;
  const mechanic = db.prepare('SELECT user_id FROM mechanics WHERE id = ? OR user_id = ?').get(req.params.id, req.params.id);

  if (!mechanic || (mechanic.user_id && mechanic.user_id !== req.userId)) {
    return res.status(403).json({ message: 'Akses ditolak' });
  }

  db.prepare('UPDATE mechanics SET is_online = ? WHERE id = ? OR user_id = ?').run(isOnline ? 1 : 0, req.params.id, req.params.id);
  
  // Notify via socket
  if (req.io) {
    req.io.emit('mechanic_status_changed', { 
      mechanicId: req.params.id, 
      isOnline: !!isOnline 
    });
  }
  
  res.json({ success: true, isOnline: !!isOnline });
};

export const updateMechanicLocation = (req, res) => {
  const { lat, lng } = req.body;
  const mechanic = db.prepare('SELECT id, user_id FROM mechanics WHERE id = ? OR user_id = ?').get(req.params.id, req.params.id);

  if (!mechanic || (mechanic.user_id && mechanic.user_id !== req.userId)) {
    return res.status(403).json({ message: 'Akses ditolak' });
  }

  db.prepare('UPDATE mechanics SET lat = ?, lng = ? WHERE id = ? OR user_id = ?').run(lat, lng, req.params.id, req.params.id);

  if (req.io) {
    // Emit to active booking rooms
    const activeBookings = db.prepare("SELECT id FROM bookings WHERE mechanic_id = ? AND status IN ('accepted', 'otw')").all(mechanic.id);
    for (const booking of activeBookings) {
      req.io.to(booking.id).emit('location_updated', { lat, lng });
    }
  }

  res.json({ success: true });
};

export const getPendingBookings = (req, res) => {
  const mechanic = db.prepare('SELECT id FROM mechanics WHERE user_id = ?').get(req.userId);
  if (!mechanic) {
    return res.json([]);
  }
  
  // Get pending bookings that are within 20km of mechanic's location
  const mechData = db.prepare('SELECT lat, lng FROM mechanics WHERE id = ?').get(mechanic.id);
  if (!mechData || !mechData.lat) {
    return res.json([]);
  }

  const pendingBookings = db.prepare("SELECT * FROM bookings WHERE status = 'pending'").all();
  
  const relevant = pendingBookings
    .map(b => ({
      id: b.id,
      userId: b.user_id,
      serviceId: b.service_id,
      problem: b.problem,
      vehicleBrand: b.vehicle_brand,
      vehicleModel: b.vehicle_model,
      locationLat: b.location_lat,
      locationLng: b.location_lng,
      locationAddress: b.location_address,
      estimatedCost: b.estimated_cost,
      isEmergency: !!b.is_emergency,
      createdAt: b.created_at,
      distance: getDistance(mechData.lat, mechData.lng, b.location_lat, b.location_lng),
      etaMinutes: Math.max(5, Math.round(getDistance(mechData.lat, mechData.lng, b.location_lat, b.location_lng) / 30 * 60)),
    }))
    .filter(b => b.distance <= 20)
    .sort((a, b) => {
      // Emergency bookings first
      if (a.isEmergency !== b.isEmergency) return b.isEmergency ? 1 : -1;
      return a.distance - b.distance;
    });

  res.json(relevant);
};
