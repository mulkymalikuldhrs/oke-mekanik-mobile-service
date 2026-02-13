import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import db from './db.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Helper for UUID
const generateId = () => uuidv4();

// --- Auth Endpoints ---
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ? AND role = ?').get(email, password, role);

  if (user) {
    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token: `fake-jwt-token-${user.id}` });
  } else {
    res.status(401).json({ message: 'Email atau password salah' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, phone } = req.body;
  const id = generateId();

  try {
    db.prepare('INSERT INTO users (id, name, email, password, role, phone) VALUES (?, ?, ?, ?, ?, ?)')
      .run(id, name, email, password, role, phone || null);

    const user = { id, name, email, role, phone };
    res.json({ user, token: `fake-jwt-token-${id}` });
  } catch (error) {
    res.status(400).json({ message: 'Email sudah terdaftar' });
  }
});

// --- Mechanic Endpoints ---
app.get('/api/mechanics', (req, res) => {
  const mechanics = db.prepare('SELECT * FROM mechanics').all();
  // Parse speciality string back to array if needed (though we'll keep it simple)
  const formatted = mechanics.map(m => ({
    ...m,
    speciality: m.speciality ? m.speciality.split(', ') : [],
    isOnline: !!m.is_online,
    pricePerHour: m.price_per_hour
  }));
  res.json(formatted);
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

app.patch('/api/mechanics/:id/status', (req, res) => {
  const { isOnline } = req.body;
  db.prepare('UPDATE mechanics SET is_online = ? WHERE id = ? OR user_id = ?').run(isOnline ? 1 : 0, req.params.id, req.params.id);
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
app.post('/api/bookings', (req, res) => {
  const { userId, mechanicId, serviceId, vehicle, problem, location, isEmergency } = req.body;
  const id = `BOOK-${Math.floor(1000 + Math.random() * 9000)}`;

  // Get service for base price
  const service = db.prepare('SELECT base_price FROM services WHERE id = ?').get(serviceId);
  const estimatedCost = (service?.base_price || 50000) + (isEmergency ? 50000 : 0);

  db.prepare(`
    INSERT INTO bookings (
      id, user_id, mechanic_id, service_id, vehicle_brand, vehicle_model,
      vehicle_year, vehicle_license_plate, problem, status,
      location_lat, location_lng, location_address, estimated_cost
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, userId || 'cust-1', mechanicId, serviceId, vehicle.brand, vehicle.model,
    vehicle.year, vehicle.licensePlate, problem, 'pending',
    location.lat, location.lng, location.address, estimatedCost
  );

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
  res.json(formatBooking(booking));
});

app.get('/api/bookings', (req, res) => {
  const { userId, mechanicId } = req.query;
  let bookings;
  if (userId) {
    bookings = db.prepare('SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC').all(userId);
  } else if (mechanicId) {
    // Also check if mechanicId matches user_id of the mechanic
    const mech = db.prepare('SELECT id FROM mechanics WHERE id = ? OR user_id = ?').get(mechanicId, mechanicId);
    bookings = db.prepare('SELECT * FROM bookings WHERE mechanic_id = ? ORDER BY created_at DESC').all(mech ? mech.id : mechanicId);
  } else {
    bookings = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
  }
  res.json(bookings.map(formatBooking));
});

app.get('/api/bookings/active', (req, res) => {
    const bookings = db.prepare("SELECT * FROM bookings WHERE status NOT IN ('completed', 'cancelled')").all();
    res.json(bookings.map(formatBooking));
});

app.get('/api/bookings/:id', (req, res) => {
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  if (booking) {
    res.json(formatBooking(booking));
  } else {
    res.status(404).json({ message: 'Booking tidak ditemukan' });
  }
});

app.patch('/api/bookings/:id/status', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, req.params.id);
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  res.json(formatBooking(booking));
});

// --- Message Endpoints ---
app.get('/api/messages', (req, res) => {
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

app.post('/api/messages', (req, res) => {
  const { bookingId, senderId, text } = req.body;
  const id = generateId();
  db.prepare('INSERT INTO messages (id, booking_id, sender_id, text) VALUES (?, ?, ?, ?)').run(id, bookingId, senderId, text);
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
app.post('/api/payments', (req, res) => {
    const { bookingId, amount, paymentMethod, status } = req.body;
    const id = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;
    db.prepare('INSERT INTO payments (id, booking_id, amount, payment_method, status) VALUES (?, ?, ?, ?, ?)')
      .run(id, bookingId, amount, paymentMethod, status);
    res.json({ id, status });
});

app.get('/api/payments', (req, res) => {
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

// Helper to format booking response
function formatBooking(b) {
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
