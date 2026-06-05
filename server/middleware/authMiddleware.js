import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import type { Request, Response, NextFunction } from 'express';

interface JwtPayload {
  id: string;
  role: string;
}

export const authenticate = (req: Request & { userId?: string; userRole?: string }, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Sesi telah berakhir, silakan masuk kembali' });
    }
    const payload = decoded as JwtPayload;
    req.userId = payload.id;
    req.userRole = payload.role;
    next();
  });
};

// Alias for backward compatibility
export const verifyToken = authenticate;

export const requireAdmin = (req: Request & { userRole?: string }, res: Response, next: NextFunction) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak. Hanya admin yang diizinkan.' });
  }
  next();
};

export const requireCustomer = (req: Request & { userRole?: string }, res: Response, next: NextFunction) => {
  if (req.userRole !== 'customer' && req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak.' });
  }
  next();
};

export const requireMechanic = (req: Request & { userRole?: string }, res: Response, next: NextFunction) => {
  if (req.userRole !== 'mechanic' && req.userRole !== 'workshop' && req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak.' });
  }
  next();
};
