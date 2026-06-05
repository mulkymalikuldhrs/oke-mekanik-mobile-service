import { z } from 'zod';
import db from '../db.js';

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').optional(),
  email: z.string().email('Email tidak valid').optional(),
  phone: z.string().optional(),
});

export const getUserById = (req, res) => {
  if (req.userId !== req.params.id) {
    return res.status(403).json({ message: 'Akses ditolak' });
  }

  let user = db.prepare('SELECT id, name, email, role, phone FROM users WHERE id = ?').get(req.params.id);

  if (!user) {
    const mechanic = db.prepare('SELECT id, name, phone FROM mechanics WHERE id = ?').get(req.params.id);
    if (mechanic) {
      user = { id: mechanic.id, name: mechanic.name, role: 'mechanic', phone: mechanic.phone };
    }
  }

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User tidak ditemukan' });
  }
};

export const updateUserProfile = (req, res) => {
  try {
    const { name, email, phone } = updateProfileSchema.parse(req.body);

    if (req.userId !== req.params.id) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }

    db.prepare('UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?')
      .run(name, email, phone, req.params.id);
    const user = db.prepare('SELECT id, name, email, role, phone FROM users WHERE id = ?').get(req.params.id);
    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validasi gagal', errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })) });
    }
    res.status(400).json({ message: 'Gagal memperbarui profil' });
  }
};
