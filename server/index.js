import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db.js';

const app = express();
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'okemekanik-super-secret-key';

app.use(cors());
app.use(express.json());

// Helper for UUID
const generateId = () => uuidv4();

// Standardized Error Response Helper
const sendError = (res, message, status = 500) => {
  res.status(status).json({ message });
};

// Middleware: Verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Akses ditolak. Token tidak ditemukan.', 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, 'Token tidak valid atau kadaluarsa.', 401);
  }
};

// --- Auth Endpoints ---

app.get('/api/auth/me', verifyToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, role, phone FROM users WHERE id = ?').get(req.user.id);
    if (!user) return sendError(res, 'User tidak ditemukan', 404);
    res.json({ user });
  } catch (error) {
    sendError(res, 'Gagal memuat data user');
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND role = ?').get(email, role);

    if (user && bcrypt.compareSync(password, user.password)) {
      const { password: _, ...userWithoutPassword } = user;
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ user: userWithoutPassword, token });
    } else {
      sendError(res, 'Email atau password salah', 401);
    }
  } catch (error) {
    sendError(res, 'Terjadi kesalahan saat login');
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, phone } = req.body;
  const id = generateId();
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    db.prepare('INSERT INTO users (id, name, email, password, role, phone) VALUES (?, ?, ?, ?, ?, ?)')
      .run(id, name, email, hashedPassword, role, phone || null);

    const user = { id, name, email, role, phone };
    const token = jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ user, token });
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      return sendError(res, 'Email sudah terdaftar', 400);
    }
    sendError(res, 'Gagal melakukan registrasi');
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
    sendError(res, 'Gagal memuat daftar mekanik');
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
      sendError(res, 'Mekanik tidak ditemukan', 404);
    }
  } catch (error) {
    sendError(res, 'Gagal memuat profil mekanik');
  }
});

app.patch('/api/mechanics/:id/status', verifyToken, (req, res) => {
  const { isOnline } = req.body;
  try {
    // Basic authorization check: a mechanic should only be able to update their own status
    const mech = db.prepare('SELECT user_id FROM mechanics WHERE id = ? OR user_id = ?').get(req.params.id, req.params.id);
    if (!mech || (req.user.role !== 'admin' && mech.user_id !== req.user.id)) {
      return sendError(res, 'Tidak diizinkan', 403);
    }

    db.prepare('UPDATE mechanics SET is_online = ? WHERE id = ? OR user_id = ?').run(isOnline ? 1 : 0, req.params.id, req.params.id);
    res.json({ success: true });
  } catch (error) {
    sendError(res, 'Gagal memperbarui status');
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
    sendError(res, 'Gagal memuat daftar layanan');
  }
});

// --- Booking Endpoints ---
app.post('/api/bookings', verifyToken, (req, res) => {
  const { mechanicId, serviceId, vehicle, problem, location, isEmergency } = req.body;
  const userId = req.user.id;
  const id = `BOOK-${Math.floor(1000 + Math.random() * 9000)}`;

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
      id, userId, mechanicId, serviceId, vehicle.brand, vehicle.model,
      vehicle.year, vehicle.licensePlate, problem, 'pending',
      location.lat, location.lng, location.address, estimatedCost
    );

    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
    res.json(formatBooking(booking));
  } catch (error) {
    sendError(res, 'Gagal membuat pesanan');
  }
});

app.get('/api/bookings', verifyToken, (req, res) => {
  const { userId, mechanicId } = req.query;
  try {
    let bookings;
    if (userId) {
      if (req.user.id !== userId && req.user.role !== 'admin') return sendError(res, 'Tidak diizinkan', 403);
      bookings = db.prepare('SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    } else if (mechanicId) {
      const mech = db.prepare('SELECT id, user_id FROM mechanics WHERE id = ? OR user_id = ?').get(mechanicId, mechanicId);
      if (!mech || (req.user.id !== mech.user_id && req.user.role !== 'admin')) return sendError(res, 'Tidak diizinkan', 403);
      bookings = db.prepare('SELECT * FROM bookings WHERE mechanic_id = ? ORDER BY created_at DESC').all(mech.id);
    } else {
      if (req.user.role !== 'admin') return sendError(res, 'Tidak diizinkan', 403);
      bookings = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
    }
    res.json(bookings.map(formatBooking));
  } catch (error) {
    sendError(res, 'Gagal memuat daftar pesanan');
  }
});

app.get('/api/bookings/active', verifyToken, (req, res) => {
  try {
    let query = "SELECT * FROM bookings WHERE status NOT IN ('completed', 'cancelled')";
    let params = [];

    if (req.user.role === 'customer') {
      query += " AND user_id = ?";
      params.push(req.user.id);
    } else if (req.user.role === 'mechanic') {
      const mech = db.prepare('SELECT id FROM mechanics WHERE user_id = ?').get(req.user.id);
      if (mech) {
        query += " AND mechanic_id = ?";
        params.push(mech.id);
      }
    }

    const bookings = db.prepare(query).all(...params);
    res.json(bookings.map(formatBooking));
  } catch (error) {
    sendError(res, 'Gagal memuat layanan aktif');
  }
});

app.get('/api/bookings/:id', verifyToken, (req, res) => {
  try {
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    if (!booking) return sendError(res, 'Booking tidak ditemukan', 404);

    // Auth check
    const mech = db.prepare('SELECT user_id FROM mechanics WHERE id = ?').get(booking.mechanic_id);
    if (req.user.id !== booking.user_id && req.user.id !== mech?.user_id && req.user.role !== 'admin') {
       return sendError(res, 'Tidak diizinkan', 403);
    }

    res.json(formatBooking(booking));
  } catch (error) {
    sendError(res, 'Gagal memuat detail pesanan');
  }
});

app.patch('/api/bookings/:id/status', verifyToken, (req, res) => {
  const { status } = req.body;
  try {
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    if (!booking) return sendError(res, 'Booking tidak ditemukan', 404);

    // Authorization: Both customer and mechanic can update status in certain cases, but let's keep it simple
    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, req.params.id);
    const updated = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    res.json(formatBooking(updated));
  } catch (error) {
    sendError(res, 'Gagal memperbarui status pesanan');
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
    sendError(res, 'Gagal memuat pesan');
  }
});

app.post('/api/messages', verifyToken, (req, res) => {
  const { bookingId, text } = req.body;
  const senderId = req.user.id;
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
    sendError(res, 'Gagal mengirim pesan');
  }
});

// --- Payment Endpoints ---
app.post('/api/payments', verifyToken, (req, res) => {
  const { bookingId, amount, paymentMethod, status } = req.body;
  const id = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;
  try {
    db.prepare('INSERT INTO payments (id, booking_id, amount, payment_method, status) VALUES (?, ?, ?, ?, ?)')
      .run(id, bookingId, amount, paymentMethod, status);
    res.json({ id, status });
  } catch (error) {
    sendError(res, 'Gagal memproses pembayaran');
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
      sendError(res, 'Pembayaran tidak ditemukan', 404);
    }
  } catch (error) {
    sendError(res, 'Gagal memuat data pembayaran');
  }
});

// Helper to format booking response
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
    createdAt: b.created_at
  };
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
