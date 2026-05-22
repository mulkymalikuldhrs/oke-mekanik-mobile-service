import express from 'express';
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

// Middleware Imports
import { errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Security Hardening
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
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

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'dev-secret-okemekanik-2024')) {
  console.error('FATAL: JWT_SECRET environment variable is missing or insecure in production!');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// Attach Socket.io to Request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Logging Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Socket.io Logic
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

// Health Check
app.get('/api/health', (req, res) => {
  try {
    db.prepare('SELECT 1').get();
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString(), version: 'v5.8.1-ultimate' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', message: error.message });
  }
});

// Error Handling
app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
