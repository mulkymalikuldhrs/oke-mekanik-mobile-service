import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export const verifyToken = (req, res, next) => {
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
