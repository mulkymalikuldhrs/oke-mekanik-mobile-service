import express from 'express';
import crypto from 'crypto';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import db from './db.js';
import { JWT_SECRET } from './config.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import mechanicRoutes from './routes/mechanicRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import userRoutes from './routes/userRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Middleware Imports
import { errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Security Hardening
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi nanti.' }
});

app.use('/api/', limiter);
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH']
  }
});

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'dev-secret-okemekanik-2024')) {
  console.error('FATAL: JWT_SECRET environment variable is missing or insecure in production!');
  process.exit(1);
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Request Trace ID & Socket Attach
app.use((req, res, next) => {
  req.id = crypto.randomUUID();
  req.io = io;
  next();
});

// Advanced Observability Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[TRACE:${req.id}] ${new Date().toISOString()} | ${req.method} ${req.originalUrl} | STATUS:${res.statusCode} | ${duration}ms`);
  });
  next();
});

// Socket.io Logic with Room Management
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log(`[SOCKET] Client connected: ${socket.id}`);

  socket.on('join_booking', (bookingId) => {
    socket.join(bookingId);
    console.log(`[SOCKET] ${socket.id} joined booking room: ${bookingId}`);
  });

  socket.on('leave_booking', (bookingId) => {
    socket.leave(bookingId);
  });

  socket.on('update_location', (data) => {
    io.to(data.bookingId).emit('location_updated', {
      lat: data.lat,
      lng: data.lng,
      timestamp: Date.now()
    });
  });

  socket.on('send_message', (data) => {
    io.to(data.bookingId).emit('new_message', data);
  });

  socket.on('mechanic_online', (data) => {
    connectedUsers.set(data.mechanicId, socket.id);
    io.emit('mechanic_status_changed', { mechanicId: data.mechanicId, isOnline: true });
  });

  socket.on('mechanic_offline', (data) => {
    connectedUsers.delete(data.mechanicId);
    io.emit('mechanic_status_changed', { mechanicId: data.mechanicId, isOnline: false });
  });

  socket.on('disconnect', () => {
    // Clean up disconnected users
    for (const [key, value] of connectedUsers.entries()) {
      if (value === socket.id) {
        connectedUsers.delete(key);
        break;
      }
    }
    console.log(`[SOCKET] Client disconnected: ${socket.id}`);
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/mechanics', mechanicRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Health Check with system stats
app.get('/api/health', (req, res) => {
  const onlineMechanics = db.prepare('SELECT count(*) as count FROM mechanics WHERE is_online = 1').get().count;
  const activeBookings = db.prepare("SELECT count(*) as count FROM bookings WHERE status NOT IN ('completed', 'cancelled')").get().count;
  const totalUsers = db.prepare('SELECT count(*) as count FROM users').get().count;
  
  res.json({
    status: 'ok',
    service: 'Oke Mekanik API',
    version: '6.1.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    stats: {
      onlineMechanics,
      activeBookings,
      totalUsers,
      connectedSockets: io.sockets.sockets.size
    }
  });
});

// Error Handler
app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════════╗
  ║                                                  ║
  ║   🔧 OKE MEKANIK - Backend Server v6.1.0        ║
  ║   "Uber untuk Mekanik/Bengkel"                   ║
  ║                                                  ║
  ║   Server: http://localhost:${PORT}                 ║
  ║   API:    http://localhost:${PORT}/api/health      ║
  ║   Socket: Enabled                                ║
  ║                                                  ║
  ╚══════════════════════════════════════════════════╝
  `);
});

export { io, connectedUsers };
