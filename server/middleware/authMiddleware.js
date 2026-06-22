import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export const authenticate = (req, res, next) => {
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

// Alias for backward compatibility
export const verifyToken = authenticate;

export const requireAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak. Hanya admin yang diizinkan.' });
  }
  next();
};

export const requireCustomer = (req, res, next) => {
  if (req.userRole !== 'customer' && req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak.' });
  }
  next();
};

export const requireMechanic = (req, res, next) => {
  if (req.userRole !== 'mechanic' && req.userRole !== 'workshop' && req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak.' });
  }
  next();
};
