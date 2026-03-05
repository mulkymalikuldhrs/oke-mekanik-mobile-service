import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-okemekanik-2024';

// Safety check for JWT_SECRET in production
if (process.env.NODE_ENV === 'production' && JWT_SECRET === 'dev-secret-okemekanik-2024') {
  console.warn('WARNING: Using default JWT_SECRET in production is unsafe!');
}

app.use(cors());
app.use(express.json());

// Helper for coordinates
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

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

// Helper for UUID
const generateId = () => uuidv4();

// --- Auth Endpoints ---
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ? AND role = ?').get(email, role);

  if (user && bcrypt.compareSync(password, user.password_hash)) {
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    const { password_hash: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } else {
    res.status(401).json({ message: 'Email atau password salah' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, phone } = req.body;
  const id = generateId();
  const passwordHash = bcrypt.hashSync(password, 10);

  try {
    db.prepare('INSERT INTO users (id, name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?, ?)')
      .run(id, name, email, passwordHash, role, phone || null);

    const token = jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '24h' });
    const user = { id, name, email, role, phone };
    res.json({ user, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({ message: 'Email sudah terdaftar atau data tidak valid' });
  }
});

app.get('/api/auth/me', verifyToken, (req, res) => {
  const user = db.prepare('SELECT id, name, email, role, phone FROM users WHERE id = ?').get(req.userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.post('/api/auth/refresh', verifyToken, (req, res) => {
  const token = jwt.sign({ id: req.userId, role: req.userRole }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

app.get('/api/health', (req, res) => {
  try {
    db.prepare('SELECT 1').get();
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', message: error.message });
  }
});

// --- User Endpoints ---
app.get('/api/users/:id', verifyToken, (req, res) => {
  // Authorization: Users can see their own full profile, others see limited info
  const isSelf = req.params.id === req.userId;

  let user = db.prepare('SELECT id, name, email, role, phone FROM users WHERE id = ?').get(req.params.id);

  if (!user) {
    // Check if it's a mechanic ID
    const mechanic = db.prepare('SELECT id, name, phone FROM mechanics WHERE id = ?').get(req.params.id);
    if (mechanic) {
      user = { id: mechanic.id, name: mechanic.name, role: 'mechanic', phone: mechanic.phone };
    }
  }

  if (user) {
    if (isSelf || user.role === 'mechanic') {
      res.json(user);
    } else {
      // Hide sensitive info for other customers
      res.json({ id: user.id, name: user.name, role: user.role });
    }
  } else {
    res.status(404).json({ message: 'User tidak ditemukan' });
  }
});

app.put('/api/users/:id', verifyToken, (req, res) => {
  if (req.params.id !== req.userId) {
    return res.status(403).json({ message: 'Forbidden: You can only update your own profile' });
  }

  const { name, email, phone } = req.body;
  try {
    db.prepare('UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?')
      .run(name, email, phone, req.userId);
    const user = db.prepare('SELECT id, name, email, role, phone FROM users WHERE id = ?').get(req.userId);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Gagal memperbarui profil' });
  }
});

// --- Mechanic Endpoints ---
app.get('/api/mechanics', (req, res) => {
  const mechanics = db.prepare('SELECT * FROM mechanics').all();
  const formatted = mechanics.map(m => ({
    ...m,
    speciality: m.speciality ? m.speciality.split(', ') : [],
    isOnline: !!m.is_online,
    pricePerHour: m.price_per_hour
  }));
  res.json(formatted);
});

app.get('/api/mechanics/nearby', (req, res) => {
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
});

app.get('/api/mechanics/:id', (req, res) => {
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
});

app.post('/api/mechanics/register', verifyToken, (req, res) => {
  const { speciality, experience, phone, identityNumber, bio } = req.body;
  const id = generateId();

  const user = db.prepare('SELECT name FROM users WHERE id = ?').get(req.userId);

  try {
    db.prepare(`
      INSERT INTO mechanics (id, user_id, name, speciality, years_of_experience, phone, identity_number, bio, is_online)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, req.userId, user.name, speciality, experience, phone, identityNumber, bio, 1);

    res.json({ success: true, mechanicId: id });
  } catch (error) {
    console.error('Mechanic register error:', error);
    res.status(400).json({ message: 'Gagal mendaftarkan mekanik' });
  }
});

app.patch('/api/mechanics/:id/status', verifyToken, (req, res) => {
  const { isOnline } = req.body;
  const mech = db.prepare('SELECT user_id FROM mechanics WHERE id = ? OR user_id = ?').get(req.params.id, req.params.id);

  if (!mech || mech.user_id !== req.userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  db.prepare('UPDATE mechanics SET is_online = ? WHERE id = ? OR user_id = ?').run(isOnline ? 1 : 0, req.params.id, req.params.id);
  res.json({ success: true });
});

app.patch('/api/mechanics/:id/location', verifyToken, (req, res) => {
  const { lat, lng } = req.body;
  const mech = db.prepare('SELECT user_id FROM mechanics WHERE id = ? OR user_id = ?').get(req.params.id, req.params.id);

  if (!mech || mech.user_id !== req.userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  db.prepare('UPDATE mechanics SET lat = ?, lng = ? WHERE id = ? OR user_id = ?').run(lat, lng, req.params.id, req.params.id);
  res.json({ success: true });
});

// --- Service Endpoints ---
app.get('/api/services', (req, res) => {
  const services = db.prepare('SELECT * FROM services').all();
  res.json(services.map(s => ({
    id: s.id,
    name: s.name,
    description: s.description,
    basePrice: s.base_price
  })));
});

// --- Booking Endpoints ---
app.post('/api/bookings', verifyToken, (req, res) => {
  const { mechanicId, serviceId, vehicle, problem, location, isEmergency } = req.body;
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

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
  res.json(formatBooking(booking));
});

app.get('/api/bookings', verifyToken, (req, res) => {
  const { userId, mechanicId } = req.query;
  let bookings;

  // Security: Users can only see their own bookings unless they are the assigned mechanic
  if (userId) {
    if (userId !== req.userId) return res.status(403).json({ message: 'Forbidden' });
    bookings = db.prepare('SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC').all(userId);
  } else if (mechanicId) {
    const mech = db.prepare('SELECT id, user_id FROM mechanics WHERE id = ? OR user_id = ?').get(mechanicId, mechanicId);
    if (!mech || (mech.user_id !== req.userId)) return res.status(403).json({ message: 'Forbidden' });
    bookings = db.prepare('SELECT * FROM bookings WHERE mechanic_id = ? ORDER BY created_at DESC').all(mech.id);
  } else {
    // If no filter, show bookings where user is either customer or mechanic
    const mech = db.prepare('SELECT id FROM mechanics WHERE user_id = ?').get(req.userId);
    bookings = db.prepare('SELECT * FROM bookings WHERE user_id = ? OR mechanic_id = ? ORDER BY created_at DESC').all(req.userId, mech?.id || 'none');
  }
  res.json(bookings.map(formatBooking));
});

app.get('/api/bookings/active', verifyToken, (req, res) => {
    const mech = db.prepare('SELECT id FROM mechanics WHERE user_id = ?').get(req.userId);
    const bookings = db.prepare(`
      SELECT * FROM bookings
      WHERE status NOT IN ('completed', 'cancelled')
      AND (user_id = ? OR mechanic_id = ?)
    `).all(req.userId, mech?.id || 'none');
    res.json(bookings.map(formatBooking));
});

app.get('/api/bookings/:id', verifyToken, (req, res) => {
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  if (booking) {
    const mech = db.prepare('SELECT id FROM mechanics WHERE user_id = ?').get(req.userId);
    if (booking.user_id !== req.userId && booking.mechanic_id !== mech?.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(formatBooking(booking));
  } else {
    res.status(404).json({ message: 'Booking tidak ditemukan' });
  }
});

app.patch('/api/bookings/:id/status', verifyToken, (req, res) => {
  const { status } = req.body;
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);

  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  const mech = db.prepare('SELECT id FROM mechanics WHERE user_id = ?').get(req.userId);
  const isCustomer = booking.user_id === req.userId;
  const isMechanic = booking.mechanic_id === mech?.id;

  if (!isCustomer && !isMechanic) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, req.params.id);
  const updatedBooking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  res.json(formatBooking(updatedBooking));
});

// --- Message Endpoints ---
app.get('/api/messages', verifyToken, (req, res) => {
  const { bookingId } = req.query;
  const messages = db.prepare('SELECT * FROM messages WHERE booking_id = ? ORDER BY created_at ASC').all(bookingId);
  res.json(messages.map(m => ({
    id: m.id,
    bookingId: m.booking_id,
    senderId: m.sender_id,
    text: m.text,
    createdAt: m.created_at
  })));
});

app.post('/api/messages', verifyToken, (req, res) => {
  const { bookingId, text } = req.body;
  const id = generateId();

  const booking = db.prepare('SELECT user_id, mechanic_id FROM bookings WHERE id = ?').get(bookingId);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  const mech = db.prepare('SELECT id FROM mechanics WHERE user_id = ?').get(req.userId);
  if (booking.user_id !== req.userId && booking.mechanic_id !== mech?.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  db.prepare('INSERT INTO messages (id, booking_id, sender_id, text) VALUES (?, ?, ?, ?)').run(id, bookingId, req.userId, text);
  const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(id);
  res.json({
    id: message.id,
    bookingId: message.booking_id,
    senderId: message.sender_id,
    text: message.text,
    createdAt: message.created_at
  });
});

// --- Payment Endpoints ---
app.post('/api/payments', verifyToken, (req, res) => {
    const { bookingId, amount, paymentMethod, status } = req.body;

    const booking = db.prepare('SELECT user_id FROM bookings WHERE id = ?').get(bookingId);
    if (!booking || booking.user_id !== req.userId) {
      return res.status(403).json({ message: 'Forbidden: You can only pay for your own bookings' });
    }

    const id = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;
    db.prepare('INSERT INTO payments (id, booking_id, amount, payment_method, status) VALUES (?, ?, ?, ?, ?)')
      .run(id, bookingId, amount, paymentMethod, status);
    res.json({ id, status });
});

app.get('/api/payments', verifyToken, (req, res) => {
    const { bookingId } = req.query;
    const payment = db.prepare('SELECT * FROM payments WHERE booking_id = ?').get(bookingId);
    if (payment) {
        res.json({
            id: payment.id,
            amount: payment.amount,
            status: payment.status,
            paymentMethod: payment.payment_method
        });
    } else {
        res.status(404).json({ message: 'Pembayaran tidak ditemukan' });
    }
});

// --- Review Endpoints ---
app.get('/api/reviews', (req, res) => {
  const { mechanicId } = req.query;
  let reviews;
  if (mechanicId) {
    reviews = db.prepare('SELECT * FROM reviews WHERE mechanic_id = ? ORDER BY created_at DESC').all(mechanicId);
  } else {
    reviews = db.prepare('SELECT * FROM reviews ORDER BY created_at DESC').all();
  }
  res.json(reviews.map(r => ({
    id: r.id,
    bookingId: r.booking_id,
    userId: r.user_id,
    mechanicId: r.mechanic_id,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.created_at
  })));
});

app.post('/api/reviews', verifyToken, (req, res) => {
  const { bookingId, mechanicId, rating, comment } = req.body;

  const booking = db.prepare('SELECT user_id FROM bookings WHERE id = ?').get(bookingId);
  if (!booking || booking.user_id !== req.userId) {
    return res.status(403).json({ message: 'Forbidden: You can only review your own bookings' });
  }

  const id = generateId();

  try {
    db.prepare(`
      INSERT INTO reviews (id, booking_id, user_id, mechanic_id, rating, comment)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, bookingId, req.userId, mechanicId, rating, comment);

    // Update mechanic average rating
    const stats = db.prepare('SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE mechanic_id = ?').get(mechanicId);
    db.prepare('UPDATE mechanics SET rating = ? WHERE id = ?').run(stats.avg, mechanicId);

    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
    res.json(review);
  } catch (error) {
    console.error('Review error:', error);
    res.status(400).json({ message: 'Gagal menambahkan ulasan' });
  }
});

// Helper to format booking response
function formatBooking(b) {
  const mechanic = db.prepare('SELECT lat, lng FROM mechanics WHERE id = ?').get(b.mechanic_id);

  return {
    id: b.id,
    userId: b.user_id,
    mechanicId: b.mechanic_id,
    serviceId: b.service_id,
    vehicle: {
      brand: b.vehicle_brand,
      model: b.vehicle_model,
      year: b.vehicle_year,
      licensePlate: b.vehicle_license_plate
    },
    problem: b.problem,
    status: b.status,
    location: {
      lat: b.location_lat,
      lng: b.location_lng,
      address: b.location_address
    },
    mechanicLocation: mechanic ? {
      lat: mechanic.lat,
      lng: mechanic.lng
    } : null,
    estimatedCost: b.estimated_cost,
    createdAt: b.created_at
  };
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
