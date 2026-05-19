import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';
import { JWT_SECRET } from '../config.js';

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

export const login = async (req, res, next) => {
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
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = registerSchema.parse(req.body);
    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);

    db.prepare('INSERT INTO users (id, name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?, ?)')
      .run(id, name, email, passwordHash, role, phone || null);

    const token = jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '24h' });
    const user = { id, name, email, role, phone };
    res.json({ user, token });
  } catch (error) { next(error); }
};

export const me = (req, res) => {
  const user = db.prepare('SELECT id, name, email, role, phone FROM users WHERE id = ?').get(req.userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const refresh = (req, res) => {
  const token = jwt.sign({ id: req.userId, role: req.userRole }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
};

export const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};
