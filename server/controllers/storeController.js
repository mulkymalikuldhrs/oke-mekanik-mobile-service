import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';

function deg2rad(deg) { return deg * (Math.PI / 180); }

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat/2)*Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1))*Math.cos(deg2rad(lat2))*
    Math.sin(dLon/2)*Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export const getAllStores = (req, res) => {
  const stores = db.prepare('SELECT * FROM stores').all();
  res.json(stores);
};

export const getNearbyStores = (req, res) => {
  const { lat, lng, radius } = req.query;
  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);
  const searchRadius = parseFloat(radius) || 25;

  const stores = db.prepare('SELECT * FROM stores WHERE is_online = 1').all();

  if (isNaN(userLat) || isNaN(userLng)) {
    return res.json(stores);
  }

  const nearby = stores
    .map(s => ({
      ...s,
      distance: getDistance(userLat, userLng, s.lat, s.lng),
      etaMinutes: Math.max(10, Math.round(getDistance(userLat, userLng, s.lat, s.lng) / 25 * 60))
    }))
    .filter(s => s.distance <= searchRadius)
    .sort((a, b) => a.distance - b.distance);

  res.json(nearby);
};

export const getStoreById = (req, res) => {
  const store = db.prepare('SELECT * FROM stores WHERE id = ? OR user_id = ?').get(req.params.id, req.params.id);
  if (!store) {
    return res.status(404).json({ message: 'Toko/Bengkel tidak ditemukan' });
  }

  const products = db.prepare('SELECT * FROM products WHERE store_id = ?').all(store.id);
  const paymentMethods = db.prepare('SELECT * FROM seller_payment_methods WHERE store_id = ? OR user_id = ?').all(store.id, store.user_id);

  res.json({
    ...store,
    products,
    paymentMethods
  });
};

export const registerStore = (req, res) => {
  const { name, address, lat, lng, phone, description, paymentInfo, bankName, accountNumber, accountHolder } = req.body;
  const storeId = `store-${uuidv4().slice(0, 8)}`;

  try {
    const user = db.prepare('SELECT role FROM users WHERE id = ?').get(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    // Update user role if needed
    db.prepare("UPDATE users SET role = 'store' WHERE id = ?").run(req.userId);

    db.prepare(`
      INSERT INTO stores (id, user_id, name, address, lat, lng, phone, description, payment_info)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      storeId,
      req.userId,
      name,
      address || 'Jakarta',
      lat || -6.2088,
      lng || 106.8456,
      phone || '',
      description || 'Toko Suku Cadang & Aksesoris Otomotif',
      paymentInfo || `${bankName || 'BCA'}: ${accountNumber || '-'} a.n ${accountHolder || name}`
    );

    if (bankName && accountNumber && accountHolder) {
      const pmId = `pay-m-${uuidv4().slice(0, 8)}`;
      db.prepare(`
        INSERT INTO seller_payment_methods (id, user_id, store_id, bank_name, account_number, account_holder)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(pmId, req.userId, storeId, bankName, accountNumber, accountHolder);
    }

    res.json({ success: true, storeId });
  } catch (error) {
    console.error('Register store error:', error);
    res.status(400).json({ message: 'Gagal mendaftarkan toko' });
  }
};

export const getPaymentMethods = (req, res) => {
  const { storeId } = req.params;
  const userId = req.userId || null;
  const methods = db.prepare('SELECT * FROM seller_payment_methods WHERE store_id = ? OR user_id = ?').all(storeId, userId);
  res.json(methods);
};

export const addPaymentMethod = (req, res) => {
  const { bankName, accountNumber, accountHolder, qrCodeUrl, storeId } = req.body;
  const id = `pay-m-${uuidv4().slice(0, 8)}`;

  try {
    db.prepare(`
      INSERT INTO seller_payment_methods (id, user_id, store_id, bank_name, account_number, account_holder, qr_code_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, req.userId, storeId || null, bankName, accountNumber, accountHolder, qrCodeUrl || null);

    res.json({ success: true, paymentMethodId: id });
  } catch (error) {
    console.error('Add payment method error:', error);
    res.status(400).json({ message: 'Gagal menambahkan metode pembayaran seller' });
  }
};
