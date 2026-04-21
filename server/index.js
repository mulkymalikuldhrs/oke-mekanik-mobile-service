import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { z } from 'zod';
import db from './db.js';

const app = express();

// Security Hardening
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi nanti.' }
});

// Apply rate limiter to all API routes
app.use('/api/', limiter);
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-okemekanik-2024';

// Safety check for JWT_SECRET in production
if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'dev-secret-okemekanik-2024')) {
  console.error('FATAL: JWT_SECRET environment variable is missing or insecure in production!');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// --- Validation Schemas ---
const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  role: z.enum(['customer', 'mechanic'])
});

const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  role: z.enum(['customer', 'mechanic']),
  phone: z.string().optional()
});

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
      return res.status(401).json({ message: 'Sesi telah berakhir, silakan masuk kembali' });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

// Helper for UUID
const generateId = () => uuidv4();

// --- Socket.io Logic ---
io.on('connection', (socket) => {
  socket.on('join_booking', (bookingId) => {
    socket.join(bookingId);
  });

  socket.on('update_location', (data) => {
    io.to(data.bookingId).emit('location_updated', {
      lat: data.lat,
      lng: data.lng
    });
  });

  socket.on('send_message', (data) => {
    io.to(data.bookingId).emit('new_message', data);
  });
});

// --- Structured Logging Middleware ---
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// --- Auth Endpoints ---
app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password, role } = loginSchema.parse(req.body);
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND role = ?').get(email, role);

    if (user && await bcrypt.compare(password, user.password_hash)) {
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      const { password_hash: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } else {
      res.status(401).json({ message: 'Email atau password salah' });
    }
  } catch (err) { next(err); }
});

app.post('/api/auth/register', async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = registerSchema.parse(req.body);
    const id = generateId();
    const passwordHash = await bcrypt.hash(password, 10);

    db.prepare('INSERT INTO users (id, name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?, ?)')
      .run(id, name, email, passwordHash, role, phone || null);

    const token = jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '24h' });
    const user = { id, name, email, role, phone };
    res.json({ user, token });
  } catch (error) { next(error); }
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
app.get('/api/users/:id', (req, res) => {
  let user = db.prepare('SELECT id, name, email, role, phone FROM users WHERE id = ?').get(req.params.id);

  if (!user) {
    const mechanic = db.prepare('SELECT * FROM mechanics WHERE id = ?').get(req.params.id);
    if (mechanic) {
      user = { id: mechanic.id, name: mechanic.name, role: 'mechanic', phone: mechanic.phone };
    }
  }

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User tidak ditemukan' });
  }
});

app.put('/api/users/:id', verifyToken, (req, res) => {
  const { name, email, phone } = req.body;

  if (req.userId !== req.params.id) {
    return res.status(403).json({ message: 'Akses ditolak' });
  }

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
    res.status(400).json({ message: 'Gagal mendaftarkan mekanik' });
  }
});

app.patch('/api/mechanics/:id/status', verifyToken, (req, res) => {
  const { isOnline } = req.body;
  const mechanic = db.prepare('SELECT user_id FROM mechanics WHERE id = ? OR user_id = ?').get(req.params.id, req.params.id);

  if (!mechanic || mechanic.user_id !== req.userId) {
    return res.status(403).json({ message: 'Akses ditolak' });
  }

  db.prepare('UPDATE mechanics SET is_online = ? WHERE id = ? OR user_id = ?').run(isOnline ? 1 : 0, req.params.id, req.params.id);
  res.json({ success: true });
});

app.patch('/api/mechanics/:id/location', verifyToken, (req, res) => {
  const { lat, lng } = req.body;
  const mechanic = db.prepare('SELECT user_id FROM mechanics WHERE id = ? OR user_id = ?').get(req.params.id, req.params.id);

  if (!mechanic || mechanic.user_id !== req.userId) {
    return res.status(403).json({ message: 'Akses ditolak' });
  }

  db.prepare('UPDATE mechanics SET lat = ?, lng = ? WHERE id = ? OR user_id = ?').run(lat, lng, req.params.id, req.params.id);

  const activeBooking = db.prepare("SELECT id FROM bookings WHERE mechanic_id = (SELECT id FROM mechanics WHERE user_id = ?) AND status IN ('otw', 'working')").get(req.userId);
  if (activeBooking) {
    io.to(activeBooking.id).emit('location_updated', { lat, lng });
  }

  res.json({ success: true });
});

// --- AI Diagnostic Engine (v5.2 ULTIMATE - Advanced technical keyword & pattern mapping) ---
const AI_MODEL = [
  { id: 'svc-7', name: 'Cek Aki', keywords: { aki: 12, battery: 12, stater: 10, tekor: 11, soak: 12, mati: 2, 'nggak nyala': 8, drop: 10, 'stater berat': 11, 'voltase': 9, 'alternator': 7, 'dinamo starter': 10, 'accu': 12, 'terminal aki': 8, 'amper': 9, 'kabel aki': 7, 'elektrolit': 6, 'berkerak': 5 } },
  { id: 'svc-1', name: 'Ganti Oli', keywords: { oli: 12, oil: 12, pelumas: 10, bocor: 6, hitam: 7, kental: 7, 'suara kasar': 8, 'mesin panas': 6, 'filter oli': 10, 'seal': 7, 'drain plug': 8, 'viskositas': 7, 'kuras': 8, 'pelumasan': 9, 'synthetic': 6, 'shell': 5, 'pertamina': 5, 'castrol': 5 } },
  { id: 'svc-3', name: 'Ganti Ban', keywords: { ban: 12, bocor: 11, tire: 12, kempes: 11, gundul: 10, pecah: 9, meletus: 11, 'kurang angin': 7, 'velg': 6, 'pentil': 7, 'tubeless': 8, 'tambal': 10, 'baling': 6, 'spooring': 5, 'balancing': 5, 'benjol': 10, 'makan samping': 8, 'retak': 7, 'tekanan': 6 } },
  { id: 'svc-6', name: 'Ganti Kampas Rem', keywords: { rem: 12, brake: 12, cit: 10, mencit: 11, pakem: 10, bunyi: 6, decit: 12, blong: 12, 'rem bunyi': 11, 'piringan': 8, 'minyak rem': 9, 'kaliper': 7, 'disk brake': 10, 'master rem': 9, 'tromol': 8, 'handbrake': 7, 'rem tangan': 7, 'keras': 6 } },
  { id: 'svc-8', name: 'Isi Freon AC', keywords: { ac: 12, freon: 12, panas: 9, dingin: 10, bau: 7, gerah: 6, 'ac mati': 11, 'nggak dingin': 12, 'kompresor': 8, 'evaporator': 8, 'filter ac': 7, 'kondensor': 9, 'magnetic clutch': 9, 'leak': 7, 'bocor halus': 8, 'anget': 10, 'lembab': 6, 'berisik': 7 } },
  { id: 'svc-5', name: 'Cek Kelistrikan', keywords: { listrik: 12, lampu: 11, kabel: 10, konslet: 12, sekring: 11, mati: 4, sensor: 9, 'putus': 8, 'korslet': 12, 'ecu': 11, 'koil': 9, 'busi': 10, 'spul': 9, 'wiring': 11, 'harness': 10, 'relay': 9, 'alternator': 10, 'dinamo ampere': 10, 'short': 11, 'grounding': 8, 'soket': 7, 'terbakar': 10 } },
  { id: 'svc-4', name: 'Tune Up', keywords: { mesin: 10, overheat: 12, asap: 10, brebet: 12, pincang: 12, mati: 6, ngadat: 12, bensin: 6, boros: 8, 'mogok': 12, 'tarikan berat': 11, 'injeksi': 11, 'karburator': 11, 'piston': 10, 'klep': 10, 'radiator': 11, 'kopling': 10, 'transmisi': 9, 'throttle body': 11, 'carbon clean': 10, 'water pump': 11, 'head gasket': 11, 'fan belt': 9, 'ngelitik': 10, 'getar': 8, 'gas': 7 } },
  { id: 'svc-2', name: 'Servis Rutin', keywords: { rutin: 12, servis: 12, service: 12, berkala: 11, checkup: 10, 'ganti sparepart': 9, 'maintenance': 11, 'tahunan': 7, 'bulanan': 6, 'perawatan': 9, 'km': 8, 'kilometer': 8, 'filter udara': 7, 'general check': 10 } }
];

app.post('/api/ai/diagnose', (req, res) => {
  const { problem } = req.body;
  if (!problem || problem.length < 5) {
    return res.status(400).json({ message: 'Deskripsi masalah terlalu pendek' });
  }

  const p = problem.toLowerCase();
  let scores = AI_MODEL.map(service => {
    let score = 0;
    let matches = 0;
    for (const [keyword, weight] of Object.entries(service.keywords)) {
      if (p.includes(keyword)) {
        score += weight;
        matches++;
      }
    }
    // Exponential Bonus for multiple keyword matches to drastically increase confidence
    if (matches > 1) {
      score += Math.pow(matches, 2);
    }
    // Super confidence boost for exact matches of primary keywords (weight >= 12)
    const primaryMatches = Object.entries(service.keywords).filter(([k, w]) => w >= 12 && p.includes(k));
    if (primaryMatches.length > 0) {
      score += (primaryMatches.length * 10);
    }

    return { ...service, score };
  });

  scores.sort((a, b) => b.score - a.score);
  const bestMatch = scores[0].score > 0 ? scores[0] : AI_MODEL.find(s => s.id === 'svc-2');

  res.json({
    suggestion: bestMatch.name,
    serviceId: bestMatch.id,
    confidence: bestMatch.score > 0 ? Math.min(bestMatch.score / 50, 1) : 0,
    version: '5.1-ultimate'
  });
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
app.post('/api/bookings', verifyToken, (req, res, next) => {
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
});

app.get('/api/bookings', verifyToken, (req, res) => {
  const { userId, mechanicId } = req.query;
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
});

app.get('/api/bookings/active', verifyToken, (req, res) => {
    const bookings = db.prepare("SELECT * FROM bookings WHERE status NOT IN ('completed', 'cancelled')").all();
    res.json(bookings.map(formatBooking));
});

app.get('/api/bookings/:id', verifyToken, (req, res) => {
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  if (booking) { res.json(formatBooking(booking)); } else { res.status(404).json({ message: 'Booking tidak ditemukan' }); }
});

app.patch('/api/bookings/:id/status', verifyToken, (req, res) => {
  const { status } = req.body;
  const bookingOrig = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);

  if (!bookingOrig) { return res.status(404).json({ message: 'Booking tidak ditemukan' }); }

  const mechanic = db.prepare('SELECT id FROM mechanics WHERE user_id = ?').get(req.userId);
  if (bookingOrig.user_id !== req.userId && (!mechanic || bookingOrig.mechanic_id !== mechanic.id)) {
    return res.status(403).json({ message: 'Akses ditolak' });
  }

  db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, req.params.id);
  io.to(req.params.id).emit('status_updated', { status });
  res.json(formatBooking(db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id)));
});

// --- Message Endpoints ---
app.get('/api/messages', verifyToken, (req, res) => {
  const { bookingId } = req.query;
  const messages = db.prepare('SELECT * FROM messages WHERE booking_id = ? ORDER BY created_at ASC').all(bookingId);
  res.json(messages.map(m => ({ id: m.id, bookingId: m.booking_id, senderId: m.sender_id, text: m.text, createdAt: m.created_at })));
});

app.post('/api/messages', verifyToken, (req, res) => {
  const { bookingId, text } = req.body;
  const id = generateId();

  const booking = db.prepare('SELECT user_id, mechanic_id FROM bookings WHERE id = ?').get(bookingId);
  const mechanic = db.prepare('SELECT id FROM mechanics WHERE user_id = ?').get(req.userId);

  if (!booking || (booking.user_id !== req.userId && (!mechanic || booking.mechanic_id !== mechanic.id))) {
    return res.status(403).json({ message: 'Akses ditolak' });
  }

  db.prepare('INSERT INTO messages (id, booking_id, sender_id, text) VALUES (?, ?, ?, ?)').run(id, bookingId, req.userId, text);
  const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(id);
  const response = { id: message.id, bookingId: message.booking_id, senderId: message.sender_id, text: message.text, createdAt: message.created_at };
  io.to(bookingId).emit('new_message', response);
  res.json(response);
});

// --- Payment Endpoints ---
app.post('/api/payments', verifyToken, (req, res) => {
    const { bookingId, amount, paymentMethod, status } = req.body;
    const booking = db.prepare('SELECT user_id FROM bookings WHERE id = ?').get(bookingId);
    if (!booking || booking.user_id !== req.userId) { return res.status(403).json({ message: 'Akses ditolak' }); }

    const id = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;
    db.prepare('INSERT INTO payments (id, booking_id, amount, payment_method, status) VALUES (?, ?, ?, ?, ?)')
      .run(id, bookingId, amount, paymentMethod, status);
    res.json({ id, status });
});

app.get('/api/payments', verifyToken, (req, res) => {
    const { bookingId } = req.query;
    const payment = db.prepare('SELECT * FROM payments WHERE booking_id = ?').get(bookingId);
    if (payment) {
        res.json({ id: payment.id, amount: payment.amount, status: payment.status, paymentMethod: payment.payment_method });
    } else { res.status(404).json({ message: 'Pembayaran tidak ditemukan' }); }
});

// --- Review Endpoints ---
app.get('/api/reviews', (req, res) => {
  const { mechanicId } = req.query;
  const reviews = mechanicId
    ? db.prepare('SELECT * FROM reviews WHERE mechanic_id = ? ORDER BY created_at DESC').all(mechanicId)
    : db.prepare('SELECT * FROM reviews ORDER BY created_at DESC').all();
  res.json(reviews.map(r => ({ id: r.id, bookingId: r.booking_id, userId: r.user_id, mechanicId: r.mechanic_id, rating: r.rating, comment: r.comment, createdAt: r.created_at })));
});

app.post('/api/reviews', verifyToken, (req, res) => {
  const { bookingId, mechanicId, rating, comment } = req.body;
  const id = generateId();
  const booking = db.prepare('SELECT user_id FROM bookings WHERE id = ?').get(bookingId);
  if (!booking || booking.user_id !== req.userId) { return res.status(403).json({ message: 'Akses ditolak' }); }

  try {
    db.prepare('INSERT INTO reviews (id, booking_id, user_id, mechanic_id, rating, comment) VALUES (?, ?, ?, ?, ?, ?)')
      .run(id, bookingId, req.userId, mechanicId, rating, comment);
    const stats = db.prepare('SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE mechanic_id = ?').get(mechanicId);
    db.prepare('UPDATE mechanics SET rating = ? WHERE id = ?').run(stats.avg, mechanicId);
    res.json(db.prepare('SELECT * FROM reviews WHERE id = ?').get(id));
  } catch (error) { res.status(400).json({ message: 'Gagal menambahkan ulasan' }); }
});

// Helper to format booking response
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

// Centralized error handler
app.use((err, req, res, next) => {
  if (err instanceof z.ZodError) {
    return res.status(400).json({ message: 'Validasi gagal', errors: err.errors });
  }

  const isDev = process.env.NODE_ENV === 'development';
  console.error(isDev ? err.stack : `[Error] ${err.message}`);

  res.status(err.status || 500).json({
    message: isDev ? err.message : 'Terjadi kesalahan internal pada server',
    error: isDev ? err.stack : undefined
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
