import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';

export const getAllProducts = (req, res) => {
  const { category, search, storeId } = req.query;
  let query = `
    SELECT p.*, s.name as store_name, s.address as store_address, s.phone as store_phone, s.lat as store_lat, s.lng as store_lng
    FROM products p
    JOIN stores s ON p.store_id = s.id
    WHERE 1=1
  `;
  const params = [];

  if (storeId) {
    query += ' AND p.store_id = ?';
    params.push(storeId);
  }

  if (category && category !== 'all') {
    query += ' AND p.category = ?';
    params.push(category);
  }

  if (search) {
    query += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.vehicle_compatibility LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  query += ' ORDER BY p.created_at DESC';

  const products = db.prepare(query).all(...params);
  res.json(products);
};

export const getProductById = (req, res) => {
  const product = db.prepare(`
    SELECT p.*, s.name as store_name, s.address as store_address, s.phone as store_phone, s.user_id as store_user_id
    FROM products p
    JOIN stores s ON p.store_id = s.id
    WHERE p.id = ?
  `).get(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Produk / sparepart tidak ditemukan' });
  }

  const paymentMethods = db.prepare('SELECT * FROM seller_payment_methods WHERE store_id = ? OR user_id = ?').all(product.store_id, product.store_user_id);

  res.json({
    ...product,
    paymentMethods
  });
};

export const createProduct = (req, res) => {
  const { name, category, price, stock, image, description, vehicleCompatibility } = req.body;
  const store = db.prepare('SELECT id FROM stores WHERE user_id = ?').get(req.userId);

  if (!store) {
    return res.status(403).json({ message: 'Anda harus mendaftarkan toko terlebih dahulu' });
  }

  const productId = `prod-${uuidv4().slice(0, 8)}`;

  try {
    db.prepare(`
      INSERT INTO products (id, store_id, name, category, price, stock, image, description, vehicle_compatibility)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      productId,
      store.id,
      name,
      category || 'Sparepart',
      price,
      stock || 10,
      image || '📦',
      description || '',
      vehicleCompatibility || 'Universal'
    );

    res.json({ success: true, productId });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({ message: 'Gagal menambahkan produk' });
  }
};

export const updateProduct = (req, res) => {
  const store = db.prepare('SELECT id FROM stores WHERE user_id = ?').get(req.userId);
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);

  if (!product || !store || product.store_id !== store.id) {
    return res.status(403).json({ message: 'Akses ditolak' });
  }

  const { name, category, price, stock, image, description, vehicleCompatibility } = req.body;

  db.prepare(`
    UPDATE products
    SET name = ?, category = ?, price = ?, stock = ?, image = ?, description = ?, vehicle_compatibility = ?
    WHERE id = ?
  `).run(
    name || product.name,
    category || product.category,
    price || product.price,
    stock !== undefined ? stock : product.stock,
    image || product.image,
    description || product.description,
    vehicleCompatibility || product.vehicle_compatibility,
    req.params.id
  );

  res.json({ success: true });
};

export const deleteProduct = (req, res) => {
  const store = db.prepare('SELECT id FROM stores WHERE user_id = ?').get(req.userId);
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);

  if (!product || !store || product.store_id !== store.id) {
    return res.status(403).json({ message: 'Akses ditolak' });
  }

  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ success: true });
};
