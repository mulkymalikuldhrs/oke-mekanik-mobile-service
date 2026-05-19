import db from '../db.js';

export const getUserById = (req, res) => {
  if (req.userId !== req.params.id) {
    return res.status(403).json({ message: 'Akses ditolak' });
  }

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
};

export const updateUserProfile = (req, res) => {
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
};
