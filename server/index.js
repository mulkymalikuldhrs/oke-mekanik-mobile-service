import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-okemekanik-2024';

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.warn('WARNING: Running in production without JWT_SECRET environment variable!');
}

app.use(cors());
app.use(express.json());

// --- Utilities ---
const generateId = () => uuidv4();

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function formatBooking(b) {
  if (!b) return null;
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
    estimatedCost: b.estimated_cost,
    createdAt: b.created_at,
    updatedAt: b.updated_at
  };
}

// --- Middleware ---
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Sesi tidak valid atau telah berakhir.' });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Auth Endpoints ---
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND role = ?').get(email, role);

    if (user && bcrypt.compareSync(password, user.password_hash)) {
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      const { password_hash: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } else {
      res.status(401).json({ message: 'Email atau password salah' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
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
    res.json({ user: { id, name, email, role, phone }, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({ message: 'Email sudah terdaftar atau data tidak valid' });
  }
});

app.get('/api/auth/me', verifyToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, role, phone FROM users WHERE id = ?').get(req.userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

app.post('/api/auth/refresh', verifyToken, (req, res) => {
  const token = jwt.sign({ id: req.userId, role: req.userRole }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// --- User Endpoints ---
app.get('/api/users/:id', (req, res) => {
  try {
    let user = db.prepare('SELECT id, name, email, role, phone FROM users WHERE id = ?').get(req.params.id);

    if (!user) {
      const mechanic = db.prepare('SELECT id, name, phone FROM mechanics WHERE id = ? OR user_id = ?').get(req.params.id, req.params.id);
      if (mechanic) {
        user = { id: mechanic.id, name: mechanic.name, role: 'mechanic', phone: mechanic.phone };
      }
    }

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

app.put('/api/users/:id', verifyToken, (req, res) => {
  if (req.userId !== req.params.id) {
    return res.status(403).json({ message: 'Anda tidak memiliki akses' });
  }

  const { name, email, phone } = req.body;
  try {
    db.prepare('UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?')
      .run(name, email, phone, req.params.id);
    const user = db.prepare('SELECT id, name, email, role, phone FROM users WHERE id = ?').get(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Gagal memperbarui profil' });
  }
});

// --- Mechanic Endpoints ---
app.get('/api/mechanics', (req, res) => {
  try {
    const mechanics = db.prepare('SELECT * FROM mechanics').all();
    const formatted = mechanics.map(m => ({
      ...m,
      speciality: m.speciality ? m.speciality.split(', ') : [],
      isOnline: !!m.is_online,
      pricePerHour: m.price_per_hour
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat data mekanik' });
  }
});

app.get('/api/mechanics/nearby', (req, res) => {
  const { lat, lng, radius } = req.query;
  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);
  const searchRadius = parseFloat(radius) || 10;

  if (isNaN(userLat) || isNaN(userLng)) {
    return res.status(400).json({ message: 'Latitude dan longitude diperlukan' });
  }

  try {
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
  } catch (error) {
    res.status(500).json({ message: 'Gagal mencari mekanik terdekat' });
  }
});

app.get('/api/mechanics/:id', (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat detail mekanik' });
  }
});

app.get('/api/mechanics/:id/analytics', verifyToken, (req, res) => {
  const mechanicId = req.params.id;
  try {
    // Check ownership
    const mechanic = db.prepare('SELECT id FROM mechanics WHERE id = ? OR user_id = ?').get(mechanicId, mechanicId);
    if (!mechanic) return res.status(404).json({ message: 'Mekanik tidak ditemukan' });

    // Calculate weekly earnings (simplified for 7 days)
    const earnings = db.prepare(`
      SELECT
        CASE strftime('%w', created_at)
          WHEN '0' THEN 'Min' WHEN '1' THEN 'Sen' WHEN '2' THEN 'Sel'
          WHEN '3' THEN 'Rab' WHEN '4' THEN 'Kam' WHEN '5' THEN 'Jum'
          WHEN '6' THEN 'Sab'
        END as name,
        SUM(estimated_cost) as value
      FROM bookings
      WHERE mechanic_id = ? AND status = 'completed'
      GROUP BY name
    `).all(mechanic.id);

    // Map to ensure all days are present
    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const result = days.map(day => {
      const found = earnings.find(e => e.name === day);
      return { name: day, value: found ? found.value : 0 };
    });

    const total = result.reduce((acc, curr) => acc + curr.value, 0);

    res.json({ chartData: result, totalEarnings: total });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Gagal memuat data analitik' });
  }
});

app.post('/api/mechanics/register', verifyToken, (req, res) => {
  const { speciality, experience, phone, identityNumber, bio } = req.body;
  const id = generateId();

  try {
    const user = db.prepare('SELECT name FROM users WHERE id = ?').get(req.userId);
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
  try {
    db.prepare('UPDATE mechanics SET is_online = ? WHERE id = ? OR user_id = ?').run(isOnline ? 1 : 0, req.params.id, req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui status' });
  }
});

// --- Service Endpoints ---
app.get('/api/services', (req, res) => {
  try {
    const services = db.prepare('SELECT * FROM services').all();
    res.json(services.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      basePrice: s.base_price
    })));
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat layanan' });
  }
});

// --- Booking Endpoints ---
app.post('/api/bookings', verifyToken, (req, res) => {
  const { userId, mechanicId, serviceId, vehicle, problem, location, isEmergency } = req.body;
  const id = `BOOK-${Math.floor(10000 + Math.random() * 90000)}`;

  try {
    const service = db.prepare('SELECT base_price FROM services WHERE id = ?').get(serviceId);
    const estimatedCost = (service?.base_price || 50000) + (isEmergency ? 50000 : 0);

    db.prepare(`
      INSERT INTO bookings (
        id, user_id, mechanic_id, service_id, vehicle_brand, vehicle_model,
        vehicle_year, vehicle_license_plate, problem, status,
        location_lat, location_lng, location_address, estimated_cost
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, userId || req.userId, mechanicId, serviceId, vehicle.brand, vehicle.model,
      vehicle.year, vehicle.licensePlate, problem, 'pending',
      location.lat, location.lng, location.address, estimatedCost
    );

    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
    res.json(formatBooking(booking));
  } catch (error) {
    console.error('Booking error:', error);
    res.status(400).json({ message: 'Gagal membuat pesanan' });
  }
});

app.get('/api/bookings', verifyToken, (req, res) => {
  const { userId, mechanicId } = req.query;
  try {
    let bookings;
    if (userId) {
      bookings = db.prepare('SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    } else if (mechanicId) {
      const mech = db.prepare('SELECT id FROM mechanics WHERE id = ? OR user_id = ?').get(mechanicId, mechanicId);
      bookings = db.prepare('SELECT * FROM bookings WHERE mechanic_id = ? ORDER BY created_at DESC').all(mech ? mech.id : mechanicId);
    } else {
      bookings = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
    }
    res.json(bookings.map(formatBooking));
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat pesanan' });
  }
});

app.get('/api/bookings/active', verifyToken, (req, res) => {
  try {
    const bookings = db.prepare("SELECT * FROM bookings WHERE status NOT IN ('completed', 'cancelled')").all();
    res.json(bookings.map(formatBooking));
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat pesanan aktif' });
  }
});

app.get('/api/bookings/:id', verifyToken, (req, res) => {
  try {
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    if (booking) {
      res.json(formatBooking(booking));
    } else {
      res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
});

app.patch('/api/bookings/:id/status', verifyToken, (req, res) => {
  const { status } = req.body;
  try {
    db.prepare('UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, req.params.id);
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    res.json(formatBooking(booking));
  } catch (error) {
    res.status(400).json({ message: 'Gagal memperbarui status pesanan' });
  }
});

// --- Message Endpoints ---
app.get('/api/messages', verifyToken, (req, res) => {
  const { bookingId } = req.query;
  try {
    const messages = db.prepare('SELECT * FROM messages WHERE booking_id = ? ORDER BY created_at ASC').all(bookingId);
    res.json(messages.map(m => ({
      id: m.id,
      bookingId: m.booking_id,
      senderId: m.sender_id,
      text: m.text,
      createdAt: m.created_at
    })));
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat pesan' });
  }
});

app.post('/api/messages', verifyToken, (req, res) => {
  const { bookingId, senderId, text } = req.body;
  const id = generateId();
  try {
    db.prepare('INSERT INTO messages (id, booking_id, sender_id, text) VALUES (?, ?, ?, ?)').run(id, bookingId, senderId, text);
    const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(id);
    res.json({
      id: message.id,
      bookingId: message.booking_id,
      senderId: message.sender_id,
      text: message.text,
      createdAt: message.created_at
    });
  } catch (error) {
    res.status(400).json({ message: 'Gagal mengirim pesan' });
  }
});

// --- Payment Endpoints ---
app.post('/api/payments', verifyToken, (req, res) => {
  const { bookingId, amount, paymentMethod, status } = req.body;
  const id = `PAY-${Math.floor(10000 + Math.random() * 90000)}`;
  try {
    db.prepare('INSERT INTO payments (id, booking_id, amount, payment_method, status) VALUES (?, ?, ?, ?, ?)')
      .run(id, bookingId, amount, paymentMethod, status);
    res.json({ id, status });
  } catch (error) {
    res.status(400).json({ message: 'Gagal memproses pembayaran' });
  }
});

app.get('/api/payments', verifyToken, (req, res) => {
  const { bookingId } = req.query;
  try {
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
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
});

// --- Review Endpoints ---
app.get('/api/reviews', (req, res) => {
  const { mechanicId } = req.query;
  try {
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
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat ulasan' });
  }
});

app.post('/api/reviews', verifyToken, (req, res) => {
  const { bookingId, userId, mechanicId, rating, comment } = req.body;
  const id = generateId();

  try {
    db.prepare(`
      INSERT INTO reviews (id, booking_id, user_id, mechanic_id, rating, comment)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, bookingId, userId, mechanicId, rating, comment);

    // Update mechanic average rating
    const stats = db.prepare('SELECT AVG(rating) as avg FROM reviews WHERE mechanic_id = ?').get(mechanicId);
    db.prepare('UPDATE mechanics SET rating = ? WHERE id = ?').run(stats.avg, mechanicId);

    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
    res.json(review);
  } catch (error) {
    console.error('Review error:', error);
    res.status(400).json({ message: 'Gagal menambahkan ulasan' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
