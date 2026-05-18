import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, 'okemekanik.db'));

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    bio TEXT,
    verified_status INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS mechanics (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    name TEXT NOT NULL,
    speciality TEXT,
    rating REAL DEFAULT 4.5,
    price_per_hour INTEGER DEFAULT 50000,
    is_online INTEGER DEFAULT 1,
    lat REAL,
    lng REAL,
    avatar TEXT,
    identity_number TEXT,
    phone TEXT,
    years_of_experience INTEGER,
    bio TEXT,
    balance INTEGER DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS spare_parts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT,
    category TEXT,
    price INTEGER NOT NULL,
    stock INTEGER DEFAULT 0,
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    base_price INTEGER NOT NULL,
    estimated_duration INTEGER DEFAULT 60 -- minutes
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    mechanic_id TEXT NOT NULL,
    service_id TEXT NOT NULL,
    vehicle_brand TEXT,
    vehicle_model TEXT,
    vehicle_year TEXT,
    vehicle_license_plate TEXT,
    problem TEXT,
    status TEXT NOT NULL,
    location_lat REAL,
    location_lng REAL,
    location_address TEXT,
    labor_cost INTEGER DEFAULT 0,
    parts_cost INTEGER DEFAULT 0,
    service_fee INTEGER DEFAULT 15000,
    total_cost INTEGER DEFAULT 0,
    is_emergency INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(mechanic_id) REFERENCES mechanics(id),
    FOREIGN KEY(service_id) REFERENCES services(id)
  );

  CREATE TABLE IF NOT EXISTS booking_items (
    id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL,
    item_type TEXT NOT NULL, -- 'service' or 'part'
    item_id TEXT,
    name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price INTEGER NOT NULL,
    total_price INTEGER NOT NULL,
    FOREIGN KEY(booking_id) REFERENCES bookings(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    text TEXT NOT NULL,
    type TEXT DEFAULT 'text', -- 'text' or 'system'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(booking_id) REFERENCES bookings(id)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    payment_method TEXT,
    status TEXT NOT NULL,
    transaction_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(booking_id) REFERENCES bookings(id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    mechanic_id TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(booking_id) REFERENCES bookings(id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(mechanic_id) REFERENCES mechanics(id)
  );

  CREATE TABLE IF NOT EXISTS activity_feed (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    mechanic_id TEXT,
    type TEXT NOT NULL, -- 'service_completed', 'new_review', 'promo'
    title TEXT,
    content TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Performance Indexes
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
  CREATE INDEX IF NOT EXISTS idx_bookings_mechanic_id ON bookings(mechanic_id);
  CREATE INDEX IF NOT EXISTS idx_messages_booking_id ON messages(booking_id);
  CREATE INDEX IF NOT EXISTS idx_reviews_mechanic_id ON reviews(mechanic_id);
  CREATE INDEX IF NOT EXISTS idx_activity_feed_created ON activity_feed(created_at);
`);

// Seed initial data if empty
const seedData = async () => {
  const userCount = db.prepare('SELECT count(*) as count FROM users').get().count;
  if (userCount === 0) {
    console.log('Seeding initial data for v28.1 ULTIMATE+...');

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash('password123', salt);

    // Seed Users
    const insertUser = db.prepare('INSERT INTO users (id, name, email, password_hash, role, phone, verified_status) VALUES (?, ?, ?, ?, ?, ?, ?)');
    insertUser.run('cust-1', 'Joko Susilo', 'customer@example.com', hashedPass, 'customer', '08111111111', 1);
    insertUser.run('mech-1-user', 'Jane Mechanic', 'mechanic@example.com', hashedPass, 'mechanic', '08123456789', 1);
    insertUser.run('mech-2-user', 'Budi Santoso', 'budi@example.com', hashedPass, 'mechanic', '08987654321', 1);
    insertUser.run('mech-3-user', 'Siti Aminah', 'siti@example.com', hashedPass, 'mechanic', '081222333444', 1);

    // Seed Mechanics
    const insertMechanic = db.prepare('INSERT INTO mechanics (id, user_id, name, speciality, rating, price_per_hour, is_online, lat, lng, avatar, years_of_experience, phone, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    insertMechanic.run('mech-1', 'mech-1-user', 'Jane Mechanic', 'Ganti Oli, Ban', 4.8, 75000, 1, -6.2200, 106.8300, '👩‍🔧', 5, '08123456789', 'Berpengalaman menangani berbagai jenis kendaraan roda dua dan roda empat.');
    insertMechanic.run('mech-2', 'mech-2-user', 'Budi Santoso', 'Servis Mesin, Aki', 4.9, 85000, 1, -6.1500, 106.9000, '👨‍🔧', 10, '08987654321', 'Spesialis mesin mobil Eropa dan Jepang.');
    insertMechanic.run('mech-3', 'mech-3-user', 'Siti Aminah', 'Spesialis Rem, Suspensi', 4.7, 90000, 1, -6.2000, 106.8100, '👩‍🔧', 7, '081222333444', 'Ahli dalam sistem pengereman dan kaki-kaki kendaraan.');

    // Seed Spare Parts
    const insertPart = db.prepare('INSERT INTO spare_parts (id, name, brand, category, price, stock) VALUES (?, ?, ?, ?, ?, ?)');
    insertPart.run('part-1', 'Oli Shell Helix HX7 10W-40', 'Shell', 'Oli', 350000, 50);
    insertPart.run('part-2', 'Aki GS Astra Maintenance Free', 'GS Astra', 'Aki', 850000, 20);
    insertPart.run('part-3', 'Kampas Rem Depan Avanza', 'Toyota Genuine', 'Rem', 220000, 30);
    insertPart.run('part-4', 'Filter Udara Honda Vario', 'Honda Genuine', 'Filter', 65000, 100);
    insertPart.run('part-5', 'Busi Denso Iridium', 'Denso', 'Mesin', 95000, 200);

    // Seed Services
    const insertService = db.prepare('INSERT INTO services (id, name, description, base_price, estimated_duration) VALUES (?, ?, ?, ?, ?)');
    insertService.run('svc-1', 'Ganti Oli', 'Penggantian oli mesin berkualitas', 50000, 30);
    insertService.run('svc-2', 'Servis Rutin', 'Pengecekan menyeluruh kendaraan', 150000, 90);
    insertService.run('svc-3', 'Tune Up', 'Optimasi mesin dan pembersihan karbon', 250000, 120);
    insertService.run('svc-4', 'Ganti Ban', 'Penggantian ban atau tambal ban', 80000, 45);

    // Seed Initial Activity Feed
    const insertFeed = db.prepare('INSERT INTO activity_feed (id, user_id, mechanic_id, type, title, content) VALUES (?, ?, ?, ?, ?, ?)');
    insertFeed.run('feed-1', 'cust-1', 'mech-1', 'service_completed', 'Servis Selesai', 'Joko Susilo baru saja menyelesaikan ganti oli bersama Jane Mechanic.');
    insertFeed.run('feed-2', 'cust-1', 'mech-2', 'new_review', 'Ulasan Baru', 'Budi Santoso mendapatkan bintang 5 dari Joko! "Sangat memuaskan".');
  }
};

seedData();

export default db;
