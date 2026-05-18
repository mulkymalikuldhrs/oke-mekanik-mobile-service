import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import db from './db.js';
import { PORT } from './config.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app = express();

// Security Hardening
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi nanti.' }
});

app.use('/api/', limiter);
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware to attach Socket.io to request
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(express.json());

// --- Structured Logging Middleware ---
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/ai', aiRoutes);

// Other endpoints (legacy/simple)
app.get('/api/health', (req, res) => {
  try {
    db.prepare('SELECT 1').get();
    res.json({
      status: 'ok',
      database: 'connected',
      version: 'v5.8.1-ultimate',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', message: error.message });
  }
});

// For demonstration, these remain in index.js or could be further modularized
app.get('/api/mechanics', (req, res) => {
  const mechanics = db.prepare('SELECT * FROM mechanics').all();
  res.json(mechanics.map(m => ({
    ...m,
    speciality: m.speciality ? m.speciality.split(', ') : [],
    isOnline: !!m.is_online,
    pricePerHour: m.price_per_hour
  })));
});

app.get('/api/services', (req, res) => {
  const services = db.prepare('SELECT * FROM services').all();
  res.json(services.map(s => ({
    id: s.id,
    name: s.name,
    description: s.description,
    basePrice: s.base_price,
    estimatedDuration: s.estimated_duration
  })));
});

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

// Centralized error handler
app.use((err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';
  const statusCode = err.status || err.statusCode || 500;
  console.error(`[Error] ${new Date().toISOString()} - ${req.method} ${req.url}: ${err.message}`);

  res.status(statusCode).json({
    message: isDev ? err.message : 'Terjadi kesalahan internal pada server',
    code: err.code || 'INTERNAL_SERVER_ERROR',
    timestamp: new Date().toISOString(),
    path: req.url
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
